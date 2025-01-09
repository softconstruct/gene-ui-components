import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import classnames from 'classnames';

// Helpers
import { callAfterDelay, stopEvent } from 'utils';
import { useClickOutside, useKeyDown } from 'hooks';
import { keyDownKeys } from '../ComboBox/config';
import { getCaretPos, getCursorPos } from './detectPosition';

// Components
import Scrollbar from '../../atoms/Scrollbar';

// Styles
import './index.scss';

const ROW_WIDTH = 300;
const ROW_HEIGHT = 40;
const ROW_COUNT = 5;

function SuggestionList({ onChange, onHover, elemRef, data = [] }) {
    const keys = useMemo(() => data.map((i) => i.key), [data]);
    const [suggestionData, setSuggestionData] = useState(null);
    const [hoveredState, setHoveredState] = useState(0);
    const hoveredRowRef = useRef(null);
    const scrollRef = useRef(null);
    const realText = useRef();

    const dataToShow = useMemo(() => {
        if (!suggestionData) return null;
        const returnedData = suggestionData.search
            ? suggestionData.data?.filter((i) => i.label.toUpperCase().includes(suggestionData.search.toUpperCase()))
            : suggestionData.data;
        return returnedData && returnedData.length ? returnedData : null;
    }, [suggestionData]);

    if (elemRef.current) {
        elemRef.current.isSuggestionListOpen = !!dataToShow;
    }

    const getKeyIndex = useCallback(
        (inputValue) => {
            const existingKey = {
                index: -1,
                key: null
            };
            keys.forEach((i) => {
                if (inputValue.lastIndexOf(i) > existingKey.index) {
                    existingKey.index = inputValue.lastIndexOf(i);
                    existingKey.key = i;
                }
            });
            return existingKey.index > -1 ? existingKey : null;
        },
        [keys]
    );

    const arrowDownHandler = useCallback(
        (e) => {
            stopEvent(e, true);
            if (hoveredState < suggestionData.data.length - 1) {
                setHoveredState((prev) => prev + 1);
                hoverHandler(e, hoveredState + 1);
            }
            if (hoveredState === dataToShow.length - 1) return;
            const scrollElem = scrollRef.current.container.children[0];
            if (hoveredRowRef.current && scrollElem) {
                if (
                    hoveredRowRef.current.getBoundingClientRect().top - scrollElem.getBoundingClientRect().top >
                    ROW_HEIGHT * 3
                ) {
                    scrollElem.scrollTo(0, (hoveredState - 3) * ROW_HEIGHT);
                }
            }
        },
        [dataToShow, hoveredRowRef, scrollRef, hoveredState, suggestionData]
    );

    const arrowUpHandler = useCallback(
        (e) => {
            stopEvent(e, true);
            if (hoveredState > 0) {
                setHoveredState((prev) => prev - 1);
                hoverHandler(e, hoveredState - 1);
            }
            if (hoveredState === dataToShow.length - 1) return;
            const scrollElem = scrollRef.current.container.children[0];
            if (hoveredRowRef.current && scrollElem) {
                if (
                    hoveredRowRef.current.getBoundingClientRect().top - scrollElem.getBoundingClientRect().top <
                    ROW_HEIGHT * 2
                ) {
                    scrollElem.scrollTo(0, (hoveredState - 1) * ROW_HEIGHT);
                }
            }
        },
        [dataToShow, hoveredRowRef, scrollRef, hoveredState]
    );

    const onEnterHandler = useCallback(
        (e) => {
            resetText();
            if (dataToShow && dataToShow.length) {
                if (e) {
                    stopEvent(e, true);
                } else {
                    elemRef.current.focus();
                }

                const to = getCursorPos(elemRef.current).end;
                callAfterDelay(() => {
                    elemRef.current.selectionEnd = to + dataToShow[hoveredState].value.toString().length;
                });

                onChange({
                    from: to - (suggestionData.search ? suggestionData.search.length : 0) - 1,
                    data: dataToShow[hoveredState],
                    key: suggestionData.key,
                    to
                });
            }
            setSuggestionData(null);
        },
        [suggestionData, setSuggestionData, hoveredState, onChange, elemRef, dataToShow]
    );

    const hoverHandler = useCallback(
        (e, hoverIndex) => {
            if (dataToShow && dataToShow.length) {
                if (!realText.current) {
                    realText.current = elemRef.current.value;
                }

                if (e) {
                    stopEvent(e, true);
                } else {
                    elemRef.current.focus();
                }
                const to = getCursorPos(elemRef.current).end;

                callAfterDelay(() => {
                    elemRef.current.selectionEnd = to;
                });
                onHover({
                    from: to - (suggestionData.search ? suggestionData.search.length : 0),
                    data: dataToShow[hoverIndex],
                    key: suggestionData.key,
                    to
                });
            }
        },
        [suggestionData, onHover, elemRef, realText, dataToShow]
    );

    const onBackSpaseHandler = useCallback(
        (e) => {
            resetText();
            if (keys.includes(e.target.value.slice(0, getCursorPos(elemRef.current).start).slice(-1))) {
                setSuggestionData(null);
            } else {
                callAfterDelay(() => {
                    const inputValue = e.target.value;
                    const { start } = getCursorPos(elemRef.current);
                    if (!inputValue) {
                        setSuggestionData(null);
                    } else if (suggestionData && suggestionData.data.length) {
                        const fromStartToKey = inputValue.slice(0, start);
                        setSuggestionData({
                            ...suggestionData,
                            search: fromStartToKey.slice(fromStartToKey.lastIndexOf(suggestionData.key) + 1)
                        });
                    } else {
                        const fromStartToKey = inputValue.slice(0, start);
                        const lastKeyObj = getKeyIndex(fromStartToKey);

                        if (lastKeyObj) {
                            const stringAfterKey = inputValue.slice(lastKeyObj.index + 1, fromStartToKey.length);
                            if (
                                inputValue.length === 1 ||
                                (stringAfterKey.search(keyDownKeys.space) === -1 &&
                                    (lastKeyObj.index === 0 ||
                                        inputValue[lastKeyObj.index - 1] === keyDownKeys.space ||
                                        RegExp(/\n/g, 'u').test(inputValue[lastKeyObj.index - 1])))
                            ) {
                                const list = data.find((i) => i.key === lastKeyObj.key);
                                if (list) {
                                    const caretPos = getCaretPos(
                                        e,
                                        elemRef.current,
                                        fromStartToKey.split(lastKeyObj.key).length - 1,
                                        lastKeyObj.key
                                    );
                                    setSuggestionData({
                                        ...list,
                                        search: stringAfterKey,
                                        ...caretPos
                                    });
                                }
                            }
                        }
                    }
                });
            }
        },
        [setSuggestionData, suggestionData, data, keys, elemRef, getKeyIndex]
    );

    const onKeyHandler = useCallback(
        (e) => {
            callAfterDelay(() => {
                const inputValue = e.target.value;
                const { key } = e;
                const fromStartToKey = inputValue.slice(0, getCursorPos(elemRef.current).start);
                if (
                    (inputValue.length === 1 ||
                        fromStartToKey.at(-2) === keyDownKeys.space ||
                        RegExp(/\n/g, 'u').test(fromStartToKey.at(-2))) &&
                    !suggestionData
                ) {
                    const list = data.find((i) => i.key === key);
                    if (list) {
                        const caretPos = getCaretPos(e, elemRef.current, fromStartToKey.split(key).length - 1, key);
                        setSuggestionData({ ...list, ...caretPos });
                    }
                } else {
                    setSuggestionData(null);
                }
            });
        },
        [elemRef, suggestionData, setSuggestionData, data]
    );

    const resetText = () => {
        if (realText.current) {
            const cursorPosition = elemRef.current.selectionStart;
            elemRef.current.value = realText.current;
            realText.current = undefined;
            elemRef.current.selectionStart = cursorPosition;
            elemRef.current.selectionEnd = cursorPosition;
        }
    };

    const onRestKeysPressHandler = useCallback(
        (e) => {
            // Symbol is pressed
            if (e.key.length === 1) {
                resetText();
            }
            callAfterDelay(() => {
                const inputValue = e.target.value;

                const fromStartToKey = inputValue.slice(0, getCursorPos(elemRef.current).start);
                const lastKeyObj = getKeyIndex(fromStartToKey);

                if (suggestionData && lastKeyObj) {
                    setSuggestionData({
                        ...suggestionData,
                        search: fromStartToKey.slice(fromStartToKey.lastIndexOf(suggestionData.key) + 1)
                    });
                } else if (lastKeyObj) {
                    const stringAfterKey = inputValue.slice(lastKeyObj.index + 1, fromStartToKey.length);
                    if (
                        stringAfterKey.search(keyDownKeys.space) === -1 &&
                        inputValue[lastKeyObj.index - 1] === keyDownKeys.space &&
                        !RegExp(/\n/g, 'u').test(fromStartToKey.at(-1))
                    ) {
                        const list = data.find((i) => i.key === lastKeyObj.key);
                        if (list) {
                            const caretPos = getCaretPos(
                                e,
                                elemRef.current,
                                fromStartToKey.split(lastKeyObj.key).length - 1,
                                lastKeyObj.key
                            );
                            setSuggestionData({
                                ...list,
                                search: stringAfterKey,
                                ...caretPos
                            });
                        }
                    }
                } else {
                    setSuggestionData(null);
                }
            });
        },
        [elemRef, getKeyIndex, suggestionData]
    );

    const handleKeyPress = useCallback(
        (e) => {
            const { key } = e;
            switch (key) {
                case keyDownKeys.enter:
                    onEnterHandler(e);
                    break;
                case keyDownKeys.tab:
                case keyDownKeys.escape:
                case keyDownKeys.space:
                case keyDownKeys.arrowLeft:
                case keyDownKeys.arrowRight:
                    setSuggestionData(null);
                    resetText();
                    break;
                case keyDownKeys.arrowUp:
                    suggestionData && arrowUpHandler(e);
                    break;
                case keyDownKeys.arrowDown:
                    suggestionData && arrowDownHandler(e);
                    break;
                case keyDownKeys.backspace:
                    onBackSpaseHandler(e);
                    break;
                case keys[keys.indexOf(key)]:
                    onKeyHandler(e);
                    resetText();
                    break;
                default:
                    onRestKeysPressHandler(e);
            }
        },
        [onEnterHandler, setSuggestionData, suggestionData, onBackSpaseHandler, onKeyHandler, onRestKeysPressHandler]
    );

    const onMouseEnter = (e, index) => {
        setHoveredState(index);
        hoverHandler(e, index);
    };

    const height = useMemo(
        () =>
            dataToShow ? (dataToShow.length >= ROW_COUNT ? ROW_COUNT * ROW_HEIGHT : dataToShow.length * ROW_HEIGHT) : 0,
        [dataToShow]
    );

    const handleOutsideClick = useClickOutside(() => {
        setSuggestionData(null);
        resetText();
    });

    useEffect(() => {
        if (!elemRef) return;
        const handlePasteAnywhere = () => setSuggestionData(null);

        elemRef.current?.addEventListener('paste', handlePasteAnywhere);

        return () => {
            elemRef.current?.removeEventListener('paste', handlePasteAnywhere);
        };
    }, [elemRef]);

    useEffect(() => {
        setHoveredState(0);
        hoverHandler(undefined, 0);
    }, [suggestionData]);

    useKeyDown(handleKeyPress, [handleKeyPress], elemRef, []);

    const onItemClick = (event) => {
        event.stopPropagation();
        onEnterHandler();
    };

    return (
        <>
            {dataToShow && (
                <div
                    ref={handleOutsideClick}
                    className="suggestion-list"
                    style={{
                        top:
                            suggestionData.top -
                            (dataToShow.length >= ROW_COUNT ? ROW_HEIGHT * ROW_COUNT : dataToShow.length * ROW_HEIGHT),
                        left: suggestionData.left,
                        height,
                        width: ROW_WIDTH
                    }}
                >
                    <div className="suggestion-rows">
                        <Scrollbar ref={scrollRef} autoHeight autoHeightMax={ROW_COUNT * ROW_HEIGHT} size="small">
                            <ul>
                                {dataToShow.map((i, index) => (
                                    <li
                                        className={classnames({ hover: index === hoveredState })}
                                        ref={index === hoveredState ? hoveredRowRef : null}
                                        onMouseEnter={(e) => onMouseEnter(e, index)}
                                        onClick={onItemClick}
                                        key={i.label}
                                    >
                                        <span>{i.label}</span>
                                    </li>
                                ))}
                            </ul>
                        </Scrollbar>
                    </div>
                </div>
            )}
        </>
    );
}

export default SuggestionList;
