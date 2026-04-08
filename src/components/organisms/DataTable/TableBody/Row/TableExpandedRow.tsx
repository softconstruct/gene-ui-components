import React, { ReactNode } from "react";

// Styles
import "./TableRow.scss";

/**
 * Props for the {@link TableExpandedRow} component.
 */
interface ITableExpandedRowProps {
    colspan: number;
    children: ReactNode;
}

/**
 * Renders an individual table expanded row (`<tr>`).
 * * This component iterates through all visible expanded rows
 *
 * @param props - The properties for the component.
 * @returns A table row element containing its respective rendered cells.
 */
const TableExpandedRow = ({ colspan, children }: ITableExpandedRowProps) => {
    return (
        <tr className="tableRow">
            <td colSpan={colspan} className="tableBodyCell">
                {children}
            </td>
        </tr>
    );
};

export default TableExpandedRow;
