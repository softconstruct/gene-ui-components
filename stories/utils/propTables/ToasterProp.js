import React from 'react';
import PropTypes from 'prop-types';

const ToasterProp = (props) => <div></div>;

ToasterProp.propTypes = {
    defaultDuration: PropTypes.number,
    toasterPosition: PropTypes.string,
    notificationPosition: PropTypes.string
};

ToasterProp.defaultProps = {
    defaultDuration: 4000,
    toasterPosition: 'right-top',
    notificationPosition: 'right-top'
};

export default ToasterProp;
