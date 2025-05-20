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
    onNavigationButtonClick?: (e: MouseEvent<HTMLButtonElement>) => void;
    /**
     * Optional logo link. You can pass a React Router Link, Next.js Link, or just an <a>.
     */
    logoAs?: ReactElement;
    partners?: IPartnerItemData[];
    onPartnerSelect?: (partner: IPartnerItemData) => void;
    partnersLoading?: boolean;
    partnersDisabled?: boolean;
    partnersLoadingText?: string;
    partnersSearchPlaceholder?: string;
    partnersName?: string;
    partnersIdName?: string;
    limitLabel?: string;
    limitUnit?: string;
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
    limitUnit
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
                <div className="globalHeader__limit">
                    <Limit limit={limitUnit} label={limitLabel} />
                    <Divider vertical className="globalHeader__divider" />
                </div>
                <div className="globalHeader__time">
                    <Time />
                    <Divider vertical className="globalHeader__divider" />
                </div>
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
                <Text as="p" className="globalHeader__text">
                    TEST
                </Text>
            </div>
        </div>
    );
};

export { IGlobalHeaderProps, GlobalHeader as default };
