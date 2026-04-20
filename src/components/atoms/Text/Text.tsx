import { createElement, forwardRef, ReactElement } from "react";
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
    as: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";
    /**
     * Style variants.<br>
     * Will affect on `font-family` ,`font-size` ,`font-weight` and `line-height`.<br/>
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
        | "captionMediumSemibold"
        | "captionMediumMedium"
        | "captionMediumRegular";
    /**
     * Text alignment<br>
     * Possible values: `left | center | right`
     */
    alignment?: "start" | "center" | "end";
    /**
     * Text content
     */
    children: string | ReactElement<ITextProps> | Array<string | ReactElement<ITextProps>>;
    /**
     * A unique identifier for the text element.
     * Useful for accessibility purposes, like `aria-labelledby`.
     */
    id?: string;
}

/**
 * Text component which has predefined tokens
 */
const Text = forwardRef<HTMLHeadingElement | HTMLParagraphElement | HTMLSpanElement, ITextProps>(
    ({ className, variant = "bodyMediumMedium", children, as, alignment = "start", id }: ITextProps, ref) => {
        const computedClassNames = classNames(
            "text",
            {
                [`text_variant_${variant}`]: variant,
                [`text_alignment_${alignment}`]: alignment
            },
            className
        );

        return createElement(
            as,
            {
                ref,
                id,
                className: computedClassNames
            },
            children
        );
    }
);

export { ITextProps, Text as default };
