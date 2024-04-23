import React, { FC, HTMLAttributes, ReactNode } from 'react';

// Components
import Icon from '../Icon';

// Styles
import './KeyValue.scss';

export interface IKeyValueProps extends HTMLAttributes<HTMLDivElement> {
    /**
     * Label for 'KeyValue'. <br/>
     * Possible values: `ReactNode | string`
     */
    label: ReactNode | string;
    /**
     * Value for 'KeyValue'.<br/>
     * Possible values: `ReactNode | string`
     */
    value?: ReactNode | string;
    /**
     * External/Additional className that can be added to 'KeyValue' component.
     */
    className?: string;
    /**
     * The way how the KeyValue should be displayed.<br/>
     * Possible values: `horizontal | vertical`
     */
    appearance: 'horizontal' | 'vertical';
    /**
     * The property will show icon.
     */
    icon?: string;
}

// TODO need to refine where is using restProps
const KeyValue: FC<IKeyValueProps> = ({ label, value, className, icon, appearance = 'horizontal', ...restProps }) => {
    return (
        <div {...restProps} className={`geneKeyValue ${className} geneKeyValue--${appearance}`}>
            {icon && (
                <div className="geneKeyValue__iconWrapper">
                    {/*@ts-ignore*/}
                    <Icon type={icon} className={'geneKeyValue__icon'} />
                </div>
            )}

            <p
                role="heading"
                aria-level={1}
                className={`geneKeyValue__label geneKeyValue__label--${appearance} ellipsis-text`}
            >
                {label}
            </p>
            <p className={`geneKeyValue__value geneKeyValue__value--${appearance} ellipsis-text`}>{value}</p>
        </div>
    );
};

export default KeyValue;
