import React from "react";

// Styles
import "./Toolbar.scss";

// Context
import { useDataTableContext } from "../context";
// Components
import ManageColumns from "./ManageColumns/ManageColumns";

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
