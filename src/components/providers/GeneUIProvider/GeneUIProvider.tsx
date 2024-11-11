import React, { createContext, useEffect, useRef, useState, JSX, useMemo } from "react";
import { bootstrap } from "@geneui/tokens";

// Statics
import pgk from "../../../../package.json";

// Styles
import "../../../assets/styles/reset.scss";
import "../../../assets/styles/utils.scss";

type ThemesTypes = "light" | "dark";

type TokensType = { [key: string]: string | number } | null;

interface IGeneUIDesignSystemContext {
    theme: ThemesTypes;
    tokens: TokensType;
    geneUIProviderRef: React.MutableRefObject<null>;
}

const GeneUIDesignSystemContext = createContext<IGeneUIDesignSystemContext>({
    theme: "light",
    tokens: {},
    geneUIProviderRef: { current: null }
});

interface IGeneUIProviderProps {
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

function GeneUIProvider({ children, tokens = null, theme = "light" }: IGeneUIProviderProps): JSX.Element {
    const geneUIProviderRef = useRef(null);
    const [isRefExist, setIsRefExist] = useState(false);

    const contextValue = useMemo(
        () => ({
            theme,
            tokens: tokens || bootstrap(),
            geneUIProviderRef
        }),
        [theme, tokens, geneUIProviderRef]
    );

    useEffect(() => {
        if (geneUIProviderRef.current && !isRefExist) {
            setIsRefExist(true);
        }
    }, [geneUIProviderRef.current]);

    return (
        <GeneUIDesignSystemContext.Provider value={contextValue}>
            <div data-gene-ui-version={pgk.version} ref={geneUIProviderRef} style={{ height: "100%" }}>
                {isRefExist && children}
            </div>
        </GeneUIDesignSystemContext.Provider>
    );
}

export { IGeneUIProviderProps, IGeneUIDesignSystemContext, GeneUIDesignSystemContext, GeneUIProvider as default };
