import React, { ChangeEvent, FC, useState } from "react";

import Copy from "@components/atoms/Copy/Copy";
import Pill, { IPillProps } from "@components/atoms/Pill";
import Text from "@components/atoms/Text";
import Checkbox, { ICheckboxProps } from "@components/molecules/Checkbox";
import { ISwitchProps } from "@components/molecules/Switch";
import { Row, TableCol } from "@components/molecules/Table/type";

const GENDER: Record<string, string> = {
    "0": "Male",
    "1": "Female",
    "2": "Other"
};

const LANGUAGE: string[] = ["en", "fr", "es", "de"];

type GenderDropDown = {
    data: unknown;
    editMode: boolean | undefined;
    onChange: ((value: string | number) => void) | undefined;
};

const CustomGenderDropdown: FC<GenderDropDown> = ({ data, editMode, onChange }) => {
    const [value, setValue] = useState<string>(() => data as string);

    const onDropDownChange = (e: ChangeEvent<HTMLSelectElement>) => {
        onChange?.(e.target.value);
        setValue(e.target.value);
    };

    if (editMode) {
        return (
            <select name="dropdown" id="dropdown" style={{ width: "160px" }} value={value} onChange={onDropDownChange}>
                {Object.keys(GENDER).map((option) => (
                    <option key={option} value={+option}>
                        {GENDER[option]}
                    </option>
                ))}
            </select>
        );
    }

    return (
        <>
            <Text as="span" className="table__td_text ellipsis-text">
                {GENDER[value]}
            </Text>
            <Copy value={GENDER[value]} size="small" appearance="secondary" className="table__content_copy" />
        </>
    );
};

const CustomLanguageDropdown: FC<GenderDropDown> = ({ data, editMode, onChange }) => {
    const [value, setValue] = useState<string>(() => data as string);

    const onDropDownChange = (e: ChangeEvent<HTMLSelectElement>) => {
        onChange?.(e.target.value);
        setValue(e.target.value);
    };

    if (editMode) {
        return (
            <select name="dropdown" id="dropdown" style={{ width: "160px" }} value={value} onChange={onDropDownChange}>
                {LANGUAGE.map((lang) => (
                    <option key={lang} value={lang}>
                        {lang}
                    </option>
                ))}
            </select>
        );
    }

    return (
        <>
            <Text as="span" className="table__td_text ellipsis-text">
                {value}
            </Text>
            <Copy value={value} size="small" appearance="secondary" className="table__content_copy" />
        </>
    );
};

