import { ReactNode, JSX } from 'react';

export interface IGeneralProps {
    /**
     * The Popover "Content" minimum scroll height
     */
    minHeight: number;
    /**
     * The Popover "Content" maximum scroll height. Will not work when the "screenType" is "mobile"
     */
    maxHeight: number;
    /**
     * The component that need to be displayed as Popover header. Any valid React node
     */
    Header?: ReactNode;
    /**
     * The component that need to be displayed as Popover footer. Any valid React node
     */
    Footer?: ReactNode;
    /**
     * Given content prop can have its own scroll, and with this props we can use/not use default scroll that has popover
     */
    scrollbarNeeded?: boolean;
    getScrollRef: (element: HTMLElement) => void;
    /*
     * props for scrollbar
     */
    scrollbarProps?: any;
    /**
     * The component that need to be displayed in the Popover. Any valid React node
     */
    Content: JSX.Element;
    /*
     * Popup content opens with full height. Mobile only property.
     */
    fullHeight?: boolean;
}

type TypeCheckBodyContains = (e: Event) => boolean;

export interface IHandleSwipingProps {
    deltaY: number;
    event: Event;
    setSwipingPosition: React.Dispatch<React.SetStateAction<number>>;
    checkBodyContains: TypeCheckBodyContains;
}

type TypeTouchEvent = { event: Event } & TouchEvent;

export interface IHandleSwipedDownProps {
    touchEvent: TypeTouchEvent;
    checkBodyContains: TypeCheckBodyContains;
    onSwipedDown: (e: Event) => void;
}
