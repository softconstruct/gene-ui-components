import React, { cloneElement, FC, MouseEvent, ReactElement, ReactNode, useContext } from "react";
import classNames from "classnames";

import { HamburgerMenu, IconProps, QuestionMark } from "@geneui/icons";

// Components
import Button from "@components/atoms/Button";
import Divider from "@components/atoms/Divider";
import Logo from "@components/atoms/Logo";
import { IMenuItemProps } from "@components/molecules/Menu";
import {
    IProductProps,
    Product,
    Products,
    ProductsMainSection,
    ProductsSecondarySection
} from "@components/molecules/Products";
import Profile, { IProfileData } from "@components/molecules/Profile";
import Limit from "@components/organisms/GlobalHeader/Limit/Limit";
import Partners, { IPartnerItemData } from "@components/organisms/GlobalHeader/Partners/Partners";
import Time from "@components/organisms/GlobalHeader/Time/Time";
import { GeneUIDesignSystemContext } from "@components/providers/GeneUIProvider";

// Styles
import "./GlobalHeader.scss";

// Utilities
const idPrefixCreator = (data?: IProfileData[], prefix?: string) => {
    return data?.map((item) => ({ ...item, id: `${prefix}_${item.id}` })) || [];
};

const idPrefixRemover = (item: IMenuItemProps, prefix: string) => {
    if (typeof item.id === "string") {
        return { ...item, id: item.id.replace(`${prefix}_`, "") };
    }
    return { ...item, id: item.id.toString().replace(`${prefix}_`, "") };
};

const getItemTypeFromId = (id: string): string | null => {
    if (id.startsWith("partners_")) return "partners";
    if (id.startsWith("languages_")) return "languages";
    if (id.startsWith("wallet_")) return "wallet";
    if (id.startsWith("currency_")) return "currency";
    if (id.includes("currencyConvertor")) return "currencyConvertor";
    if (id.includes("activityItem_")) return "activityItem";
    return null;
};

const mobileData = (
    isMobileBreakpoint: boolean,
    timeLabel?: string,
    limitLabel?: string,
    limitUnit?: string | number,
    timeZone?: string,
    timeFormat?: "24h" | "12h"
): IProfileData[] => {
    const limitCheck: IProfileData | null =
        limitLabel && limitUnit
            ? {
                  title: "limit",
                  id: "limit",
                  disabled: true,
                  divider: true,
                  ComponentRender: () => (
                      <span className="globalHeader__limit">
                          <Limit limit={limitUnit} label={limitLabel} isMobile={isMobileBreakpoint} />
                      </span>
                  )
              }
            : null;

    const timeCheck: IProfileData | null =
        timeZone || timeFormat || timeLabel
            ? {
                  title: "time",
                  id: "time",
                  disabled: true,
                  divider: !limitCheck,
                  ComponentRender: () => (
                      <span className="globalHeader__time">
                          <span className="globalHeader__time_text">{timeLabel}</span>
                          <Time className="globalHeader__time_mobile" timeZone={timeZone} format={timeFormat} />
                      </span>
                  )
              }
            : null;

    return isMobileBreakpoint ? [...(timeCheck ? [timeCheck] : []), ...(limitCheck ? [limitCheck] : [])] : [];
};

export interface IProducts {
    mainSectionData?: IProductProps[];
    secondarySectionData?: IProductProps[];
}

