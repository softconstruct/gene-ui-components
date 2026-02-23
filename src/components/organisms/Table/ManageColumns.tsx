import React, { ChangeEvent, FC } from "react";

// Components
import Button from "@components/atoms/Button";
import Divider from "@components/atoms/Divider";
import Scrollbar from "@components/atoms/Scrollbar";
import Text from "@components/atoms/Text";
import ButtonGroup from "@components/molecules/ButtonGroup";
import TextField from "@components/molecules/TextField";
import { Actions } from "@components/organisms/Table/types";

interface IManageColumnsProps {
    label?: string;
    onColumnSearch?: (event: ChangeEvent<HTMLInputElement>) => void;
    onMenuClose?: () => void;
    actionsInfo?: Actions;
}

const ManageColumns: FC<IManageColumnsProps> = ({ label, onMenuClose, onColumnSearch, actionsInfo }) => {
    const handleCancel = () => {
        actionsInfo?.secondary?.onClick?.();
        onMenuClose?.();
    };

    return (
        <div className="dropdownMenu">
            <div className="dropdownMenu__header">
                <TextField type="text" placeholder="Search" onChange={onColumnSearch} />
            </div>

            <Scrollbar>
                <div className="dropdownMenu__main">
                    <div className="dropdownMenu__columns">
                        {label && (
                            <div className="dropdownMenu__columns_header">
                                <Text as="p" className="dropdownMenu__columns_title ellipsis-text">
                                    {label}
                                </Text>
                            </div>
                        )}
                        {/* <DragDropContext onDragEnd={handleDragEnd}>{renderDroppableSection(columns)}</DragDropContext> */}
                    </div>
                    <Divider />
                </div>
            </Scrollbar>

            <div className="dropdownMenu__footer">
                {actionsInfo?.tertiary && (
                    <Button
                        appearance="secondary"
                        layout="text"
                        size="medium"
                        onClick={actionsInfo.tertiary.onClick}
                        aria-label={actionsInfo.tertiary.ariaLabel || actionsInfo.tertiary.label}
                        disabled={actionsInfo.tertiary.disabled}
                    >
                        {actionsInfo.tertiary.label}
                    </Button>
                )}
                <ButtonGroup size="medium">
                    {actionsInfo?.secondary && (
                        <Button
                            appearance="secondary"
                            layout="fill"
                            size="medium"
                            onClick={handleCancel}
                            aria-label={actionsInfo.secondary.ariaLabel || actionsInfo.secondary.label}
                            disabled={actionsInfo.secondary.disabled}
                        >
                            {actionsInfo.secondary.label}
                        </Button>
                    )}
                    {actionsInfo?.primary && (
                        <Button
                            className="dropdownMenu__footer_buttonGroup_save"
                            appearance="primary"
                            layout="fill"
                            size="medium"
                            aria-label={actionsInfo.primary.ariaLabel || actionsInfo.primary.label}
                            disabled={actionsInfo.primary.disabled}
                        >
                            {actionsInfo.primary.label}
                        </Button>
                    )}
                </ButtonGroup>
            </div>
        </div>
    );
};

export { IManageColumnsProps, ManageColumns as default };
