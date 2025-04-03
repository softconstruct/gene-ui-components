import React, { createContext, JSX, useEffect, useMemo, useRef, useState } from "react";

import { bootstrap } from "@geneui/tokens";

import LogoMarkSVG from "@components/atoms/Logo/LogoMarkSVG";
import LogoTypeSVG from "@components/atoms/Logo/LogoTypeSVG";

import useBreakpoint, { IBreakpoint } from "@hooks/useBreakpoint";

import { ThemesTypes } from "@types";

// Styles
import "../../../assets/styles/reset.scss";
import "../../../assets/styles/utils.scss";
import "./GeneUIProvider.scss";

// Statics
import pgk from "../../../../package.json";

type TokensType = { [key: string]: string | number };

type LogoType = {
    logotype: React.ReactElement;
    logomark: React.ReactElement;
};

const defaultLogo: LogoType = {
    logotype: LogoTypeSVG,
    logomark: LogoMarkSVG
};

const defaultTokens: TokensType = bootstrap();

interface IGeneUIDesignSystemContext {
    theme: ThemesTypes;
    tokens: TokensType;
    geneUIProviderRef: React.MutableRefObject<null>;
    breakpoint: IBreakpoint | null;
    logo: LogoType;
}

const GeneUIDesignSystemContext = createContext<IGeneUIDesignSystemContext>({
    theme: "light",
    tokens: {},
    geneUIProviderRef: { current: null },
    breakpoint: null,
    logo: defaultLogo
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
    /**
     * Custom logo to override the default GeneUI logo.
     */
    logo?: LogoType;
}

function GeneUIProvider({
    children,
    tokens = defaultTokens,
    theme = "light",
    logo
}: IGeneUIProviderProps): JSX.Element {
    const geneUIProviderRef = useRef(null);
    const [isRefExist, setIsRefExist] = useState(false);

    const currentBreakpoint = useBreakpoint({
        mobile: +tokens.GuitRefBreakpointMobile,
        tablet: +tokens.GuitRefBreakpointTablet,
        desktop: +tokens.GuitRefBreakpointDesktop
    });

    const contextValue = useMemo(
        () => ({
            theme,
            tokens,
            geneUIProviderRef,
            breakpoint: currentBreakpoint,
            logo: logo || defaultLogo
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
