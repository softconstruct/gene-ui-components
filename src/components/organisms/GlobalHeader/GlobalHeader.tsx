import React, { cloneElement, FC, MouseEvent, ReactElement, ReactNode, useContext, useMemo } from "react";
import classNames from "classnames";

import { HamburgerMenu, IconProps, QuestionMark } from "@geneui/icons";

// Components
import Button from "@components/atoms/Button";
import Divider from "@components/atoms/Divider";
import Logo from "@components/atoms/Logo";
import {
    IProductProps,
    Product,
    Products,
    ProductsMainSection,
    ProductsSecondarySection
} from "@components/molecules/Products";
import Limit from "@components/organisms/GlobalHeader/Limit/Limit";
import Partners, { IPartnerItemData } from "@components/organisms/GlobalHeader/Partners/Partners";
import Time from "@components/organisms/GlobalHeader/Time/Time";
import { GeneUIDesignSystemContext } from "@components/providers/GeneUIProvider";

// Styles
import "./GlobalHeader.scss";

import { IMenuItemProps, IProfileData, Profile } from "../../../index";

const mobileData = (
    isMobileBreakpoint: boolean,
    timeLabel: string,
    limitLabel: string,
    limitUnit?: string
): IProfileData[] => {
    return isMobileBreakpoint
        ? [
              {
                  title: "time",
                  id: "time",
                  disabled: true,
                  ComponentRender: () => (
                      <span className="globalHeader__time">
                          <span className="globalHeader__time_text">{timeLabel}</span>
                          <Time className="globalHeader__time_mobile" />
                      </span>
                  )
              },
              {
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
          ]
        : [];
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
    /**
     * Label for the time section, in mobile Breakpoint default is "Time"
     */
    timeLabel?: string;
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
    onLanguageSelect?: (item: IMenuItemProps) => void;
    languages?: IProfileData[];
    languageText?: string;
    logOutText?: string;
    myAccountText?: string;
    settingsText?: string;
    /**
     * --------------.
     */
    wallet?: IProfileData[];
    walletText?: string;
    onWalletSelect?: (item: IMenuItemProps) => void;
    /**
     * --------------.
     */
    currency?: IProfileData[];
    currencyText?: string;
    onCurrencySelect?: (item: IMenuItemProps) => void;
    /**
     * --------------.
     */
    activity?: IProfileData[];
    activityText?: string;
    onActivitySelect?: (item: IMenuItemProps) => void;
    /**
     * --------------.
     */
    currencyConvertorText?: string;
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
    actions?: IAction[];

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
    partnersName = "Partner",
    partnersIdName,
    limitLabel = "Limit",
    limitUnit,
    timeZone,
    timeFormat,
    products,
    onProductSelect,
    timeLabel = "Time",
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
    actions
}) => {
    const { breakpoint } = useContext(GeneUIDesignSystemContext);

    const { isMobileBreakpoint = false, isDesktopBreakpoint = false } = breakpoint || {};

    const languagesData = useMemo(() => {
        return languages?.map((lang) => ({ ...lang, id: `languages_${lang.id}` })) || [];
    }, [languages]);

    const partnersData = useMemo(() => {
        return partners?.map((partner) => ({ ...partner, id: `partners_${partner.id}` })) || [];
    }, [partners]);

    const walletData = useMemo(() => {
        return wallet?.map((walletItem) => ({ ...walletItem, id: `wallet_${walletItem.id}` })) || [];
    }, [wallet]);

    const currencyData = useMemo(() => {
        return currency?.map((currencyItem) => ({ ...currencyItem, id: `currency_${currencyItem.id}` })) || [];
    }, [currency]);

    const activityData = useMemo(() => {
        return activity?.map((activityItem) => ({ ...activityItem, id: `activityItem_${activityItem.id}` })) || [];
    }, [activity]);

    const onNavigationButtonClickHandler = (e: MouseEvent<HTMLButtonElement>) => {
        if (onNavigationButtonClick) {
            onNavigationButtonClick(e);
        }
    };

    const onProfileItemSelectHandler = (item: IMenuItemProps) => {
        let changedItem = { ...item };
        if (isMobileBreakpoint && item.id.toString().startsWith("partners_")) {
            changedItem = { ...item, id: item.id.toString().replace("partners_", "") };
            onPartnerSelect?.(changedItem);
        } else if (item.id.toString().startsWith("languages_")) {
            changedItem = { ...item, id: item.id.toString().replace("languages_", "") };
            onLanguageSelect?.(changedItem);
        } else if (item.id.toString().startsWith("wallet_")) {
            changedItem = { ...item, id: item.id.toString().replace("wallet_", "") };
            onWalletSelect?.(changedItem);
        } else if (item.id.toString().startsWith("currency_")) {
            changedItem = { ...item, id: item.id.toString().replace("currency_", "") };
            onCurrencySelect?.(changedItem);
        } else if (item.id.toString().includes("currencyConvertor")) {
            onCurrencyConvertorSelect?.(changedItem);
        } else if (item.id.toString().includes("activityItem_")) {
            changedItem = { ...item, id: item.id.toString().replace("activityItem_", "") };
            onActivitySelect?.(changedItem);
        } else if (actions && actions.some((action) => action.id === item.id)) {
            const foundedAction = actions.find((action) => action.id === item.id);
            if (foundedAction && foundedAction.onActionSelect) {
                foundedAction.onActionSelect(foundedAction);
            }
        }
        onProfileItemSelect?.(changedItem);
    };

    const profileData = useMemo(() => {
        const timeAndLimitForMobile = mobileData(isMobileBreakpoint, timeLabel, limitLabel, limitUnit);
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

        return [partnersDataForProfile, ...timeAndLimitForMobile, ...constantData, logOut].filter(
            (item) => item && typeof item === "object" && "id" in item
        ) as IProfileData[];
    }, [
        isMobileBreakpoint,
        timeLabel,
        limitLabel,
        limitUnit,
        partners,
        partnersName,
        logOutText,
        myAccountText,
        settingsText,
        languageText,
        languagesData,
        partnersData,
        walletData,
        walletText,
        currencyData,
        currencyText,
        activityData,
        activityText
    ]);

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
                {!isMobileBreakpoint && (
                    <div className="globalHeader__item">
                        <Time timeZone={timeZone} format={timeFormat} />
                        <Divider direction="vertical" className="globalHeader__divider" />
                    </div>
                )}
                {actions && isDesktopBreakpoint && (
                    <div className="globalHeader__item">
                        <div className="globalHeader__actions">
                            {actions.map((action) => {
                                return (
                                    <Button
                                        onClick={() => action.onActionSelect(action)}
                                        Icon={action.Icon}
                                        appearance="inverse"
                                        layout="text"
                                        size="medium"
                                    />
                                );
                            })}
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
                        )}
                    </div>
                    <Divider direction="vertical" className="globalHeader__divider" />
                </div>
                <Profile
                    profileData={profileData}
                    className="globalHeader__profile"
                    fullName="Full Name"
                    onProfileItemSelect={onProfileItemSelectHandler}
                />
            </div>
        </div>
    );
};

export { IGlobalHeaderProps, GlobalHeader as default };
