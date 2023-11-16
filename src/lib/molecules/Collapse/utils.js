import PropTypes from 'prop-types';

import Panel from './Panel';

const deepCheck = (children) => {
    Array.from(children).every((child) => {
        Array.isArray(child) && deepCheck(child);

        return PropTypes.shape({
            type: PropTypes.instanceOf(Panel)
        });
    });
};

export default deepCheck;