export interface IAction {
    title: string;
    Icon: FC<IconProps>;
    id: string;
    onActionSelect: (action: IAction) => void;
}

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
    onPartnerSelect?: (partner: IPartnerItemData | IMenuItemProps) => void;
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
     * The default value is "Partner". This prop is used for internationalization.
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
    limitUnit?: string | number;
    /**
     * The time zone to display the time in.
     * If not provided, it will use the local time zone of the user's device.
     * Example: "America/New_York", "Europe/London".
     * To render the time section at all, you must provide at least one of `timeZone`, `timeFormat`, or `timeLabel`.
     */
    timeZone?: string;
    /**
     * The format of the time to display.
     * Default is "24h".
     * To render the time section at all, you must provide at least one of `timeZone`, `timeFormat`, or `timeLabel`.
     */
    timeFormat?: "24h" | "12h";
    /**
     * Label for the time section; in the mobile breakpoint the default is "Time".
     * To render the time section at all, you must provide at least one of `timeZone`, `timeFormat`, or `timeLabel`.
     */
    timeLabel?: string;
    /**
     * Configuration object containing product data for main and secondary sections.
     * Used to render the products dropdown in the global header.
     */
    products?: IProducts;
    /**
     * Callback function when a product is selected from the list.
     */
    onProductSelect?: (product: IProductProps) => void;
    /**
     * Callback triggered when a profile menu item is selected.
     * Receives the selected menu item as an argument.
     */
    onProfileItemSelect?: (item: IMenuItemProps) => void;
    /**
     * Callback function triggered when a language is selected from the language dropdown.
     * Receives the selected language item as an argument.
     */
    onLanguageSelect?: (item: IMenuItemProps) => void;
    /**
     * Array of language options to display in the profile dropdown.
     * Each item should have a title, id, and selected state.
     */
    languages?: IProfileData[];
    /**
     * Label text for the language section in the profile dropdown.
     * Default value is "Language". Used for internationalization.
     */
    languageText?: string;
    /**
     * Text to display for the log out menu item.
     * Default value is "Log out". Used for internationalization.
     */
    logOutText?: string;
    /**
     * Text to display for the my account menu item.
     * Default value is "My Account". Used for internationalization.
     */
    myAccountText?: string;
    /**
     * Text to display for the settings menu item.
     * Default value is "Settings". Used for internationalization.
     */
    settingsText?: string;
    /**
     * Array of wallet options to display in the profile dropdown.
     * Each item should have a title, id, and selected state.
     */
    wallet?: IProfileData[];
    /**
     * Label text for the wallet section in the profile dropdown.
     * Default value is "Wallet". Used for internationalization.
     */
    walletText?: string;
    /**
     * Callback function triggered when a wallet option is selected.
     * Receives the selected wallet item as an argument.
     */
    onWalletSelect?: (item: IMenuItemProps) => void;
    /**
     * Array of currency options to display in the profile dropdown.
     * Each item should have a title, id, and selected state.
     */
    currency?: IProfileData[];
    /**
     * Label text for the currency section in the profile dropdown.
     * Default value is "Reporting Currency". Used for internationalization.
     */
    currencyText?: string;
    /**
     * Callback function triggered when a currency option is selected.
     * Receives the selected currency item as an argument.
     */
    onCurrencySelect?: (item: IMenuItemProps) => void;
    /**
     * Array of activity filter options to display in the profile dropdown.
     * Each item should have a title, id, and selected state.
     */
    activity?: IProfileData[];
    /**
     * Label text for the activity section in the profile dropdown.
     * Default value is "Activity". Used for internationalization.
     */
    activityText?: string;
    /**
     * Callback function triggered when an activity filter is selected.
     * Receives the selected activity item as an argument.
     */
    onActivitySelect?: (item: IMenuItemProps) => void;
    /**
     * Text to display for the currency converter menu item.
     * If provided, adds a currency converter option to the profile dropdown.
     */
    currencyConvertorText?: string;
    /**
     * Callback function triggered when the currency converter option is selected.
     * Receives the menu item as an argument.
     */
    onCurrencyConvertorSelect?: (item: IMenuItemProps) => void;
    /**
     * Optional React component or element to display dynamic content in the header's left section,
     * positioned adjacent to the logo. Commonly used for real-time information such as exchange rates,
     * system status, etc.
     */
    leftContent?: ReactNode;
    /**
     * Callback function triggered when the Help button (with the QuestionMark icon) is clicked.
     * If not provided, the Help button will not be displayed in the header.
     */
    onHelpActionSelect?: () => void;
    /**
     * Array of custom action buttons to display in the header.
     * Each action includes a title, icon, id, and callback function.
     * Actions are shown on desktop and moved to profile dropdown on mobile.
     */
    actions?: IAction[];
    /**
     * The full name of the currently authenticated user.
     * This name is displayed next to the user profile avatar in the global header.
     * If not provided, only the profile avatar will be shown.
     */
    fullName?: string;
    /**
     *  The image URL for the user's profile avatar.
     *  This image is displayed in the top-right section of the global header.
     */
    userImageSrc?: string;
    /**
     * Callback function triggered when the logOut option is selected.
     * Receives the menu item as an argument.
     */
    onLogOutSelect?: (item: IMenuItemProps) => void;
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
    partnersName = "Partner",
    partnersIdName,
    limitLabel,
    limitUnit,
    timeZone,
    timeFormat,
    products,
    onProductSelect,
    timeLabel,
    logOutText,
    onProfileItemSelect,
    myAccountText = "My Account",
    settingsText = "Settings",
    languageText = "Language",
    languages = [],
    onLanguageSelect,
    wallet,
    walletText = "Wallet",
    onWalletSelect,
    currency,
    currencyText = "Reporting Currency",
    activity,
    activityText = "Activity",
    onActivitySelect,
    onCurrencySelect,
    currencyConvertorText,
    onCurrencyConvertorSelect,
    leftContent = null,
    onHelpActionSelect,
    actions,
    fullName,
    userImageSrc,
    onLogOutSelect
}) => {
    const { breakpoint } = useContext(GeneUIDesignSystemContext);

    const { isMobileBreakpoint = false, isDesktopBreakpoint = false } = breakpoint || {};

    const languagesData = idPrefixCreator(languages, "languages");
    const partnersData = idPrefixCreator(partners, "partners");
    const walletData = idPrefixCreator(wallet, "wallet");
    const currencyData = idPrefixCreator(currency, "currency");
    const activityData = idPrefixCreator(activity, "activityItem");

    const onNavigationButtonClickHandler = (e: MouseEvent<HTMLButtonElement>) => {
        if (onNavigationButtonClick) {
            onNavigationButtonClick(e);
        }
    };

    const onProfileItemSelectHandler = (item: IMenuItemProps) => {
        const type = getItemTypeFromId(item.id.toString());
        let changedItem = { ...item };

        switch (type) {
            case "partners":
                if (isMobileBreakpoint) {
                    changedItem = idPrefixRemover(item, "partners");
                    onPartnerSelect?.(changedItem);
                }
                break;
            case "languages":
                changedItem = idPrefixRemover(item, "languages");
                onLanguageSelect?.(changedItem);
                break;
            case "wallet":
                changedItem = idPrefixRemover(item, "wallet");
                onWalletSelect?.(changedItem);
                break;
            case "currency":
                changedItem = idPrefixRemover(item, "currency");
                onCurrencySelect?.(changedItem);
                break;
            case "currencyConvertor":
                onCurrencyConvertorSelect?.(changedItem);
                break;
            case "activityItem":
                changedItem = idPrefixRemover(item, "activityItem");
                onActivitySelect?.(changedItem);
                break;
            case "logOut":
                onLogOutSelect?.(changedItem);
                break;
            default:
                if (actions && actions.some((action) => action.id === item.id)) {
                    const foundedAction = actions.find((action) => action.id === item.id);
                    if (foundedAction && foundedAction.onActionSelect) {
                        foundedAction.onActionSelect(foundedAction);
                    }
                }
                break;
        }

        onProfileItemSelect?.(changedItem);
    };

    const profileData = () => {
        const timeAndLimitForMobile = mobileData(
            isMobileBreakpoint,
            timeLabel,
            limitLabel,
            limitUnit,
            timeZone,
            timeFormat
        );
        const dynamicTitleCreator = (title: string, data: IProfileData[], needLastElement = false): string => {
            const selectedItem = data.find((item) => item.selected);
            if (needLastElement) {
                return `${title}${selectedItem && selectedItem.title ? `: ${selectedItem.title.replace(")", "").replace("(", "").split(" ").at(-1)}` : ""}`;
            }
            return `${title}${selectedItem && selectedItem.title ? `: ${selectedItem.title}` : ""}`;
        };

        const languagesDataCheck: IProfileData | null =
            languagesData.length > 0
                ? {
                      title: dynamicTitleCreator(languageText, languagesData),
                      id: "language",
                      divider: true,
                      children: languagesData
                  }
                : null;

        const walletDataCheck: IProfileData | null =
            walletData.length > 0
                ? {
                      title: walletText,
                      id: "wallet",
                      children: walletData,
                      divider: activityData.length === 0 && !currencyConvertorText && currencyData.length === 0
                  }
                : null;

        const currencyCheck: IProfileData | null =
            currencyData.length > 0
                ? {
                      title: dynamicTitleCreator(currencyText, currencyData, true),
                      id: "currency",
                      children: currencyData,
                      divider: activityData.length === 0 && !currencyConvertorText
                  }
                : null;

        const currencyConvertorCheck: IProfileData | null = currencyConvertorText
            ? {
                  title: currencyConvertorText,
                  id: "currencyConvertor",
                  divider: activityData.length === 0
              }
            : null;

        const activityCheck: IProfileData | null =
            activityData.length > 0
                ? {
                      title: dynamicTitleCreator(activityText, activityData),
                      id: "activity",
                      children: activityData,
                      divider: true
                  }
                : null;

        const customActionsCheck: IProfileData[] | null =
            actions && actions.length > 0 && !isDesktopBreakpoint
                ? actions.map((action, index) => {
                      return {
                          title: action.title,
                          id: action.id,
                          divider: index === actions.length - 1
                      };
                  })
                : null;

        const constantData: IProfileData[] = [
            {
                title: myAccountText,
                id: "myAccount"
            },
            {
                title: settingsText,
                id: "settings"
            },
            ...(languagesDataCheck ? [languagesDataCheck] : []),
            ...(walletDataCheck ? [walletDataCheck] : []),
            ...(currencyCheck ? [currencyCheck] : []),
            ...(currencyConvertorCheck ? [currencyConvertorCheck] : []),
            ...(activityCheck ? [activityCheck] : []),
            ...(customActionsCheck || [])
        ];
        const logOut = {
            title: logOutText || "Log out",
            id: "logOut",
            danger: true
        };

        const partnersDataForProfile =
            isMobileBreakpoint && partners && partners.length > 0
                ? {
                      title: partnersName || "Partner",
                      id: "teams",
                      value: "teams",
                      children: partnersData
                  }
                : {};

        return (
            ([partnersDataForProfile, ...timeAndLimitForMobile, ...constantData, logOut].filter(
                (item) => item && typeof item === "object" && "id" in item
            ) as IProfileData[]) || []
        );
    };

    return (
        <div
            className={classNames("globalHeader", className, {
                globalHeader_mobile: isMobileBreakpoint
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

                {isDesktopBreakpoint && leftContent}
            </div>
            <div className="globalHeader_side_right">
                {partners && !isMobileBreakpoint && (
                    <div className="globalHeader__item">
                        <Partners
                            onPartnerSelect={onPartnerSelect}
                            partners={partners}
                            loading={partnersLoading}
                            loadingText={partnersLoadingText}
                            searchPlaceholder={partnersSearchPlaceholder}
                            disabled={partnersDisabled}
                            title={partnersName}
                            idName={partnersIdName}
                        />
                        <Divider direction="vertical" className="globalHeader__divider" />
                    </div>
                )}
                {(limitLabel || limitUnit) && !isMobileBreakpoint && (
                    <div className="globalHeader__item">
                        <Limit limit={limitUnit} label={limitLabel} />
                        <Divider direction="vertical" className="globalHeader__divider" />
                    </div>
                )}
                {!isMobileBreakpoint && (timeZone || timeFormat || timeLabel) && (
                    <div className="globalHeader__item">
                        <Time timeZone={timeZone} format={timeFormat} />
                        <Divider direction="vertical" className="globalHeader__divider" />
                    </div>
                )}
                {actions && isDesktopBreakpoint && (
                    <div className="globalHeader__item">
                        <div className="globalHeader__actions">
                            {actions.map((action) => (
                                <Button
                                    key={action.id}
                                    onClick={() => action.onActionSelect(action)}
                                    Icon={action.Icon}
                                    appearance="inverse"
                                    layout="text"
                                    size="medium"
                                />
                            ))}
                        </div>
                        <Divider direction="vertical" className="globalHeader__divider" />
                    </div>
                )}
                <div className="globalHeader__item">
                    <div className="globalHeader__actions">
                        {/* todo: add popover and notifications section after design ready */}
                        {/* <Badge appearance="brand" size="3xSmall"> */}
                        {/*    <Button onClick={() => {}} Icon={Bell} appearance="inverse" layout="text" size="medium" /> */}
                        {/* </Badge> */}
                        {onHelpActionSelect && (
                            <Button
                                onClick={onHelpActionSelect}
                                Icon={QuestionMark}
                                appearance="inverse"
                                layout="text"
                                size="medium"
                            />
                        )}
                        {products && (
                            <>
                                <Products onChange={onProductSelect}>
                                    {products.mainSectionData && products.mainSectionData.length > 0 && (
                                        <ProductsMainSection>
                                            {products.mainSectionData?.map((product) => (
                                                <Product key={product.id} {...product} />
                                            ))}
                                        </ProductsMainSection>
                                    )}
                                    {products.secondarySectionData && products.secondarySectionData?.length > 0 && (
                                        <ProductsSecondarySection>
                                            {products.secondarySectionData?.map((product) => (
                                                <Product key={product.id} {...product} />
                                            ))}
                                        </ProductsSecondarySection>
                                    )}
                                </Products>
                                <Divider direction="vertical" className="globalHeader__divider" />
                            </>
                        )}
                    </div>
                </div>
                <Profile
                    profileData={profileData()}
                    className="globalHeader__profile"
                    fullName={fullName}
                    src={userImageSrc}
                    onProfileItemSelect={onProfileItemSelectHandler}
                />
            </div>
        </div>
    );
};

export { IGlobalHeaderProps, GlobalHeader as default };
