import React, { FC, HTMLAttributes, ReactNode } from 'react';
import classnames from 'classnames';

// Configs
//@ts-ignore
import { keyValueConfig } from 'configs';

// Components
import Icon from '../Icon';

// Styles
import './KeyValue.scss';

export interface IKeyValueProps extends HTMLAttributes<HTMLDivElement> {
    /**
     * Label for 'KeyValue'.
     */
    label: ReactNode | string;
    /**
     * Value for 'KeyValue'.
     */
    value?: ReactNode | string;
    /**
     * External/Additional className that can be added to 'KeyValue' component.
     */
    className?: string;
    /**
     * The way how the KeyValue should be displayed.
     */
    appearance?: 'horizontal' | 'vertical';
    /**
     * The property will show icon.
     */
    icon?: string;
}

// TODO need to refine where is using restProps
const KeyValue: FC<IKeyValueProps> = ({
    label,
    value,
    className,
    icon,
    appearance = keyValueConfig.appearance.horizontal._key,
    ...restProps
}) => {
    return (
        <div
            {...restProps}
            className={classnames(
                `geneKeyValue ${className}`,
                keyValueConfig.appearance[appearance]?.parentItemClassName
            )}
        >
            {icon && (
                <div className="geneKeyValue__iconWrapper">
                    {/*@ts-ignore*/}
                    <Icon
                        type={icon}
                        className={classnames(
                            'geneKeyValue__icon',
                            keyValueConfig.appearance[appearance]?.iconClassName
                        )}
                    />
                </div>
            )}

            <p
                role="heading"
                aria-level={1}
                className={classnames(
                    'geneKeyValue__label ellipsis-text',
                    keyValueConfig.appearance[appearance]?.labelClassName
                )}
            >
                {label}
            </p>
            <p
                className={classnames(
                    'geneKeyValue__value ellipsis-text',
                    keyValueConfig.appearance[appearance]?.valueClassName
                )}
            >
                {value}
            </p>
        </div>
    );
};

export default KeyValue;
