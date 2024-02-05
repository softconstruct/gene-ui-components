import { useEffect, useState, memo, useContext } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

// Components
import { GeneUIDesignSystemContext } from '../../providers/GeneUIProvider';

function Portal({ isOpen, children, className, container: propsContainer }) {
    const [container, setContainer] = useState(propsContainer);
    const { geneUIProviderRef } = useContext(GeneUIDesignSystemContext);

    useEffect(() => {
        if (!propsContainer) {
            const div = document.createElement('div');
            if (className) {
                div.className = className;
            }

            setContainer(div);

            geneUIProviderRef.current?.appendChild(div);

            return () => {
                geneUIProviderRef.current?.removeChild(div);
            };
        }
    }, [className, propsContainer]);

    return isOpen && container ? ReactDOM.createPortal(children, container) : null;
}

Portal.propTypes = {
    /**
     * Specify Portal visibility
     */
    isOpen: PropTypes.bool,
    /**
     * A DOM element for Portal to be appended. When not specified the Portal will create a "div" element and append in body
     */
    container: PropTypes.instanceOf(Element),
    /**
     * Additional className
     */
    className: PropTypes.string,
    /**
     * Anything passed to the Portal as child will be rendered in "container". Any valid React node
     */
    children: PropTypes.node
};

Portal.defaultProps = {
    isOpen: false
};

export default memo(Portal);
