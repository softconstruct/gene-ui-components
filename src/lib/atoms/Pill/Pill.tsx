import React, { FC, JSX } from 'react';
import { Dot } from '@geneui/icons';
import classNames from 'classnames';

// Styles
import './Pill.scss';

interface IPillProps {
    /**
     * The actual text content to be displayed as pill text.
     */
    text?: string;
    /**
     * Pill `Icon` position <br/>
     * If the `isIconAfter` prop is `true` the `Icon` will be displayed after the pill `text`, otherwise the `Icon` will be displayed before the `text`
     */
    isIconAfter?: boolean;
    /**
     * Pill visual appearance
     * When `isFill` prop set to `true`, the `pill` will have a solid fill, providing a more prominent visual appearance. If `false`, the `pill` will be displayed with an outlined style.
     */
    isFill?: boolean;
    /**
     * Pill size
     * Possible values: `small_nudge | small | medium`
     */
    size?: 'small_nudge' | 'small' | 'medium';
    /**
     * Pill icon <br/>
     * The `Icon` prop accepts a JSX element that will be displayed alongside the `text`
     */
    Icon?: JSX.Element;
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
}

/**
 * A Pill component used to display concise information or categorize content. Often used for labels or status indicators, Pill components are visually distinct and can convey different meanings through text and color coding.
 */
const Pill: FC<IPillProps> = ({
    color,
    size,
    text,
    isIconAfter,
    isFill,
    //@ts-ignore
    Icon = <Dot />
}) => {
    return (
        <div
            className={classNames(`pill pill_size_${size} pill_color_${color}`, {
                pill_icon_before: !isIconAfter,
                pill_icon_after: isIconAfter,
                pill_icon_only: !text,
                pill_fill: isFill
            })}
        >
            {Icon && Icon}
            {text && <span className="pill__text ellipsis-text">{text}</span>}
        </div>
    );
};

export { IPillProps, Pill as default };
