import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// Helpers
import { keyValueConfig } from 'configs';

// Components
import Icon from '../Icon';

// Styles
import './index.scss';

// TODO need to refine where is using restProps
function KeyValue({ label, value, className, icon, appearance, ...restProps }) {
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
                aria-level="1"
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
}

KeyValue.propTypes = {
    /**
     * Label for 'KeyValue'.
     */
    label: PropTypes.node.isRequired,
    /**
     * Value for 'KeyValue'.
     */
    value: PropTypes.node,
    /**
     * External/Additional className that can be added to 'KeyValue' component.
     */
    className: PropTypes.string,
    /**
     * The way how the KeyValue should be displayed.
     */
    appearance: PropTypes.oneOf(Object.keys(keyValueConfig.appearance))
};

KeyValue.defaultProps = {
    value: '',
    className: '',
    appearance: keyValueConfig.appearance.horizontal._key
};

export default KeyValue;
