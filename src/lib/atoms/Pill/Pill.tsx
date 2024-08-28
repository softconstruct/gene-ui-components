import React, { FC, JSX } from 'react';
import { Dot } from '@geneui/icons';
import classNames from 'classnames';

// Styles
import './Pill.scss';

interface IPillProps {
    text?: string;
    isIconAfter?: boolean;
    isFill?: boolean;
    size?: 'small_nudge' | 'small' | 'medium';
    Icon?: JSX.Element;
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
