import React, { FC } from 'react';
import Icon from './../Icon/index';

// Styles
import './Label.scss';

interface ILabelProps {
    /**
     * prop description
     */
    prop?: unknown;
}

/**
 * The Label component is a fundamental UI element used to display a text label. It is typically associated with input elements to provide information about what the input represents.
 */
const Label: FC<ILabelProps> = ({ prop }) => {
    return (
        <div className="label">
            <label htmlFor="#id" className="label__text label__text_medium label__text_required label__text_disabled">
                Label
            </label>
            <Icon className="label__icon label__icon_disabled" type={'bc-icon-info'} disabled={false} isFilled={true} />
        </div>
    );
};

export { ILabelProps, Label as default };
