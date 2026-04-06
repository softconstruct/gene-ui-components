import React, { FC, ReactNode } from "react";

// Components
import Button from "@components/atoms/Button";
import Pill from "@components/atoms/Pill";
import Checkbox from "@components/molecules/Checkbox";
import NumberField from "@components/molecules/NumberField";
import Switch from "@components/molecules/Switch";
import { DataTableColumn } from "@components/organisms/DataTable/types";

type ClientProfile = {
    Id: number;
    FirstName: string;
    LastName: string;
    DayOffs: number;
    Email: string;
    IsVerified: boolean;
    IsLocked: boolean;
    Created: string;
    Status: "new" | "active" | "inactive" | "suspended";
    expandedRow?: ReactNode;
};

const ExpandedData: FC<{ data: string }> = ({ data }) => <div className="swapComponent">{data}</div>;

export const mockColumns: DataTableColumn<ClientProfile>[] = [
    { accessorKey: "Id", header: "Id" },
    {
        accessorKey: "IsVerified",
        header: "Verified",
        renderCell: ({ value }) => <Switch defaultChecked={Boolean(value)} />
    },
    {
        accessorKey: "DayOffs",
        header: "Day offs",
        renderCell: ({ value }) => <NumberField defaultValue={Number(value)} />
    },
    {
        accessorKey: "Status",
        header: "Status",
        renderCell: ({ value }) => <Pill text={String(value)} />
    },
    { accessorKey: "FirstName", header: "First name" },
    {
        id: "Actions",
        header: "Actions",
        renderCell: () => (
            <div style={{ display: "flex", gap: "1rem" }}>
                <Button>View user data</Button>
                <Button appearance="danger">Block user</Button>
            </div>
        )
    },
    { accessorKey: "LastName", header: "Last name" },
    { accessorKey: "Email", header: "Email" },
    {
        accessorKey: "IsLocked",
        header: "Locked",
        renderCell: ({ value }) => <Checkbox defaultChecked={Boolean(value)} />
    },
    { accessorKey: "Created", header: "Created" }
];

