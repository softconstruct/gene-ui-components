import React, { FC, MouseEvent, useState } from "react";

import { IconProps, ThreeDotsHorizontal } from "@geneui/icons";

// Components
import Button from "@components/atoms/Button";

interface IPaginationButtonProps {
    onClick: (e: MouseEvent<HTMLButtonElement>) => void;
    Icon: FC<IconProps>;
    disabled?: boolean;
}

const PaginationButton: FC<IPaginationButtonProps> = ({ onClick, Icon, disabled }) => {
    const [isHovered, setIsHovered] = useState<boolean>(false);

    return (
        <Button
            disabled={disabled}
            onClick={onClick}
            Icon={isHovered ? Icon : ThreeDotsHorizontal}
            onMouseEnter={() => {
                setIsHovered(true);
            }}
            onMouseLeave={() => {
                setIsHovered(false);
            }}
            appearance="secondary"
            layout="text"
        />
    );
};

export default PaginationButton;
