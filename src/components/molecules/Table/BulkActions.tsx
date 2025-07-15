import React from "react";

import { CaretDownFilled } from "@geneui/icons";

import Button from "@components/atoms/Button";
import { Menu, MenuItem } from "@components/molecules/Menu";
import { BulkAction } from "@components/molecules/Table/type";

interface BulkActionsProps {
    bulkActions: BulkAction;
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
