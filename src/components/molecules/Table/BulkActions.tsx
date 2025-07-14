import React from "react";

interface BulkActionsProps {
    selectedCount?: number;
}

const BulkActions: React.FC<BulkActionsProps> = ({ selectedCount }) => {
    if (selectedCount === 0) return null;

    return (
        // isMenuOpen && (
        <div className="dataTable__bulkActions_menu">
            {/* {actions?.list.map((action) => ( */}
            {/*    <Button */}
            {/*        key={action.id} */}
            {/*        appearance={action.variant === "danger" ? "danger" : "secondary"} */}
            {/*        layout="text" */}
            {/*        size="small" */}
            {/*        Icon={action.icon as any} */}
            {/*        onClick={() => { */}
            {/*            action.action([]); */}
            {/*            setIsMenuOpen(false); */}
            {/*        }} */}
            {/*        className="dataTable__bulkActions_menuItem" */}
            {/*    > */}
            {/*        {action.label} */}
            {/*    </Button> */}
            {/* ))} */}
        </div>
        // )
    );
};

export default BulkActions;
