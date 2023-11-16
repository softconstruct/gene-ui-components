import ReactDOM from 'react-dom';

import { callAfterDelay, stopEvent } from 'utils';
import { getOffsetValuesAndSubscriptions, observeStickyInfo } from '../utils';
import { resizeConfigs } from '../../../../utils/configs/tableConfigs';

const resizeHandler = (
    element,
    setWidth,
    defaultWidth,
    setResizeMode,
    extraHandler,
    hasStickyElements,
    setStickyColumns,
    stickyContainer,
    eventRef,
    firstColRef,
    lastColRef,
    returnSizeHandler
) => {
    setResizeMode(true);
    const { classList } = document.body;
    const { addEventListener, removeEventListener } = window;
    const { right, width, left } = element.getBoundingClientRect();

    const resizeStart = (e) => {
        stopEvent(e);
        const { pageX } = e;

        !classList.contains('vertical-resizing-cursor') && classList.add('vertical-resizing-cursor');
        ReactDOM.unstable_batchedUpdates(() => {
            let newWidth = width + pageX - right;

            if (pageX > right || left + width < pageX) {
                setWidth(newWidth);
                extraHandler(newWidth);
            } else if (pageX < left + width) {
                if (newWidth < defaultWidth) {
                    newWidth = defaultWidth;
                }
                setWidth(newWidth);
                extraHandler(newWidth);
            }
        });
    };

    const resizeEnd = (e) => {
        stopEvent(e);

        // timout is needed to not allow `sortClick` function work, as
        // there is no workarround for preventing `click` event firing.

        callAfterDelay(() => {
            if (hasStickyElements) {
                setStickyColumns((prev) => {
                    const prevValues = Object.values(prev);
                    const { current: firstCol } = firstColRef;
                    const { current: lastCol } = lastColRef;
                    const { clientWidth: clientWidthLeft } = firstCol || {};
                    const { clientWidth: clientWidthRight } = lastCol || {};

                    prevValues.forEach((item) => item.subscriptions.map((unsubscribe) => unsubscribe()));

                    const result = Object.keys(prev)
                        .map(Number)
                        .reduce((acc, itemIndex) => {
                            const pinnedItem = getOffsetValuesAndSubscriptions(
                                acc,
                                itemIndex,
                                prev,
                                clientWidthLeft,
                                clientWidthRight,
                                observeStickyInfo,
                                stickyContainer.current,
                                eventRef.current
                            );

                            return {
                                ...acc,
                                ...pinnedItem
                            };
                        }, {});

                    return result;
                });
            }

            setResizeMode(false);
        }, 0);

        const { pageX } = e;
        ReactDOM.unstable_batchedUpdates(() => {
            let newWidth = width + pageX - right;
            if (pageX > right || left + width < pageX || pageX < left + width) {
                if (pageX < left + width && newWidth < defaultWidth) {
                    newWidth = defaultWidth;
                }
                returnSizeHandler(resizeConfigs.typeEnum.resize, newWidth);
            }
        });

        removeEventListener('mousemove', resizeStart);
        removeEventListener('mouseup', resizeEnd);

        classList.remove('vertical-resizing-cursor');
    };
    addEventListener('mousemove', resizeStart);
    addEventListener('mouseup', resizeEnd);
};

export default resizeHandler;
