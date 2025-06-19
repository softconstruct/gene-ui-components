import React, { forwardRef } from "react";
import classNames from "classnames";

// Components
import Text from "@components/atoms/Text";

export interface IPartnerItemProps {
    name: string;
    id: string | number;
    onChange: (id: string | number) => void;
    selected: boolean;
}

const PartnerItem = forwardRef<HTMLButtonElement, IPartnerItemProps>(({ name, onChange, id, selected }, ref) => {
    const handleClick = () => {
        onChange(id);
    };
    return (
        <button
            type="button"
            className={classNames("partners__partner", { partners__partner_selected: selected })}
            onClick={handleClick}
            ref={ref}
        >
            <Text as="span" className="partners__partnerName">
                {name}
            </Text>
            <Text as="span" className="partners__partnerID">
                {id.toString()}
            </Text>
        </button>
    );
});

export { PartnerItem as default };