export const Columns: TableCol<Row>[] = [
    {
        id: "expand",
        dataKey: "expand",
        isVisible: true,
        order: 0,
        enableGlobalFilter: false,
        type: "Expand",
        accessorKey: "expand",
        header: ""
    },
    {
        id: "rowCheckbox",
        dataKey: "RowCheckbox",
        isVisible: true,
        order: 0,
        enableGlobalFilter: false,
        type: "RowCheckbox",
        accessorKey: "rowCheckbox"
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
        id: "gender",
        dataKey: "Gender",
        isVisible: true,
        order: 1,
        enableGlobalFilter: true,
        type: "Dropdown",
        accessorFn: (row) => row.Gender,
        rowCellRenderer: (data, editMode, onChange) => (
            <CustomGenderDropdown data={data} editMode={editMode} onChange={onChange} />
        ),
        enableSorting: true,
        editable: true,
        copyable: true,
        header: "Gender"
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
        id: "language",
        dataKey: "Language",
        isVisible: true,
        order: 1,
        enableGlobalFilter: true,
        type: "Dropdown",
        accessorFn: (row) => row.Language,
        rowCellRenderer: (data, editMode, onChange) => (
            <CustomLanguageDropdown data={data} editMode={editMode} onChange={onChange} />
        ),
        enableSorting: true,
        editable: true,
        copyable: true,
        header: "Language"
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

export const defaultColumns: TableCol<Row>[] = [
    {
        id: "expand",
        dataKey: "expand",
        isVisible: true,
        order: 0,
        enableGlobalFilter: false,
        type: "Expand",
        accessorKey: "expand",
        header: ""
    },
    {
        id: "rowCheckbox",
        dataKey: "RowCheckbox",
        isVisible: true,
        order: 0,
        enableGlobalFilter: false,
        type: "RowCheckbox",
        accessorKey: "rowCheckbox"
    },
    {
        id: "graph",
        dataKey: "Graph",
        isVisible: true,
        order: 2,
        enableGlobalFilter: false,
        enableColumnFilter: false,
        type: "Graph",
        accessorKey: "graph",
        enableSorting: false,
        editable: false,
        copyable: false,
        header: "Graph",
        rowCellRenderer: () => <div>here will be Image</div>,
        footer: (props) => props.column.id
    },
    {
        id: "title",
        dataKey: "Title",
        order: 2,
        isVisible: true,
        type: "Text",
        disabled: true,
        accessorFn: (row) => row.Text,
        enableSorting: true,
        editable: true,
        copyable: true,
        isColumnFilterDisabled: true,
        header: "Title",
        footer: (props) => props.column.id
    },
    {
        id: "number",
        dataKey: "Number",
        isVisible: true,
        order: 1,
        enableGlobalFilter: true,
        type: "Number",
        accessorFn: (row) => row.Number,
        enableSorting: true,
        editable: true,
        copyable: true,
        header: "Number",
        footer: (props) => props.column.id
    },
    {
        id: "description",
        dataKey: "Description",
        isVisible: true,
        order: 2,
        enableGlobalFilter: false,
        type: "LongText",
        accessorFn: (row) => row.LongText,
        editable: true,
        copyable: true,
        enableSorting: false,
        header: "Description",
        footer: (props) => props.column.id
    },
    {
        id: "dropdown",
        dataKey: "Dropdown",
        isVisible: true,
        order: 2,
        enableGlobalFilter: true,
        type: "Dropdown",
        accessorFn: (row) => row.Dropdown,
        rowCellRenderer: (data, editMode, onChange) => (
            <CustomGenderDropdown data={data} editMode={editMode} onChange={onChange} />
        ),
        editable: true,
        copyable: true,
        enableSorting: true,
        enablePopoverFilter: false,
        header: "Dropdown",
        footer: (props) => props.column.id
    },
    {
        id: "status",
        dataKey: "Status",
        isVisible: true,
        order: 2,
        enableGlobalFilter: true,
        type: "Status",
        accessorFn: (row) => row.Status,
        enableColumnFilter: false,
        enablePopoverFilter: true,
        isPopoverFilterDisabled: true,
        rowCellRenderer: (props) => <Pill {...(props as IPillProps)} />,
        enableSorting: true,
        copyable: false,
        header: "Status",
        footer: (props) => props.column.id
    },
    {
        id: "pill",
        dataKey: "Pill",
        isVisible: true,
        order: 2,
        enableGlobalFilter: false,
        type: "Pill",
        accessorFn: (row) => row.Pill,
        enableColumnFilter: false,
        editable: false,
        copyable: false,
        enableSorting: true,
        rowCellRenderer: (props) => <Pill {...(props as IPillProps)} />,
        header: "Pill",
        footer: (props) => props.column.id
    },
    {
        id: "icon",
        dataKey: "Icon",
        isVisible: true,
        order: 2,
        enableGlobalFilter: false,
        type: "Icon",
        accessorFn: (row) => row.Icon,
        enableColumnFilter: false,
        editable: false,
        copyable: false,
        enableSorting: true,
        header: "Icon",
        footer: (props) => props.column.id
    },
    {
        id: "flag",
        dataKey: "Flag",
        isVisible: true,
        order: 2,
        enableGlobalFilter: false,
        type: "Flag",
        accessorFn: (row) => row.Flag,
        enableColumnFilter: false,
        editable: false,
        copyable: false,
        enableSorting: true,
        header: "Flag",
        footer: (props) => props.column.id
    },
    {
        id: "checkbox",
        dataKey: "Checkbox",
        isVisible: true,
        order: 2,
        enableGlobalFilter: false,
        type: "Checkbox",
        accessorFn: (row) => (row.Checkbox as ICheckboxProps).checked,
        enableColumnFilter: false,
        editable: true,
        copyable: false,
        enableSorting: true,
        rowCellRenderer: (props) => <Checkbox readOnly {...(props as ICheckboxProps)} />,
        enablePopoverFilter: true,
        header: "Checkbox",
        footer: (props) => props.column.id
    },
    {
        id: "switch",
        dataKey: "Switch",
        isVisible: true,
        order: 2,
        enableGlobalFilter: false,
        type: "Switch",
        accessorFn: (row) => ((row.Switch as ISwitchProps).checked ? "On" : "Off"),
        enableColumnFilter: false,
        editable: true,
        copyable: false,
        enableSorting: true,
        enablePopoverFilter: true,
        filterOptions: ["On", "Off"],
        header: "Switch",
        footer: (props) => props.column.id
    }
];

export const withPinnedColumns: TableCol<Row>[] = [
    {
        id: "rowCheckbox",
        dataKey: "RowCheckbox",
        isVisible: true,
        order: 0,
        enableGlobalFilter: false,
        type: "RowCheckbox",
        accessorKey: "rowCheckbox"
    },
    {
        id: "graph",
        dataKey: "Graph",
        isVisible: true,
        order: 2,
        enableGlobalFilter: false,
        enableColumnFilter: false,
        type: "Graph",
        accessorKey: "graph",
        enableSorting: false,
        editable: false,
        copyable: false,
        header: "Graph",
        rowCellRenderer: () => <div>here will be Image</div>,
        footer: (props) => props.column.id
    },
    {
        id: "title",
        dataKey: "Title",
        order: 2,
        isVisible: true,
        type: "Text",
        disabled: true,
        accessorFn: (row) => row.Text,
        enableSorting: true,
        editable: true,
        copyable: true,
        isColumnFilterDisabled: true,
        header: "Title",
        footer: (props) => props.column.id
    },
    {
        id: "number",
        dataKey: "Number",
        isVisible: true,
        order: 1,
        enableGlobalFilter: true,
        type: "Number",
        accessorFn: (row) => row.Number,
        enableSorting: true,
        editable: true,
        copyable: true,
        header: "Number",
        footer: (props) => props.column.id
    },
    {
        id: "description",
        dataKey: "Description",
        isVisible: true,
        order: 2,
        enableGlobalFilter: false,
        type: "LongText",
        accessorFn: (row) => row.LongText,
        editable: true,
        copyable: true,
        enableSorting: false,
        header: "Description",
        footer: (props) => props.column.id
    },
    {
        id: "dropdown",
        dataKey: "Dropdown",
        isVisible: true,
        order: 2,
        enableGlobalFilter: true,
        type: "Dropdown",
        rowCellRenderer: (data, editMode, onChange) => (
            <CustomGenderDropdown data={data} editMode={editMode} onChange={onChange} />
        ),
        accessorFn: (row) => row.Dropdown,
        editable: true,
        copyable: true,
        enableSorting: true,
        enablePopoverFilter: false,
        header: "Dropdown",
        footer: (props) => props.column.id
    },
    {
        id: "status",
        dataKey: "Status",
        isVisible: true,
        order: 2,
        enableGlobalFilter: true,
        type: "Status",
        accessorFn: (row) => row.Status,
        enableColumnFilter: false,
        enablePopoverFilter: true,
        isPopoverFilterDisabled: true,
        rowCellRenderer: (props) => <Pill {...(props as IPillProps)} />,
        enableSorting: true,
        copyable: false,
        header: "Status",
        footer: (props) => props.column.id
    },
    {
        id: "pill",
        dataKey: "Pill",
        isVisible: true,
        order: 2,
        enableGlobalFilter: false,
        type: "Pill",
        accessorFn: (row) => row.Pill,
        enableColumnFilter: false,
        editable: false,
        copyable: false,
        enableSorting: true,
        rowCellRenderer: (props) => <Pill {...(props as IPillProps)} />,
        header: "Pill",
        footer: (props) => props.column.id
    },
    {
        id: "icon",
        dataKey: "Icon",
        isVisible: true,
        order: 2,
        enableGlobalFilter: false,
        type: "Icon",
        accessorFn: (row) => row.Icon,
        enableColumnFilter: false,
        editable: false,
        copyable: false,
        enableSorting: true,
        header: "Icon",
        footer: (props) => props.column.id
    },
    {
        id: "flag",
        dataKey: "Flag",
        isVisible: true,
        order: 2,
        enableGlobalFilter: false,
        type: "Flag",
        accessorFn: (row) => row.Flag,
        enableColumnFilter: false,
        editable: false,
        copyable: false,
        enableSorting: true,
        header: "Flag",
        footer: (props) => props.column.id
    },
    {
        id: "checkbox",
        dataKey: "Checkbox",
        isVisible: true,
        order: 2,
        enableGlobalFilter: false,
        type: "Checkbox",
        accessorFn: (row) => (row.Checkbox as ICheckboxProps).checked,
        enableColumnFilter: false,
        editable: true,
        copyable: false,
        enableSorting: true,
        rowCellRenderer: (props) => <Checkbox readOnly {...(props as ICheckboxProps)} />,
        enablePopoverFilter: true,
        header: "Checkbox",
        footer: (props) => props.column.id
    },
    {
        id: "switch",
        dataKey: "Switch",
        isVisible: true,
        order: 2,
        enableGlobalFilter: false,
        type: "Switch",
        accessorFn: (row) => ((row.Switch as ISwitchProps).checked ? "On" : "Off"),
        enableColumnFilter: false,
        editable: true,
        copyable: false,
        enableSorting: true,
        enablePopoverFilter: true,
        filterOptions: ["On", "Off"],
        header: "Switch",
        footer: (props) => props.column.id
    }
];

export const withGroupedColumns: TableCol<Row>[] = [
    {
        id: "groupName",
        dataKey: "groupName",
        header: "Group Name",
        accessorKey: "groupName",
        order: 0,
        type: "Text",
        footer: (props) => props.column.id,
        enableSorting: false,
        enableGlobalFilter: false,
        enableColumnFilter: false,
        columns: [
            {
                id: "expand",
                dataKey: "expand",
                isVisible: true,
                order: 0,
                enableGlobalFilter: false,
                type: "Expand",
                accessorKey: "expand",
                header: null
            },
            {
                id: "rowCheckbox",
                dataKey: "RowCheckbox",
                isVisible: true,
                order: 0,
                enableGlobalFilter: false,
                type: "RowCheckbox",
                accessorKey: "rowCheckbox",
                header: null
            },
            {
                id: "graph",
                dataKey: "Graph",
                isVisible: true,
                order: 2,
                enableGlobalFilter: false,
                enableColumnFilter: false,
                type: "Graph",
                accessorKey: "graph",
                enableSorting: false,
                editable: false,
                copyable: false,
                header: "Graph",
                rowCellRenderer: () => <div>here will be Image</div>,
                footer: (props) => props.column.id
            },
            {
                id: "title",
                dataKey: "Title",
                order: 2,
                isVisible: true,
                type: "Text",
                disabled: true,
                accessorFn: (row) => row.Text,
                enableSorting: true,
                editable: true,
                copyable: true,
                isColumnFilterDisabled: true,
                header: "Title",
                footer: (props) => props.column.id
            },
            {
                id: "number",
                dataKey: "Number",
                isVisible: true,
                order: 1,
                enableGlobalFilter: true,
                type: "Number",
                accessorFn: (row) => row.Number,
                enableSorting: true,
                isSortingDisabled: true,
                editable: true,
                copyable: true,
                header: "Number",
                footer: (props) => props.column.id
            },
            {
                id: "description",
                dataKey: "Description",
                isVisible: true,
                order: 2,
                enableGlobalFilter: false,
                type: "LongText",
                accessorFn: (row) => row.LongText,
                editable: true,
                copyable: true,
                enableSorting: false,
                header: "Description",
                footer: (props) => props.column.id
            },
            {
                id: "dropdown",
                dataKey: "Dropdown",
                isVisible: true,
                order: 2,
                enableGlobalFilter: true,
                type: "Dropdown",
                rowCellRenderer: (_, editMode, onChange) => {
                    return <CustomGenderDropdown data="0" editMode={editMode} onChange={onChange} />;
                },
                accessorFn: (row) => row.Dropdown,
                editable: true,
                copyable: true,
                enableSorting: true,
                enablePopoverFilter: false,
                header: "Dropdown",
                footer: (props) => props.column.id
            },
            {
                id: "status",
                dataKey: "Status",
                isVisible: true,
                order: 2,
                enableGlobalFilter: true,
                type: "Status",
                accessorFn: (row) => row.Status,
                enableColumnFilter: false,
                enablePopoverFilter: true,
                isPopoverFilterDisabled: true,
                rowCellRenderer: (props) => <Pill {...(props as IPillProps)} />,
                enableSorting: true,
                copyable: false,
                header: "Status",
                footer: (props) => props.column.id
            },
            {
                id: "pill",
                dataKey: "Pill",
                isVisible: true,
                order: 2,
                enableGlobalFilter: false,
                type: "Pill",
                accessorFn: (row) => row.Pill,
                enableColumnFilter: false,
                editable: false,
                copyable: false,
                enableSorting: true,
                rowCellRenderer: (props) => <Pill {...(props as IPillProps)} />,
                header: "Pill",
                footer: (props) => props.column.id
            },
            {
                id: "icon",
                dataKey: "Icon",
                isVisible: true,
                order: 2,
                enableGlobalFilter: false,
                type: "Icon",
                accessorFn: (row) => row.Icon,
                enableColumnFilter: false,
                editable: false,
                copyable: false,
                enableSorting: true,
                header: "Icon",
                footer: (props) => props.column.id
            },
            {
                id: "flag",
                dataKey: "Flag",
                isVisible: true,
                order: 2,
                enableGlobalFilter: false,
                type: "Flag",
                accessorFn: (row) => row.Flag,
                enableColumnFilter: false,
                editable: false,
                copyable: false,
                enableSorting: true,
                header: "Flag",
                footer: (props) => props.column.id
            },
            {
                id: "checkbox",
                dataKey: "Checkbox",
                isVisible: true,
                order: 2,
                enableGlobalFilter: false,
                type: "Checkbox",
                accessorFn: (row) => (row.Checkbox as ICheckboxProps).checked,
                enableColumnFilter: false,
                editable: true,
                copyable: false,
                enableSorting: true,
                rowCellRenderer: (props) => <Checkbox readOnly {...(props as ICheckboxProps)} />,
                enablePopoverFilter: true,
                header: "Checkbox",
                footer: (props) => props.column.id
            },
            {
                id: "switch",
                dataKey: "Switch",
                isVisible: true,
                order: 2,
                enableGlobalFilter: false,
                type: "Switch",
                accessorFn: (row) => ((row.Switch as ISwitchProps).checked ? "On" : "Off"),
                enableColumnFilter: false,
                editable: true,
                copyable: false,
                enableSorting: true,
                enablePopoverFilter: true,
                filterOptions: ["On", "Off"],
                header: "Switch",
                footer: (props) => props.column.id
            }
        ] as TableCol<Row>[]
    }
];
