import React from "react";

// Components
import ManageColumns from "@components/organisms/DataTable/Toolbar/components/ManageColumns/ManageColumns";

// Styles
import "./Toolbar.scss";

// Context
import { useDataTableContext } from "../context";

const Toolbar = <TData,>() => {
    const { manageColumnsConfig } = useDataTableContext<TData>();
    const { available: isManageColumnsAvailable } = manageColumnsConfig;

    if (!isManageColumnsAvailable) return null;

    return (
        <div className="tableToolbar">
            <div className="tableToolbar__actions">
                <ManageColumns />
            </div>
        </div>
    );
};

export default Toolbar;
