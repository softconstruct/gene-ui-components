import { ColumnDef } from "@tanstack/react-table";

type User = {
    id: number;
    name: string;
    email: string;
};

const mockColumns: ColumnDef<User>[] = [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "name", header: "Name" },
    { accessorKey: "email", header: "Email" }
];

const mockData: User[] = [
    { id: 1, name: "Alice Johnson", email: "alice@example.com" },
    { id: 2, name: "Bob Smith", email: "bob@example.com" }
];

export { mockColumns, mockData };
