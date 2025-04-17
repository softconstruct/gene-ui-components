import React, { FC, useContext, useEffect } from "react";
import { createPortal } from "react-dom";
import classNames from "classnames";

// Components
import Scrollbar from "@components/atoms/Scrollbar";
import { GeneUIDesignSystemContext } from "@components/providers/GeneUIProvider";

// Hooks
import useClickOutside from "@hooks/useClickOutside";
import useScrollLock from "@hooks/useScrollLock";

// Styles
import "./Spreadsheet.scss";

interface ISpreadsheetProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    /**
     * Controls the visibility of the Spreadsheet component.
     * When `true`, the component is displayed as an overlay. When `false`, it is hidden.
     */
    open: boolean;
    /**
     * A callback function triggered when a close interaction is detected (e.g., click outside).
     * Use this to handle cleanup or update the state controlling open.
     */
    onClose?: () => void;
    /**
     * Controls whether padding/inset styles are applied to the content area inside the Spreadsheet.
     * Set to `false` to remove internal spacing for edge-to-edge content.
     */
    inset?: boolean;
    /**
     * The content to render inside the Spreadsheet.
     * Typically includes form elements, info panels, or custom UI blocks.
     */
    children?: React.ReactElement;
}

/**
 * The Spreadsheet component is a mobile-specific layout container designed to fully cover the Popover in mobile view. It acts as a structured content shell for displaying or editing contextual information triggered by a Popover — giving users a focused, full-screen experience on smaller screens.
 */
const Spreadsheet: FC<ISpreadsheetProps> = ({ open, inset = true, onClose = () => {}, children, className }) => {
    const bodyRef = useClickOutside(onClose);
    const { lock, unlock } = useScrollLock(document.body);

    const { geneUIProviderRef } = useContext(GeneUIDesignSystemContext);

    useEffect(() => {
        if (open) {
            lock();
        } else {
            unlock();
        }
    }, [open]);

    return (
        <>
            {open && geneUIProviderRef.current
                ? createPortal(
                      <div className={classNames("spreadsheet", className)}>
                          <div ref={bodyRef} className="spreadsheet__body">
                              <Scrollbar>
                                  <div className={classNames({ spreadsheet__body_inset: inset })}>{children}</div>
                              </Scrollbar>
                          </div>
                      </div>,
                      geneUIProviderRef.current
                  )
                : null}
        </>
    );
};

export { ISpreadsheetProps, Spreadsheet as default };
