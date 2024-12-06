import React, { CSSProperties, FC } from "react";
import classNames from "classnames";
// Styles
import "./Text.scss";

interface ITextProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    /**
     * The HTML tag with which text will be rendered.<br/>
     * Possible values: `h1 | h2 | h3 | h4 | h5 | h6 | p | span`
     */
    as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";
    /**
     * Style variants
     * Possible values: `headingXLargeSemibold |`
        <br/> `headingLargeSemibold |`
        <br/> `headingMediumSemibold |`
        <br/> `headingSmallSemibold |`
        <br/> `headingXSmallSemibold |`
        <br/> `subheadingLargeSemibold |`
        <br/> `subheadingMediumSemibold |`
        <br/> `labelLargeSemibold |`
        <br/> `labelLargeMedium |`
        <br/> `labelMediumSemibold |`
        <br/> `labelMediumMedium |`
        <br/> `labelSmallSemibold |`
        <br/> `labelSmallMedium |`
        <br/> `bodyLargeSemibold |`
        <br/> `bodyLargeMedium |`
        <br/> `bodyLargeRegular |`
        <br/> `bodyMediumSemibold |`
        <br/> `bodyMediumMedium |`
        <br/> `bodyMediumRegular |`
        <br/> `captionLargeSemibold |`
        <br/> `captionLargeMedium |`
        <br/> `captionLargeRegular |`
        <br/> `captionMediumMedium |`
        <br/> `captionMediumRegular`
     */
    variant?:
        | "headingXLargeSemibold"
        | "headingLargeSemibold"
        | "headingMediumSemibold"
        | "headingSmallSemibold"
        | "headingXSmallSemibold"
        | "subheadingLargeSemibold"
        | "subheadingMediumSemibold"
        | "labelLargeSemibold"
        | "labelLargeMedium"
        | "labelMediumSemibold"
        | "labelMediumMedium"
        | "labelSmallSemibold"
        | "labelSmallMedium"
        | "bodyLargeSemibold"
        | "bodyLargeMedium"
        | "bodyLargeRegular"
        | "bodyMediumSemibold"
        | "bodyMediumMedium"
        | "bodyMediumRegular"
        | "captionLargeSemibold"
        | "captionLargeMedium"
        | "captionLargeRegular"
        | "captionMediumMedium"
        | "captionMediumRegular";
    /**
     * Color of text
     */
    color?: CSSProperties["color"];
    /**
     * Text alignment
     * Possible values: `left | center | right`
     */
    alignment?: "left" | "center" | "right";
    /**
     * Text font weight
     * Possible values: `normal | bold`
     */
    fontWeight?: "normal" | "bold";
    /**
     * Text font size
     * Possible values: `small | medium | large`
     */
    size?: "small" | "medium" | "large";
    /**
     * Text display option
     * Possible values: `inline | block`
     */
    display?: "inline" | "block";
    /**
     * Text
     */
    children: string;
}

const element = {
    h1: "h1",
    h2: "h2",
    h3: "h3",
    h4: "h4",
    h5: "h5",
    h6: "h6",
    p: "p",
    span: "span"
};

/**
 * Text component which has predefined tokens
 */
const Text: FC<ITextProps> = ({
    className,
    variant,
    children,
    as = "span",
    color,
    alignment,
    fontWeight,
    size,
    display
}) => {
    const Element = (element[as] ?? "span") as React.ElementType;
    return (
        <Element
            className={classNames("text", { [`text_${variant}`]: Boolean(variant) }, className)}
            style={{ display, color, textAlign: alignment, fontWeight, fontSize: size }}
        >
            {children}
        </Element>
    );
};

export { ITextProps, Text as default };
