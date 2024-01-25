import React, { createContext, useRef } from 'react';
import PropTypes from 'prop-types';

// Statics
import pgk from '../../../../package.json';

// Styles
import 'src/assets/styles/globalStyling.scss';

export const GeneUIDesignSystemContext = createContext();

function GeneUIProvider({ children, tokens, theme }) {
    const geneUIProviderRef = useRef(null);
    const contextValue = {
        theme,
        tokens,
        geneUIProviderRef
    };

    return (
        <GeneUIDesignSystemContext.Provider value={contextValue}>
            <div data-gene-ui-version={pgk.version} ref={geneUIProviderRef} style={{ height: '100%' }}>
                {children}
            </div>
        </GeneUIDesignSystemContext.Provider>
    );
}

GeneUIProvider.propTypes = {
    /**
     * Any valid React node
     */
    children: PropTypes.node,
    /**
     * Tokens library object defined by style-dictionary standard,
     * and GeneUI tokens package rules
     */
    tokens: PropTypes.object,
    /**
     * Theme which will follow all nested GeneUI components
     */
    theme: PropTypes.oneOf(['light', 'dark'])
};

GeneUIProvider.defaultProps = {
    tokens: {},
    theme: 'light'
};

GeneUIProvider.displayName = 'GeneUIProvider';

export default GeneUIProvider;
