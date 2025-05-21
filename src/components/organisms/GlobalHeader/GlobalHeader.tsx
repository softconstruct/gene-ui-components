import React, { cloneElement, FC, MouseEvent, ReactElement } from "react";
import classNames from "classnames";

import { HamburgerMenu } from "@geneui/icons";

// Components
import Button from "@components/atoms/Button";
import Divider from "@components/atoms/Divider";
import Logo from "@components/atoms/Logo";
import Text from "@components/atoms/Text";
import Limit from "@components/organisms/GlobalHeader/Limit/Limit";
import Partners, { IPartnerItemData } from "@components/organisms/GlobalHeader/Partners/Partners";
import Time from "@components/organisms/GlobalHeader/Time/Time";

// Styles
import "./GlobalHeader.scss";

interface IGlobalHeaderProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    /**
     * Triggered when the navigation button (hamburger menu) is clicked.
     */
    onNavigationButtonClick?: (e: MouseEvent<HTMLButtonElement>) => void;
    /**
     * Optional logo link. You can pass a React Router Link, Next.js Link, or just an <a>.
     * Example: <Link to="/"> or <a href="/">.
     */
    logoAs?: ReactElement;
    /**
     * An array of partner items to display in the partners dropdown.
     */
    partners?: IPartnerItemData[];
    /**
     * Callback function when a partner is selected from the list.
     */
    onPartnerSelect?: (partner: IPartnerItemData) => void;
    /**
     * Whether the partners dropdown should be disabled.
     */
    partnersDisabled?: boolean;
    /**
     * Whether the partners list is currently loading.
     * Displays a loading indicator.
     */
    partnersLoading?: boolean;
    /**
     * Text to display when the partners list is loading.
     */
    partnersLoadingText?: string;
    /**
     * Placeholder text for the partners search input.
     */
    partnersSearchPlaceholder?: string;
    /**
     * The property name use as the label for partner name in the dropdown.
     */
    partnersName?: string;
    /**
     * The property id use as the label for partner id in the dropdown.
     */
    partnersIdName?: string;
    /**
     * Label for the limit section (e.g. "Limit").
     */
    limitLabel?: string;
    /**
     * Unit or amount to show next to the limit label (e.g. "100").
     */
    limitUnit?: string;
    /**
     * The time zone to display the time in.
     * If not provided, it will use the local time zone of the user's device.
     * example: "America/New_York", "Europe/London"
     */
    timeZone?: string;
    /**
     * The format of the time to display.
     * Possible values: "24h" or "12h"
     * Default is "24h"
     */
    timeFormat?: "24h" | "12h";
    // actionList?: any[]; // todo button group
}

/**
 * Global Header component is a persistent navigation element that appears at the top of an application or website. It serves as a central hub for accessing key features and tools, ensuring consistent and intuitive navigation across all pages.
 */
const GlobalHeader: FC<IGlobalHeaderProps> = ({
    className,
    onNavigationButtonClick,
    logoAs,
    partners,
    onPartnerSelect,
    partnersLoading,
    partnersLoadingText,
    partnersSearchPlaceholder,
    partnersDisabled,
    partnersName,
    partnersIdName,
    limitLabel,
    limitUnit,
    timeZone,
    timeFormat
}) => {
    const onNavigationButtonClickHandler = (e: MouseEvent<HTMLButtonElement>) => {
        if (onNavigationButtonClick) {
            onNavigationButtonClick(e);
        }
    };

    return (
        <div className={classNames("globalHeader", className)}>
            <div className="globalHeader_side_left">
                <Button
                    onClick={onNavigationButtonClickHandler}
                    Icon={HamburgerMenu}
                    appearance="inverse"
                    displayType="text"
                    size="medium"
                />
                {logoAs ? (
                    cloneElement(logoAs, {
                        className: classNames("globalHeader__logo_link", logoAs.props.className),
                        children: (
                            <Logo className="globalHeader__logo" type="logomark" appearance="inverse" size="small" />
                        ),
                        "aria-label": "logo"
                    })
                ) : (
                    <Logo className="globalHeader__logo" type="logomark" appearance="inverse" size="small" />
                )}
            </div>
            <div className="globalHeader_side_right">
                {partners && (
                    <div className="globalHeader__partners">
                        <Partners
                            onPartnerSelect={onPartnerSelect}
                            partners={partners}
                            loading={partnersLoading}
                            loadingText={partnersLoadingText}
                            searchPlaceholder={partnersSearchPlaceholder}
                            disabled={partnersDisabled}
                            name={partnersName}
                            idName={partnersIdName}
                        />
                        <Divider vertical className="globalHeader__divider" />
                    </div>
                )}
                {(limitLabel || limitUnit) && (
                    <div className="globalHeader__limit">
                        <Limit limit={limitUnit} label={limitLabel} />
                        <Divider vertical className="globalHeader__divider" />
                    </div>
                )}
                <div className="globalHeader__time">
                    <Time timeZone={timeZone} format={timeFormat} />
                    <Divider vertical className="globalHeader__divider" />
                </div>
                <Text as="p" className="globalHeader__text">
                    Profile
                </Text>
            </div>
        </div>
    );
};

export { IGlobalHeaderProps, GlobalHeader as default };
