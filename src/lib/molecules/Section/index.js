import React from 'react';
import PropTypes from 'prop-types';

import { titleConfig } from 'configs';

import Title from '../../atoms/Title';

import 'src/assets/styles/globalStyling.scss';
import './index.scss';

function Section({ children, ...restProps }) {
    return (
        <ul className="section-holder">
            <li className="section-head">
                <Title {...restProps} />
            </li>
            <li className="section-body">{children}</li>
        </ul>
    );
}

Section.propTypes = {
    /**
     * Wrapping with 'Section' anything passed as child. Any valid React node
     */
    children: PropTypes.node.isRequired,
    /**
     * Display an icon. Values are the same as "Icon" atoms type prop
     */
    icon: PropTypes.string,
    /**
     * Text/Component to be displayed. Any valid React node
     */
    text: PropTypes.node.isRequired,
    /**
     * Actions to be displayed. Any valid React node
     */
    actions: PropTypes.node,
    /**
     * Title color
     */
    color: PropTypes.oneOf(titleConfig.color),
    /**
     * Displays a divider line
     */
    withLine: PropTypes.bool,
    /**
     * Additional className
     */
    className: PropTypes.string
};

Section.defaultProps = {
    color: titleConfig.color[1],
    withLine: false
};

export default Section;
