import React from 'react';
import PropTypes from 'prop-types';

// Components
import ModuleTitle from '../../../../atoms/ModuleTitle';

function WithTitle({ name, actions, children, ...restProps }) {
    return (
        <>
            <ModuleTitle title={name} cornerRadius="position-radius" {...restProps}>
                {actions}
            </ModuleTitle>
            {children}
        </>
    );
}

WithTitle.propTypes = {
    name: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
    actions: PropTypes.node,
    children: PropTypes.node
};

export default WithTitle;
