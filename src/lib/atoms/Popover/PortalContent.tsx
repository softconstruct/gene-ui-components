import React, { LegacyRef, MouseEvent, MutableRefObject } from 'react';
import Scrollbar from '../Scrollbar';
import { IGeneralProps } from './types';
import classNames from 'classnames';

export interface IPortalContentProps extends IGeneralProps {
    stopEvent: () => void;
    generateContentRef: LegacyRef<HTMLUListElement>;
    swipingPosition: number;
    isMobile: boolean;
    popoverBodyRef: MutableRefObject<HTMLLIElement | null>;
    popoverStateChange: (e: MouseEvent) => void;
    width: number | null;
}

const PortalContent: React.FC<IPortalContentProps> = ({
    stopEvent,
    generateContentRef,
    swipingPosition,
    isMobile,
    Header,
    popoverBodyRef,
    scrollbarNeeded,
    Content,
    Footer,
    maxHeight,
    popoverStateChange,
    fullHeight,
    minHeight,
    scrollbarProps,
    getScrollRef,
    width
}) => {
    const extendedWidth = width ? { width } : {};

    return (
        <>
            <ul
                onClick={stopEvent}
                ref={generateContentRef}
                className={classNames('popover-content', { fullHeight: fullHeight && isMobile })}
                style={{ bottom: swipingPosition, ...extendedWidth }}
            >
                {Header && <li className="popover-header">{Header}</li>}
                <li ref={popoverBodyRef} className="popover-body">
                    {scrollbarNeeded && !isMobile ? (
                        <Scrollbar
                            ref={(scrollbar) => {
                                scrollbar && getScrollRef(scrollbar.view);
                            }}
                            autoHeight
                            autoHeightMax={maxHeight}
                            autoHeightMin={minHeight}
                            {...scrollbarProps}
                        >
                            {Content}
                        </Scrollbar>
                    ) : (
                        Content
                    )}
                </li>
                {Footer && <li className="popover-footer">{Footer}</li>}
            </ul>
            {isMobile && <div className="popover-mobile-backdrop" onClick={popoverStateChange} />}
        </>
    );
};
export default PortalContent;
