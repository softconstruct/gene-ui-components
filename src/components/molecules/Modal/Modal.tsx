import React, { FC } from "react";
import classNames from "classnames";

import { ErrorFilled, Info, TriangleAlert, X } from "@geneui/icons";

import Button from "@components/atoms/Button";
import Scrollbar from "@components/atoms/Scrollbar";
import Text from "@components/atoms/Text";
import ButtonGroup from "@components/molecules/ButtonGroup";

// Styles
import "./Modal.scss";

interface IModalProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    // fill Modal component props interface
}

/**
 * Modal component displays content in a layer above the main application, effectively focusing the user's attention on a specific task or information. It is often used for actions that require user input, such as confirmation dialogs, forms, or important notifications.
 */
const Modal: FC<IModalProps> = ({ className }) => {
    return (
        <div className={classNames("modalWrapper modalWrapper_desktop", className)}>
            {/* Add class modalWrapper_desktop // modalWrapper_mobile for .modalWrapper */}
            {/* Add class modalWrapper_toTop for .modalWrapper */}
            {/* Add class modal_fullView for .modal */}
            {/* Add class modal_insetTrue for .modal */}
            <div className="modal modal_insetTrue">
                <div className="modal__header">
                    <div className="modal__headerContent">
                        <Info className="modal_status_informative" size={20} />
                        <ErrorFilled className="modal_status_error" size={20} />
                        <TriangleAlert className="modal_status_warning" size={20} />
                        <Text variant="labelLargeSemibold" className="modal__title" as="p">
                            Modal Title
                        </Text>
                    </div>
                    <Button size="small" Icon={X} type="button" layout="text" appearance="secondary" />
                </div>
                <div className="modal__body">
                    <Scrollbar>
                        <div className="modal__content">
                            <Text variant="bodyLargeMedium" className="modal__paragraph" as="p">
                                You are about to perform an action that will permanently alter your current settings.
                                Once you proceed, these changes cannot be reversed, and the previous state will be lost.
                                Please take a moment to carefully review your choices and ensure that you have saved any
                                necessary information before continuing.
                            </Text>
                        </div>
                    </Scrollbar>
                </div>
                <div className="modal__footer">
                    {/* Any component can be placed here */}
                    <ButtonGroup className="modal__buttonGroup" size="medium">
                        <Button appearance="secondary">Secondary</Button>
                        <Button appearance="primary">Primary</Button>
                    </ButtonGroup>
                </div>
            </div>
        </div>
    );
};

export { IModalProps, Modal as default };
