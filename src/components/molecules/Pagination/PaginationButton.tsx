import React, { FC, MouseEvent, useState } from "react";

import { IconProps, ThreeDotsHorizontal } from "@geneui/icons";

import Button from "@components/atoms/Button";

interface Props {
    onClick: (e: MouseEvent<HTMLButtonElement>) => void;
    Icon: FC<IconProps>;
    disabled?: boolean;
}

const PaginationButton: FC<Props> = ({ onClick, Icon, disabled }) => {
    const [isHovered, setIsHovered] = useState<boolean>(false);
    return (
        <div
            onMouseEnter={() => {
                setIsHovered(true);
            }}
            onMouseLeave={() => {
                setIsHovered(false);
            }}
        >
            <Button
                disabled={disabled}
                onClick={onClick}
                Icon={isHovered ? Icon : ThreeDotsHorizontal}
                appearance="secondary"
                displayType="text"
            />
        </div>
    );
};

export default PaginationButton;
