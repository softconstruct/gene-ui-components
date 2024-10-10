import React, { createContext, useEffect, useRef, useState, JSX } from 'react';
import { bootstrap } from '@geneui/tokens';

// Statics
// @ts-ignore
import pgk from '../../../../package.json';

// Styles
import 'src/assets/styles/reset.scss';
import 'src/assets/styles/utils.scss';

type ThemesTypes = 'light' | 'dark';

type TokensType = { [key: string]: string | number } | null;

export interface IGeneUIDesignSystemContext {
    theme: ThemesTypes;
    tokens: TokensType;
    geneUIProviderRef: React.MutableRefObject<null>;
}

export const GeneUIDesignSystemContext = createContext<IGeneUIDesignSystemContext>({
    theme: 'light',
    tokens: {},
    geneUIProviderRef: { current: null }
});

export interface IGeneUIProviderProps {
    /**
     * Any valid React node
     */
    children: React.ReactElement;
    /**
     * Tokens library object defined by style-dictionary standard,
     * and GeneUI tokens package rules
     */
    tokens?: TokensType;
    /**
     * Theme which will follow all nested GeneUI components
     */
    theme?: ThemesTypes;
}

const GeneUIProvider = ({ children, tokens = null, theme = 'light' }: IGeneUIProviderProps): JSX.Element => {
    const geneUIProviderRef = useRef(null);
    const [isRefExist, setIsRefExist] = useState(false);

    const contextValue = {
        theme,
        tokens: tokens ? tokens : bootstrap(),
        geneUIProviderRef
    };

    useEffect(() => {
        geneUIProviderRef.current && !isRefExist && setIsRefExist(true);
    }, [geneUIProviderRef.current]);

    return (
        <GeneUIDesignSystemContext.Provider value={contextValue}>
            <div data-gene-ui-version={pgk.version} ref={geneUIProviderRef} style={{ height: '100%' }}>
                {isRefExist && children}
            </div>
        </GeneUIDesignSystemContext.Provider>
    );
};

export default GeneUIProvider;
