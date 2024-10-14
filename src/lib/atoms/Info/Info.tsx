import React, { FC, useState } from 'react';
import classnames from 'classnames';
import { InfoOutline } from '@geneui/icons';

// Components
import Tooltip from '../../molecules/Tooltip';

// Styles
import './Info.scss';

interface IInfoProps {
    /**
     * The text that will be displayed inside the tooltip when the user interacts with the info icon.
     */
    infoText: string;
    /**
     * Disables the info icon button, preventing any interaction (click, key down, or focus).<br>
     * When `disabled` is true, the button becomes non-interactive, and the tooltip won't be shown.
     */
    disabled?: boolean;
    /**
     * Defines the size of the info icon. Available options: <br>
     * - `small`: 24px
     * - `smallNudge`: 20px (default)
     * - `XSmall`: 16px <br>
     * Possible values: `small | smallNudge | XSmall`
     */
    size?: 'small' | 'smallNudge' | 'XSmall';
    /**
     * Determines the visual appearance of the info icon. Available options:<br>
     * Possible values: `default | brand | inverse`
     */
    appearance?: 'default' | 'brand' | 'inverse';
    /**
     * Additional class for the parent element.<br>
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
}

const iconSizes = {
    small: 24,
    smallNudge: 20,
    XSmall: 16
} as const;

/**
 * Info icon component used to provide additional contextual information to users. It appears as a small icon, and is placed near elements where further explanation or clarification is useful.
 */
const Info: FC<IInfoProps> = ({ infoText, disabled, size = 'smallNudge', appearance = 'default', className }) => {
    const [alwaysShow, setAlwaysShow] = useState(false);

    const keyDownHandler = () => !disabled && setAlwaysShow((prev) => !prev);
    const handleBlur = () => !disabled && alwaysShow && setAlwaysShow(false);

    return (
        <Tooltip text={infoText} alwaysShow={alwaysShow}>
            <button
                disabled={disabled}
                className={classnames('info', className, {
                    [`info_appearance_${appearance}`]: appearance,
                    info_disabled: disabled
                })}
                onKeyDown={keyDownHandler}
                onBlur={handleBlur}
            >
                <InfoOutline className={classnames(`info__icon`)} size={iconSizes[size]} />
            </button>
        </Tooltip>
    );
};

export { IInfoProps, Info as default };
