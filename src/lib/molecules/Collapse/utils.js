import PropTypes from 'prop-types';

// Local components
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
