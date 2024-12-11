import { IconProps } from "@geneui/icons";
import { FC } from "react";

export interface IGlobalProps {
    /**
     * The text will shown as content of the `button`.
     */
    children?: string;
    /**
     * Specifies the name of the `button`, which can be useful for identify which button was clicked.
     */
    name: string;
    /**
     * The `Icon` prop accepts a React Functional Component that will be displayed alongside the button text.
     */
    Icon?: FC<IconProps>;
    /**
     * Size <br>
     * Possible values: `large | medium | small`
     */
    size?: "large" | "medium" | "small";
    /**
     * Icon position <br>
     * If the prop is `true` the `Icon` will be shown before  the `text` otherwise after   the `text`.
     */
    iconBefore?: boolean;
    /**
     * Indicates whether the `button` is `disabled`, preventing user interaction, focus, click etc...
     */
    disabled?: boolean;
    /**
     *Displays the selected item
     */
    isSelected?: boolean;
}
