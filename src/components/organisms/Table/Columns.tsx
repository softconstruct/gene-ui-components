import React from "react";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";

import Pill from "@components/atoms/Pill";
import { Row } from "@components/organisms/Table/types";

const DISPLAY_COLUMN_TYPES = ["Group", "Empty", "Expand", "RowCheckbox"];
const columnHelper = createColumnHelper<Row>();

export const createColumns = (columns: ColumnDef<Row>[]) => {
    return columns.map((item) => {
        if (DISPLAY_COLUMN_TYPES.includes(item.type)) {
            return columnHelper.display({
                id: item?.id || item.dataKey,
                cell: () => "hello",
                type: item.type,
                dataKey: item.dataKey
            });
        }
        return columnHelper.accessor((row) => row.dataKey, {
            id: item?.id || item.dataKey,
            header: () => item?.header || null,
            type: item.type,
            dataKey: item.dataKey
        });
    });
};

export const Columns: ColumnDef<Row>[] = [
    {
        id: "expand",
        dataKey: "expand",
        isVisible: true,
        order: 0,
        enableGlobalFilter: false,
        type: "Expand"
    },
    {
        id: "rowCheckbox",
        dataKey: "RowCheckbox",
        isVisible: true,
        order: 0,
        enableGlobalFilter: false,
        type: "RowCheckbox"
    },
    {
        id: "id",
        dataKey: "id",
        isVisible: true,
        order: 1,
        enableGlobalFilter: true,
        type: "Text",
        accessorFn: (row) => row.id.toString(),
        enableSorting: true,
        editable: true,
        copyable: true,
        header: "ID"
    },
    {
        id: "firstName",
        dataKey: "FirstName",
        isVisible: true,
        order: 1,
        enableGlobalFilter: true,
        type: "Text",
        accessorFn: (row) => row.FirstName,
        enableSorting: true,
        editable: true,
        copyable: true,
        header: "First Name"
    },
    {
        id: "login",
        dataKey: "Login",
        isVisible: true,
        order: 1,
        enableGlobalFilter: true,
        type: "Text",
        accessorFn: (row) => row.Login,
        enableSorting: true,
        editable: true,
        copyable: true,
        header: "Login"
    },
    {
        id: "lastName",
        dataKey: "LastName",
        isVisible: true,
        order: 1,
        enableGlobalFilter: true,
        type: "Text",
        accessorFn: (row) => row.LastName,
        enableSorting: true,
        editable: true,
        copyable: true,
        header: "Last Name"
    },
    {
        id: "personalId",
        dataKey: "PersonalId",
        isVisible: true,
        order: 1,
        enableGlobalFilter: true,
        type: "Text",
        accessorFn: (row) => row.PersonalId,
        enableSorting: true,
        editable: true,
        copyable: true,
        header: "Personal ID"
    },
    {
        id: "email",
        dataKey: "Email",
        isVisible: true,
        order: 1,
        enableGlobalFilter: true,
        type: "Text",
        accessorFn: (row) => row.Email,
        enableSorting: true,
        editable: true,
        copyable: true,
        header: "Email"
    },
    {
        id: "affiliateId",
        dataKey: "AffiliateId",
        isVisible: true,
        order: 1,
        enableGlobalFilter: true,
        type: "Text",
        accessorFn: (row) => row.AffiliateId,
        enableSorting: true,
        editable: true,
        copyable: true,
        header: "Affiliate ID"
    },
    {
        id: "bTag",
        dataKey: "BTag",
        isVisible: true,
        order: 1,
        enableGlobalFilter: true,
        type: "Text",
        accessorFn: (row) => row.BTag,
        enableSorting: true,
        editable: true,
        copyable: true,
        header: "BTag"
    },
    {
        id: "isEmailSubscribed",
        dataKey: "IsSubscribeToEmail",
        isVisible: true,
        order: 1,
        enableGlobalFilter: true,
        type: "Switch",
        accessorFn: (row) => row.IsSubscribeToEmail,
        enableSorting: true,
        editable: true,
        copyable: true,
        header: "Is Email Subscribed"
    },
    {
        id: "SMSSubs",
        dataKey: "IsSubscribeToSMS",
        isVisible: true,
        order: 1,
        enableGlobalFilter: true,
        type: "Switch",
        accessorFn: (row) => row.IsSubscribeToSMS,
        enableSorting: true,
        editable: true,
        copyable: true,
        header: "SMS Subs."
    },
    {
        id: "externalID",
        dataKey: "ExternalId",
        isVisible: true,
        order: 1,
        enableGlobalFilter: true,
        type: "Text",
        accessorFn: (row) => row.ExternalId,
        enableSorting: true,
        editable: true,
        copyable: true,
        header: "External ID"
    },
    {
        id: "status",
        dataKey: "Status",
        isVisible: true,
        order: 1,
        enableGlobalFilter: true,
        type: "Status",
        rowCellRenderer: (value) => {
            const isOpen = (value as number) < 3;
            return <Pill text={isOpen ? "Open" : "Closed"} appearance={isOpen ? "success" : "error"} />;
        },
        enableSorting: true,
        editable: true,
        copyable: true,
        header: "Status"
    },
    {
        id: "accountHolder",
        dataKey: "AccountHolder",
        isVisible: true,
        order: 1,
        enableGlobalFilter: true,
        type: "Text",
        accessorFn: (row) => row.AccountHolder,
        enableSorting: true,
        editable: true,
        copyable: true,
        header: "Account Holder"
    },
    {
        id: "address",
        dataKey: "Address",
        isVisible: true,
        order: 1,
        enableGlobalFilter: true,
        type: "Text",
        accessorFn: (row) => row.Address,
        enableSorting: true,
        editable: true,
        copyable: true,
        header: "Address"
    },
    {
        id: "balance",
        dataKey: "Balance",
        isVisible: true,
        order: 1,
        enableGlobalFilter: true,
        type: "Text",
        accessorFn: (row) => row.Balance,
        enableSorting: true,
        editable: true,
        copyable: true,
        header: "Balance"
    },
    {
        id: "birthCity",
        dataKey: "BirthCity",
        isVisible: true,
        order: 1,
        enableGlobalFilter: true,
        type: "Text",
        accessorFn: (row) => row.BirthCity,
        enableSorting: true,
        editable: true,
        copyable: true,
        header: "Birth City"
    },
    {
        id: "birthday",
        dataKey: "BirthDate",
        isVisible: true,
        order: 1,
        enableGlobalFilter: true,
        type: "Text",
        accessorFn: (row) => row.BirthDate,
        enableSorting: true,
        editable: true,
        copyable: true,
        header: "Birthday"
    },
    {
        id: "birthDepartment",
        dataKey: "BirthDepartment",
        isVisible: true,
        order: 1,
        enableGlobalFilter: true,
        type: "Text",
        accessorFn: (row) => row.BirthDepartment,
        enableSorting: true,
        editable: true,
        copyable: true,
        header: "Birth Department"
    },
    {
        id: "birthRegionCode",
        dataKey: "BirthRegionCode2",
        isVisible: true,
        order: 1,
        enableGlobalFilter: true,
        type: "Text",
        accessorFn: (row) => row.BirthRegionCode2,
        enableSorting: true,
        editable: true,
        copyable: true,
        header: "Birth Region Code"
    },
    {
        id: "birthRegionId",
        dataKey: "BirthRegionId",
        isVisible: true,
        order: 1,
        enableGlobalFilter: true,
        type: "Text",
        accessorFn: (row) => row.BirthRegionId,
        enableSorting: true,
        editable: true,
        copyable: true,
        header: "Birth Region Id"
    },
    {
        id: "cashDeskId",
        dataKey: "CashDeskId",
        isVisible: true,
        order: 1,
        enableGlobalFilter: true,
        type: "Text",
        accessorFn: (row) => row.CashDeskId,
        enableSorting: true,
        editable: true,
        copyable: true,
        header: "CashDesk Id"
    },
    {
        id: "created",
        dataKey: "Created",
        isVisible: true,
        order: 1,
        enableGlobalFilter: true,
        type: "Text",
        accessorFn: (row) => row.Created,
        enableSorting: true,
        editable: true,
        copyable: true,
        header: "Created"
    },
    {
        id: "currencyId",
        dataKey: "CurrencyId",
        isVisible: true,
        order: 1,
        enableGlobalFilter: true,
        type: "Text",
        accessorFn: (row) => row.CurrencyId,
        enableSorting: true,
        editable: true,
        copyable: true,
        header: "Currency Id"
    },
    {
        id: "customPlayerCategory",
        dataKey: "CustomPlayerCategory",
        isVisible: true,
        order: 1,
        enableGlobalFilter: true,
        type: "Text",
        accessorFn: (row) => row.CustomPlayerCategory,
        enableSorting: true,
        editable: true,
        copyable: true,
        header: "Custom Player Category"
    },
    {
        id: "documentIssueCode",
        dataKey: "DocIssueCode",
        isVisible: true,
        order: 1,
        enableGlobalFilter: true,
        type: "Text",
        accessorFn: (row) => row.DocIssueCode,
        enableSorting: true,
        editable: true,
        copyable: true,
        header: "Document Issue Code"
    },
    {
        id: "documentIssueDate",
        dataKey: "DocIssueDate",
        isVisible: true,
        order: 1,
        enableGlobalFilter: true,
        type: "Text",
        accessorFn: (row) => row.DocIssueDate,
        enableSorting: true,
        editable: true,
        copyable: true,
        header: "Document Issue Date"
    },
    {
        id: "documentIssuedBy",
        dataKey: "DocIssueBy",
        isVisible: true,
        order: 1,
        enableGlobalFilter: true,
        type: "Text",
        accessorFn: (row) => row.DocIssueBy,
        enableSorting: true,
        editable: true,
        copyable: true,
        header: "Document Issued By"
    },
    {
        id: "documentNumber",
        dataKey: "DocNumber",
        isVisible: true,
        order: 1,
        enableGlobalFilter: true,
        type: "Text",
        accessorFn: (row) => row.DocNumber,
        enableSorting: true,
        editable: true,
        copyable: true,
        header: "Document Number"
    },
    {
        id: "IBAN",
        dataKey: "IBAN",
        isVisible: true,
        order: 1,
        enableGlobalFilter: true,
        type: "Text",
        accessorFn: (row) => row.IBAN,
        enableSorting: true,
        editable: true,
        copyable: true,
        header: "IBAN"
    },
    {
        id: "isResident",
        dataKey: "IsResident",
        isVisible: true,
        order: 1,
        enableGlobalFilter: true,
        type: "Switch",
        accessorFn: (row) => row.IsResident,
        enableSorting: true,
        editable: true,
        copyable: true,
        header: "Is Resident"
    },
    {
        id: "lastLoginDate",
        dataKey: "LastLoginLocalDate",
        isVisible: true,
        order: 1,
        enableGlobalFilter: true,
        type: "Text",
        accessorFn: (row) => row.LastLoginLocalDate,
        enableSorting: true,
        editable: true,
        copyable: true,
        header: "Last Login Date"
    },
    {
        id: "middleName",
        dataKey: "MiddleName",
        isVisible: true,
        order: 1,
        enableGlobalFilter: true,
        type: "Text",
        accessorFn: (row) => row.MiddleName,
        enableSorting: true,
        editable: true,
        copyable: true,
        header: "Middle Name"
    }
];
