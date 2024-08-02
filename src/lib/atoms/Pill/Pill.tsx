import React, { FC, JSX } from 'react';

// Styles
import './Pill.scss';
import classNames from 'classnames';

// Components
import IconComponent from '../Icon';

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
    Icon = <IconComponent type={'bc-icon-info'} />
}) => {
    return (
        <div
            className={classNames(`pill pill_size_${size}  pill_color_${color}`, {
                pill_icon_before: !isIconAfter,
                pill_icon_after: isIconAfter,
                pill_icon_only: !text,
                pill_fill: isFill
            })}
        >
            {Icon && Icon}
            {text && <span className="pill__text">{text}</span>}
        </div>
    );
};

export { IPillProps, Pill as default };
