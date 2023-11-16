import { useState } from 'react';

function useGetColsInfo(initialValue, prefix) {
    const [colsInfo, setColsInfo] = useState(initialValue);

    const updateColsInfo = async (id, autoSizeOn, customWidth) => {
        /* TODO:
         * This is a temporary solution until we come up with something better
         * here we have a problem with rendering and using useEffect hook when we use
         * document.querySelectorAll elements are not generated and therefore we cannot
         * check their width
         */
        const autoSizeWidth = await Promise.resolve().then(() => {
            let width = 0;

            if (autoSizeOn) {
                const prevWidth = colsInfo[id].autoSizeWidth;
                const ArrayOfEls = Array.from(document.querySelectorAll(`div[data-id="${prefix}-${id}"]`));

                if (ArrayOfEls.length > 1) {
                    width = Math.max(
                        ...ArrayOfEls.map((element) => {
                            element.style.width = 'fit-content';
                            return element.clientWidth + 2;
                        })
                    );

                    ArrayOfEls.forEach((element) => {
                        element.style.width = `${width}px`;
                    });
                } else if (prevWidth) {
                    width = prevWidth;
                }
            }
            return width;
        });

        setColsInfo((prev) => ({
            ...prev,
            [id]: {
                ...colsInfo[id],
                autoSizeWidth,
                customWidth,
                autoSizeOn
            }
        }));
    };

    const reInit = (columns) => {
        const newColumns = columns.reduce((acc, column) => {
            acc[column.id] = colsInfo[column.id] || {
                autoSizeOn: null,
                customWidth: null,
                autoSizeWidth: null,
                defaultCustomWidth: null
            };
            return acc;
        }, {});
        setColsInfo(newColumns);
    };

    return [colsInfo, updateColsInfo, reInit];
}

export default useGetColsInfo;
