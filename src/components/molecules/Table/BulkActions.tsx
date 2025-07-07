import React from "react";
import classNames from "classnames";

import { CaretDownFilled } from "@geneui/icons";

import Button from "@components/atoms/Button";
import Divider from "@components/atoms/Divider";

import { BulkAction } from "./type";

interface BulkActionsProps {
    selectedCount: number;
    actions: BulkAction[];
    onDeselect: () => void;
    className?: string;
}

const BulkActions: React.FC<BulkActionsProps> = ({ selectedCount, actions, onDeselect, className }) => {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    if (selectedCount === 0) return null;

    return (
        <div className={classNames("dataTable__bulkActions", className)}>
            <div className="dataTable__bulkActions_selected">{selectedCount} selected</div>
            <Divider direction="vertical" />
            <Button appearance="primary" layout="text" size="medium" onClick={onDeselect}>
                Deselect
            </Button>
            {actions.length > 0 && (
                <div className="dataTable__bulkActions_dropdown">
                    <Button
                        appearance="primary"
                        layout="text"
                        size="medium"
                        Icon={CaretDownFilled}
                        iconPosition="after"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        Bulk Actions
                    </Button>
                    {isMenuOpen && (
                        <div className="dataTable__bulkActions_menu">
                            {actions.map((action) => (
                                <Button
                                    key={action.id}
                                    appearance={action.variant === "danger" ? "danger" : "secondary"}
                                    layout="text"
                                    size="small"
                                    Icon={action.icon as any}
                                    onClick={() => {
                                        action.action([]);
                                        setIsMenuOpen(false);
                                    }}
                                    className="dataTable__bulkActions_menuItem"
                                >
                                    {action.label}
                                </Button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default BulkActions;
