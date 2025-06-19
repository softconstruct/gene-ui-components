import React, { cloneElement, FC, MouseEvent, ReactElement, useContext } from "react";
import classNames from "classnames";

import { Globe, HamburgerMenu } from "@geneui/icons";

// Components
import Button from "@components/atoms/Button";
import Divider from "@components/atoms/Divider";
import Logo from "@components/atoms/Logo";
import Text from "@components/atoms/Text";
import Limit from "@components/organisms/GlobalHeader/Limit/Limit";
import Partners, { IPartnerItemData } from "@components/organisms/GlobalHeader/Partners/Partners";
import Time from "@components/organisms/GlobalHeader/Time/Time";
import { GeneUIDesignSystemContext } from "@components/providers/GeneUIProvider";

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
    const { breakpoint } = useContext(GeneUIDesignSystemContext);

    const onNavigationButtonClickHandler = (e: MouseEvent<HTMLButtonElement>) => {
        if (onNavigationButtonClick) {
            onNavigationButtonClick(e);
        }
    };

    return (
        <div
            className={classNames("globalHeader", className, {
                globalHeader_mobile: breakpoint?.isMobileBreakpoint
            })}
        >
            <div className="globalHeader_side_left">
                <Button
                    onClick={onNavigationButtonClickHandler}
                    Icon={HamburgerMenu}
                    appearance="inverse"
                    layout="text"
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

                <div className="globalHeader__ftn">
                    <div className="globalHeader__amount">
                        <Text as="span" variant="captionLargeMedium">
                            1FTN
                        </Text>
                        <Text as="span" variant="captionLargeMedium">
                            =
                        </Text>
                        <Text as="span" variant="captionLargeMedium">
                            2.3698
                        </Text>
                        <Text as="span" variant="captionLargeMedium">
                            USDT
                        </Text>
                    </div>
                    <div className="globalHeader__domain">
                        <Text as="span" variant="captionLargeMedium">
                            exchange.fastex.com
                        </Text>
                    </div>
                </div>
            </div>
            <div className="globalHeader_side_right">
                {partners && (
                    <div className="globalHeader__item">
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
                        <Divider direction="vertical" className="globalHeader__divider" />
                    </div>
                )}
                {(limitLabel || limitUnit) && (
                    <div className="globalHeader__item">
                        <Limit limit={limitUnit} label={limitLabel} />
                        <Divider direction="vertical" className="globalHeader__divider" />
                    </div>
                )}
                <div className="globalHeader__item">
                    <Time timeZone={timeZone} format={timeFormat} />
                    <Divider direction="vertical" className="globalHeader__divider" />
                </div>

                <div className="globalHeader__item">
                    <div className="globalHeader__actions">
                        <Button onClick={() => {}} Icon={Globe} appearance="inverse" layout="text" size="medium" />
                        <Button onClick={() => {}} Icon={Globe} appearance="inverse" layout="text" size="medium" />
                        <Button onClick={() => {}} Icon={Globe} appearance="inverse" layout="text" size="medium" />
                    </div>
                    <Divider direction="vertical" className="globalHeader__divider" />
                </div>

                <div className="globalHeader__item">
                    <div className="globalHeader__actions">
                        <Button onClick={() => {}} Icon={Globe} appearance="inverse" layout="text" size="medium" />
                        <Button onClick={() => {}} Icon={Globe} appearance="inverse" layout="text" size="medium" />
                        <Button onClick={() => {}} Icon={Globe} appearance="inverse" layout="text" size="medium" />
                    </div>
                    <Divider direction="vertical" className="globalHeader__divider" />
                </div>

                {/* todo: remove after "Profile" component implementation */}
                <Text as="p" className="globalHeader__text">
                    Profile
                </Text>
            </div>
        </div>
    );
};

export { IGlobalHeaderProps, GlobalHeader as default };
