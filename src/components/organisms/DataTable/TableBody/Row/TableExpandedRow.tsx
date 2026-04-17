import React, { ReactNode } from "react";

// Styles
import "./TableExpandedRow.scss";

/**
 * Props for the {@link TableExpandedRow} component.
 */
interface ITableExpandedRowProps {
    colspan: number;
    children: ReactNode;
}

/**
 * Renders an individual table expanded row (`<tr>`).
 * This component iterates through all visible expanded rows
 *
 * @returns A table row element containing its respective rendered cells.
 */
const TableExpandedRow = ({ colspan, children }: ITableExpandedRowProps) => {
    return (
        <tr className="tableExpandedRow">
            <td colSpan={colspan} className="tableExpandedCell">
                {children}
            </td>
        </tr>
    );
};

export default TableExpandedRow;
