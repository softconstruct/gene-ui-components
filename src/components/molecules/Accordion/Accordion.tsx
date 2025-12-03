import React, { createContext, FC, ReactNode, useMemo } from "react";
import classNames from "classnames";

// Styles
import "./Accordion.scss";

interface IAccordionContextProps {
    size: "large" | "medium" | "small";
}

const AccordionContext = createContext<IAccordionContextProps>({
    size: "medium"
});

interface IAccordionProps {
    /**
     * Provide `AccordionItem` components to be rendered in the `Accordion`
     */
    children: ReactNode;
    /**
     * Accordion size affects all child AccordionItems <br/>
     * Possible values: `large | medium | small`
     */
    size?: "large" | "medium" | "small";
    /**
     * Additional class for the parent element.
     */
    className?: string;
}

/**
 * Accordion component organizes content into expandable and collapsible sections.
 */
const Accordion: FC<IAccordionProps> = ({ children, size = "medium", className }) => {
    const contextValue = useMemo(() => ({ size }), [size]);

    return (
        <AccordionContext.Provider value={contextValue}>
            <div className={classNames("accordion", className)}>{children}</div>
        </AccordionContext.Provider>
    );
};

export { AccordionContext, IAccordionContextProps, IAccordionProps, Accordion as default };
