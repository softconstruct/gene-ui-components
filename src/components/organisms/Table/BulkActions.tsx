import React, { FC, useState } from "react";

import { CaretDownFilled } from "@geneui/icons";

// Components
import Button from "@components/atoms/Button";
import { Menu, MenuItem } from "@components/molecules/Menu";

import { IBulkActions } from "./types";

interface BulkActionsProps {
    bulkActions: IBulkActions;
}

const BulkActions: FC<BulkActionsProps> = ({ bulkActions }) => {
    const { label, list, ariaLabel, onChange } = bulkActions;
    const [propsForPopover, setPropsForPopover] = useState({});

    return (
        <>
            <Button
                appearance="primary"
                layout="text"
                size="medium"
                Icon={CaretDownFilled}
                iconPosition="after"
                aria-label={ariaLabel}
                {...propsForPopover}
            >
                {label}
            </Button>
            <Menu setPropsForPopover={setPropsForPopover} onChange={onChange}>
                {list.map((item) => (
                    <MenuItem key={item.id} {...item}>
                        {item.title}
                    </MenuItem>
                ))}
            </Menu>
        </>
    );
};

export default BulkActions;
