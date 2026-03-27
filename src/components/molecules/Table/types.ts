import { IPaginationProps } from "@components/molecules/Pagination";

export interface ITableErrorTexts {
    noDataAvailableTitle?: string;
    noDataAvailableText?: string;
    noResultFoundTitle?: string;
    noResultFoundText?: string;
}

export interface ITablePaginationProps extends Partial<IPaginationProps> {
    showInputPageField?: boolean;
    rowsPerPageOptions?: number[];
}
