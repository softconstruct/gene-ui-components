import React, { useRef } from "react";

import { Gear } from "@geneui/icons";

// Components
import Button from "@components/atoms/Button";
import { IPopoverRef } from "@components/atoms/Popover";
import { useManageColumns } from "@components/organisms/DataTable/hooks/useManageColumns";
import ManageColumnsPopover from "@components/organisms/DataTable/Toolbar/components/ManageColumns/components/ManageColumnsPopover/ManageColumnsPopover";

// Hooks
import useClickOutside from "@hooks/useClickOutside";

// Context
import { ManageColumnsProvider, useDataTableContext } from "../../../context";

const ManageColumns = <TData,>() => {
    const { table, manageColumnsConfig, initialColumnVisibility } = useDataTableContext<TData>();

    const popoverRef = useRef<IPopoverRef>({
        floatingElement: { current: null },
        referenceElement: { current: null }
    });

    const { texts: manageColumnsTexts, enabled: isManageColumnsEnabled } = manageColumnsConfig;

    const manageColumnsData = useManageColumns<TData>({
        table,
        manageColumnsConfig,
        initialColumnVisibility
    });

    const { popoverOpen, propsForPopover, setPropsForPopover, openPopover, handleCancel } = manageColumnsData;

    useClickOutside(() => {
        if (popoverOpen) {
            handleCancel();
        }
    }, [popoverRef.current.floatingElement, popoverRef.current.referenceElement]);

    return (
        <ManageColumnsProvider value={manageColumnsData}>
            <Button
                disabled={!isManageColumnsEnabled}
                onClick={openPopover}
                Icon={Gear}
                appearance="secondary"
                layout="outline"
                size="medium"
                {...propsForPopover}
            >
                {manageColumnsTexts?.label ?? "Manage columns"}
            </Button>

            <ManageColumnsPopover popoverRef={popoverRef} setProps={setPropsForPopover} />
        </ManageColumnsProvider>
    );
};

export default ManageColumns;
