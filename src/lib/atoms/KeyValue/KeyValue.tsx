import React, { FC, HTMLAttributes, ReactNode } from 'react';
import classnames from 'classnames';

// Configs
//@ts-ignore

// Components
import Icon from '../Icon';

// Styles
import './KeyValue.scss';

const keyValueVariants = {
    horizontal: {
        parentItemClassName: 'geneKeyValue--horizontal',
        labelClassName: 'geneKeyValue__label--horizontal',
        valueClassName: 'geneKeyValue__value--horizontal',
        iconClassName: 'geneKeyValue__icon--horizontal'
    },
    vertical: {
        parentItemClassName: '',
        itemClassName: '',
        labelClassName: '',
        valueClassName: '',
        iconClassName: ''
    }
} as const;

export const TypedKeyValueVariants = keyValueVariants as Partial<Readonly<typeof keyValueVariants>>;

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
    appearance: keyof typeof TypedKeyValueVariants;
    /**
     * The property will show icon.
     */
    icon?: string;
}

// TODO need to refine where is using restProps
const KeyValue: FC<IKeyValueProps> = ({ label, value, className, icon, appearance = 'horizontal', ...restProps }) => {
    return (
        <div
            {...restProps}
            className={classnames(`geneKeyValue ${className}`, TypedKeyValueVariants[appearance]?.parentItemClassName)}
        >
            {icon && (
                <div className="geneKeyValue__iconWrapper">
                    {/*@ts-ignore*/}
                    <Icon
                        type={icon}
                        className={classnames('geneKeyValue__icon', TypedKeyValueVariants[appearance]?.iconClassName)}
                    />
                </div>
            )}

            <p
                role="heading"
                aria-level={1}
                className={classnames('geneKeyValue__label ellipsis-text', {
                    [TypedKeyValueVariants[appearance]!.labelClassName]: appearance === 'horizontal'
                })}
            >
                {label}
            </p>
            <p
                className={classnames(
                    'geneKeyValue__value ellipsis-text',
                    TypedKeyValueVariants[appearance]?.valueClassName
                )}
            >
                {value}
            </p>
        </div>
    );
};

export default KeyValue;
