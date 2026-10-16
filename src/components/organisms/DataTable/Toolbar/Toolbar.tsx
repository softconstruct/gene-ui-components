import React from "react";

// Context
import { useDataTableContext } from "../context";
// Components
import ManageColumns from "./ManageColumns/ManageColumns";

// Styles
import "./Toolbar.scss";

const Toolbar = <TData,>() => {
    const { manageColumnsConfig } = useDataTableContext<TData>();
    const { visible: isManageColumnsVisible } = manageColumnsConfig;

    if (!isManageColumnsVisible) return null;

    return (
        <div className="tableToolbar">
            <div className="tableToolbar__actions">
                <ManageColumns />
            </div>
        </div>
    );
};

export default Toolbar;
