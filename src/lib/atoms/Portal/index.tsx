import React, { useEffect, useState, memo, useContext, PropsWithChildren } from 'react';
import ReactDOM from 'react-dom';
// Components
import { GeneUIDesignSystemContext } from '../../providers/GeneUIProvider';

interface Props extends PropsWithChildren {
    /**
     * Specify Portal visibility
     */
    isOpen: boolean;
    /**
     * Additional className
     */
    className?: string;
    /**
     * A DOM element for Portal to be appended. When not specified the Portal will create a "div" element and append in body
     */
    container: HTMLElement | null;
}

const Portal: React.FC<Props> = ({ isOpen = false, children, className, container: propsContainer }) => {
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

    return <>{isOpen && container ? ReactDOM.createPortal(children, container) : null}</>;
};

export default memo(Portal);
