import React, { useState } from "react";

import { CaretDownFilled } from "@geneui/icons";

// Components
import Button from "@components/atoms/Button";
import Divider from "@components/atoms/Divider";
import Text from "@components/atoms/Text";
import { Menu, MenuItem } from "@components/molecules/Menu";

// Context
import { useDataTableContext } from "../../context";

// Styles
import "./BulkActions.scss";

/**
 * Selection controls of the toolbar: the selected count, Deselect and the Bulk Actions dropdown.
 */
const BulkActions = <TData,>() => {
    const { table, bulkActionsConfig } = useDataTableContext<TData>();
    const [propsForPopover, setPropsForPopover] = useState({});

    if (!bulkActionsConfig) return null;

    const { selectedRowIds, actions, texts, isSelectionDisabled } = bulkActionsConfig;
    const selectedCount = selectedRowIds.length;
    const isDisabled = isSelectionDisabled || selectedCount === 0;

    return (
        <div className="bulkActions">
            <Text as="span" variant="labelMediumSemibold" className="bulkActions__count">
                {texts.selectedCount(selectedCount)}
            </Text>
            <Divider direction="vertical" className="bulkActions__divider" />
            <Button
                appearance="primary"
                layout="text"
                size="medium"
                disabled={isDisabled}
                onClick={() => table.resetRowSelection(true)}
            >
                {texts.deselect}
            </Button>
            <Button
                appearance="primary"
                layout="text"
                size="medium"
                Icon={CaretDownFilled}
                iconPosition="after"
                disabled={isDisabled || actions.length === 0}
                {...propsForPopover}
            >
                {texts.bulkActionsButton}
            </Button>
            {actions.length > 0 && (
                <Menu
                    setPropsForPopover={setPropsForPopover}
                    position="bottom-left"
                    size="small"
                    onChange={(item) => actions.find((action) => action.id === item.id)?.onClick({ selectedRowIds })}
                >
                    {actions.map((action) => (
                        <MenuItem key={action.id} id={action.id}>
                            {action.title}
                        </MenuItem>
                    ))}
                </Menu>
            )}
        </div>
    );
};

export default BulkActions;
