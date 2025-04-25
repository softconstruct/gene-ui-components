import React, { FC } from "react";
import classNames from "classnames";

import { IconProps } from "@geneui/icons";

import Text from "@components/atoms/Text";

interface INavigationColItemProps {
    Icon?: FC<IconProps>;
    selected?: boolean;
    disabled?: boolean;
    title?: string;
    onChange?: () => void;
}

const NavigationColItem: FC<INavigationColItemProps> = ({ Icon, selected, disabled, title, onChange }) => {
    return (
        <div className="navigation__colItem">
            <button
                type="button"
                disabled={disabled}
                className={classNames("navigation__iconButton", {
                    navigation__iconButton_selected: selected,
                    navigation__iconButton_disabled: disabled
                })}
                onClick={() => onChange?.()}
            >
                {Icon && <Icon />}
            </button>
            {title && (
                <Text as="p" className="navigation__colItem_text" truncate>
                    {title}
                </Text>
            )}
        </div>
    );
};

export { INavigationColItemProps, NavigationColItem as default };