const baseMockData: ClientProfile[] = [
    {
        Id: 12100972,
        FirstName: "Darwin",
        LastName:
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        DayOffs: 1,
        Email: "darwin.lorem@example.com",
        IsVerified: false,
        IsLocked: true,
        Created: "2026-01-14",
        Status: "new",
        expandedRow: (
            <ExpandedData data="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum." />
        )
    },
    {
        Id: 34829102,
        FirstName: "Alice",
        LastName: "Smith",
        DayOffs: 0,
        Email: "alice.smith@example.com",
        IsVerified: true,
        IsLocked: false,
        Created: "2026-02-05",
        Status: "active"
    },
    {
        Id: 59382104,
        FirstName: "Marcus",
        LastName: "Finch",
        DayOffs: 5,
        Email: "marcus.finch@example.com",
        IsVerified: true,
        IsLocked: false,
        Created: "2026-02-18",
        Status: "active"
    },
    {
        Id: 84729103,
        FirstName: "Sophia",
        LastName: "Carter",
        DayOffs: 9,
        Email: "sophia.carter@example.com",
        IsVerified: false,
        IsLocked: false,
        Created: "2026-03-01",
        Status: "new"
    },
    {
        Id: 48291034,
        FirstName: "Liam",
        LastName: "O'Connor",
        DayOffs: 22,
        Email: "liam.oconnor@example.com",
        IsVerified: true,
        IsLocked: true,
        Created: "2026-01-22",
        Status: "inactive"
    },
    {
        Id: 93847561,
        FirstName: "Emma",
        LastName: "Bridges",
        DayOffs: 10,
        Email: "emma.bridges@example.com",
        IsVerified: false,
        IsLocked: false,
        Created: "2026-03-10",
        Status: "new"
    },
    {
        Id: 27485910,
        FirstName: "Noah",
        LastName: "Patel",
        DayOffs: 4,
        Email: "noah.patel@example.com",
        IsVerified: true,
        IsLocked: false,
        Created: "2026-01-05",
        Status: "active"
    },
    {
        Id: 65738291,
        FirstName: "Olivia",
        LastName: "Gomez",
        DayOffs: 5,
        Email: "olivia.gomez@example.com",
        IsVerified: true,
        IsLocked: false,
        Created: "2026-02-28",
        Status: "active"
    },
    {
        Id: 10293847,
        FirstName: "Elijah",
        LastName: "Woodard",
        DayOffs: 7,
        Email: "elijah.woodard@example.com",
        IsVerified: false,
        IsLocked: true,
        Created: "2026-01-30",
        Status: "suspended"
    },
    {
        Id: 83920174,
        FirstName: "Ava",
        LastName: "Nguyen",
        DayOffs: 8,
        Email: "ava.nguyen@example.com",
        IsVerified: true,
        IsLocked: false,
        Created: "2026-03-15",
        Status: "active"
    },
    {
        Id: 56473829,
        FirstName: "William",
        LastName: "Kim",
        DayOffs: 14,
        Email: "william.kim@example.com",
        IsVerified: false,
        IsLocked: false,
        Created: "2026-03-18",
        Status: "new"
    },
    {
        Id: 39485712,
        FirstName: "Isabella",
        LastName: "Martinez",
        DayOffs: 12,
        Email: "isabella.martinez@example.com",
        IsVerified: true,
        IsLocked: true,
        Created: "2026-01-11",
        Status: "inactive"
    },
    {
        Id: 74839201,
        FirstName: "James",
        LastName: "Taylor",
        DayOffs: 28,
        Email: "james.taylor@example.com",
        IsVerified: true,
        IsLocked: false,
        Created: "2026-02-14",
        Status: "active"
    },
    {
        Id: 18273645,
        FirstName: "Mia",
        LastName: "Anderson",
        DayOffs: 30,
        Email: "mia.anderson@example.com",
        IsVerified: false,
        IsLocked: false,
        Created: "2026-03-05",
        Status: "new"
    },
    {
        Id: 92837465,
        FirstName: "Benjamin",
        LastName: "Thomas",
        DayOffs: 7,
        Email: "benjamin.thomas@example.com",
        IsVerified: true,
        IsLocked: false,
        Created: "2026-01-28",
        Status: "active"
    },
    {
        Id: 47586920,
        FirstName: "Charlotte",
        LastName: "Moore",
        DayOffs: 11,
        Email: "charlotte.moore@example.com",
        IsVerified: true,
        IsLocked: true,
        Created: "2026-02-09",
        Status: "suspended"
    },
    {
        Id: 29384756,
        FirstName: "Lucas",
        LastName: "Jackson",
        DayOffs: 0,
        Email: "lucas.jackson@example.com",
        IsVerified: false,
        IsLocked: false,
        Created: "2026-03-12",
        Status: "new"
    },
    {
        Id: 68473920,
        FirstName: "Amelia",
        LastName: "White",
        DayOffs: 2,
        Email: "amelia.white@example.com",
        IsVerified: true,
        IsLocked: false,
        Created: "2026-01-19",
        Status: "active"
    },
    {
        Id: 57483921,
        FirstName: "Henry",
        LastName: "Harris",
        DayOffs: 88,
        Email: "henry.harris@example.com",
        IsVerified: false,
        IsLocked: true,
        Created: "2026-02-25",
        Status: "inactive"
    },
    {
        Id: 38475629,
        FirstName: "Harper",
        LastName: "Martin",
        DayOffs: 0,
        Email: "harper.martin@example.com",
        IsVerified: true,
        IsLocked: false,
        Created: "2026-03-08",
        Status: "active"
    }
];

const MOCK_DATA_SIZE = 112;

export const mockData: ClientProfile[] = Array.from({ length: MOCK_DATA_SIZE }, (_, index) => {
    const source = baseMockData[index % baseMockData.length];
    const sequence = index + 1;

    return {
        ...source,
        Id: source.Id + index * 100000,
        Email: `${source.FirstName.toLowerCase()}.${sequence}@mail.com`
    };
});
