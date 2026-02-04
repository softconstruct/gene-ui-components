import React from "react";

import { CaretDownFilled } from "@geneui/icons";

// Components
import Button from "@components/atoms/Button";
import { Menu, MenuItem } from "@components/molecules/Menu";

import { IBulkActions } from "./types";

interface BulkActionsProps {
    bulkActions: IBulkActions;
}

const BulkActions: React.FC<BulkActionsProps> = ({ bulkActions }) => {
    const [propsForPopover, setPropsForPopover] = React.useState({});

    return (
        <>
            <Button
                appearance="primary"
                layout="text"
                size="medium"
                Icon={CaretDownFilled}
                iconPosition="after"
                {...propsForPopover}
            >
                {bulkActions.label}
            </Button>
            <Menu setPropsForPopover={setPropsForPopover} onChange={bulkActions.onChange}>
                {bulkActions.list.map((item) => (
                    <MenuItem key={item.id} {...item}>
                        {item.title}
                    </MenuItem>
                ))}
            </Menu>
        </>
    );
};

export default BulkActions;
