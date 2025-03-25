import React, { createContext, JSX, useEffect, useMemo, useRef, useState } from "react";

import { bootstrap } from "@geneui/tokens";

import useBreakpoint, { IBreakpoint } from "@hooks/useBreakpoint";

import { ThemesTypes } from "@types";

// Styles
import "../../../assets/styles/reset.scss";
import "../../../assets/styles/utils.scss";
import "./GeneUIProvider.scss";

// Statics
import pgk from "../../../../package.json";

type TokensType = { [key: string]: string | number } | null;

interface IGeneUIDesignSystemContext {
    theme: ThemesTypes;
    tokens: TokensType;
    geneUIProviderRef: React.MutableRefObject<null>;
    breakpoint: IBreakpoint | null;
}

const GeneUIDesignSystemContext = createContext<IGeneUIDesignSystemContext>({
    theme: "light",
    tokens: {},
    geneUIProviderRef: { current: null },
    breakpoint: null
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

const defaultTokens = bootstrap();

function GeneUIProvider({ children, tokens = null, theme = "light" }: IGeneUIProviderProps): JSX.Element {
    const geneUIProviderRef = useRef(null);
    const [isRefExist, setIsRefExist] = useState(false);

    const currentBreakpoint = useBreakpoint({
        mobile: defaultTokens.GuitRefBreakpointMobile,
        tablet: defaultTokens.GuitRefBreakpointTablet,
        desktop: defaultTokens.GuitRefBreakpointDesktop
    });

    const contextValue = useMemo(
        () => ({
            theme,
            tokens: tokens || defaultTokens,
            geneUIProviderRef,
            breakpoint: currentBreakpoint
        }),
        [theme, tokens, geneUIProviderRef, currentBreakpoint]
    );

    useEffect(() => {
        if (geneUIProviderRef.current && !isRefExist) {
            setIsRefExist(true);
        }
    }, [geneUIProviderRef.current]);

    return (
        <GeneUIDesignSystemContext.Provider value={contextValue}>
            <div
                className="gene-ui-provider"
                data-gene-ui-version={pgk.version}
                ref={geneUIProviderRef}
                style={{ height: "100%" }}
            >
                {isRefExist && children}
            </div>
        </GeneUIDesignSystemContext.Provider>
    );
}

export { IGeneUIProviderProps, IGeneUIDesignSystemContext, GeneUIDesignSystemContext, GeneUIProvider as default };
