import React, { cloneElement, FC, JSX, useEffect, useRef, useState } from 'react';
import { Dot } from '@geneui/icons';
import classNames from 'classnames';

// Components
import Tooltip from '../../molecules/Tooltip';

// Hooks
import { useEllipsisDetection } from '../../../hooks';

// Styles
import './Pill.scss';

interface IPillProps {
    /**
     * The actual text content to be displayed as pill text.
     */
    text?: string;
    /**
     * Determines the position of the `Icon` relative to the `text`. <br/>
     * **Note:** If `withDot` is `true` and no custom `Icon` is provided, the dot icon will always be displayed before the text, regardless of the `iconAlignment` value.<br/>
     * Possible values: `before` or `after`.
     */
    iconAlignment?: 'before' | 'after';
    /**
     * Pill visual appearance
     * When `isFill` prop set to `true`, the `pill` will have a solid fill, providing a more prominent visual appearance. If `false`, the `pill` will be displayed with an outlined style.
     */
    isFill?: boolean;
    /**
     * Pill size
     * Possible values: `smallNudge | small | medium`
     */
    size?: 'smallNudge' | 'small' | 'medium';
    /**
     * Pill icon <br/>
     * The `Icon` prop accepts a JSX element that will be displayed alongside the `text`
     */
    Icon?: JSX.Element;
    /**
     * Displays a dot `Icon` when no custom `Icon` is provided. <br/>
     * If `true`, a dot icon will be shown unless a custom `Icon` is specified. <br/>
     * If `false`, the dot will be hidden, even if no custom `Icon` is provided.
     */

    withDot?: boolean;
    /**
     * Pill color <br/>
     * Possible values: `informative | neutral | error | success | warning | purple | lagoon | magenta | slate | inverse`
     */
    color?:
        | 'informative'
        | 'neutral'
        | 'error'
        | 'success'
        | 'warning'
        | 'purple'
        | 'lagoon'
        | 'magenta'
        | 'slate'
        | 'inverse';
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
}

const iconSizes = {
    smallNudge: 16,
    small: 20,
    medium: 20
} as const;

/**
 * A Pill component used to display concise information or categorize content. Often used for labels or status indicators, Pill components are visually distinct and can convey different meanings through text and color coding.
 */
const Pill: FC<IPillProps> = ({
    color = 'informative',
    size = 'medium',
    text,
    iconAlignment = 'before',
    isFill,
    withDot = true,
    Icon,
    className
}) => {
    const [isWithDot, setIsWithDot] = useState(withDot);
    const textRef = useRef<HTMLSpanElement | null>(null);
    const isTruncated: boolean = useEllipsisDetection(textRef, [text]);

    useEffect(() => {
        setIsWithDot(!Icon && withDot);
    }, [Icon, withDot]);

    const iconMock = Icon ? (
        cloneElement(Icon, {
            size: iconSizes[size],
            className: 'pill__icon'
        })
    ) : isWithDot ? (
        <Dot size={iconSizes[size]} className="pill__icon" />
    ) : (
        ''
    );

    return (
        <div
            className={classNames(`pill pill_size_${size} pill_color_${color}`, className, {
                [`pill_icon_${isWithDot ? 'before' : iconAlignment}`]: text && iconMock,
                pill_icon_only: !text,
                pill_fill: isFill
            })}
        >
            {iconMock}
            {text && (
                <Tooltip text={text} isVisible={isTruncated}>
                    <span ref={textRef} className="pill__text">
                        {text}
                    </span>
                </Tooltip>
            )}
        </div>
    );
};

export { IPillProps, Pill as default };
