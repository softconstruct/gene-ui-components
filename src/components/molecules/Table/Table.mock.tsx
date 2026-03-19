import React from "react";
import { ColumnDef } from "@tanstack/react-table";

import Button from "@components/atoms/Button";
import Pill from "@components/atoms/Pill";
import Checkbox from "@components/molecules/Checkbox";
// Components
import Switch from "@components/molecules/Switch";

export type ClientProfile = {
    Id: number;
    FirstName: string;
    LastName: string;
    Login: string;
    Email: string;
    IsVerified: boolean;
    IsLocked: boolean;
    Created: string;
    Status: "new" | "active" | "inactive" | "suspended";
};

export const mockColumns: ColumnDef<ClientProfile>[] = [
    { accessorKey: "Id", header: "Id" },
    { accessorKey: "Login", header: "Login" },
    { accessorKey: "FirstName", header: "First name" },
    { accessorKey: "LastName", header: "Last name" },
    { accessorKey: "Email", header: "Email" },
    {
        accessorKey: "IsVerified",
        header: "Verified",
        cell: ({ getValue }) => {
            const isVerified = getValue<boolean>();
            return <Switch checked={isVerified} />;
        }
    },
    {
        accessorKey: "IsLocked",
        header: "Locked",
        cell: ({ getValue }) => {
            const isLocked = getValue<boolean>();
            return <Checkbox checked={isLocked} />;
        }
    },
    { accessorKey: "Created", header: "Created" },
    {
        accessorKey: "Status",
        header: "Status",
        cell: ({ getValue }) => {
            const status = getValue<string>();
            return <Pill text={status} />;
        }
    },
    {
        accessorKey: "Actions",
        header: "Actions",
        cell: () => (
            <div style={{ display: "flex", gap: "1rem" }}>
                <Button>View user data</Button>
                <Button appearance="danger">Block user</Button>
            </div>
        )
    }
];

export const mockData: ClientProfile[] = [
    {
        Id: 12100972,
        FirstName: "Darwin",
        LastName:
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        Login: "Very",
        Email: "****",
        IsVerified: false,
        IsLocked: true,
        Created: "2026-01-14",
        Status: "new"
    },
    {
        Id: 34829102,
        FirstName: "Alice",
        LastName: "Smith",
        Login: "AliceS20",
        Email: "****",
        IsVerified: true,
        IsLocked: false,
        Created: "2026-02-05",
        Status: "active"
    },
    {
        Id: 59382104,
        FirstName: "Marcus",
        LastName: "Finch",
        Login: "MarkyMark",
        Email: "****",
        IsVerified: true,
        IsLocked: false,
        Created: "2026-02-18",
        Status: "active"
    },
    {
        Id: 84729103,
        FirstName: "Sophia",
        LastName: "Carter",
        Login: "SophC88",
        Email: "****",
        IsVerified: false,
        IsLocked: false,
        Created: "2026-03-01",
        Status: "new"
    },
    {
        Id: 48291034,
        FirstName: "Liam",
        LastName: "O'Connor",
        Login: "LiamO_1",
        Email: "****",
        IsVerified: true,
        IsLocked: true,
        Created: "2026-01-22",
        Status: "inactive"
    },
    {
        Id: 93847561,
        FirstName: "Emma",
        LastName: "Bridges",
        Login: "EmmB_26",
        Email: "****",
        IsVerified: false,
        IsLocked: false,
        Created: "2026-03-10",
        Status: "new"
    },
    {
        Id: 27485910,
        FirstName: "Noah",
        LastName: "Patel",
        Login: "NPatel_Dev",
        Email: "****",
        IsVerified: true,
        IsLocked: false,
        Created: "2026-01-05",
        Status: "active"
    },
    {
        Id: 65738291,
        FirstName: "Olivia",
        LastName: "Gomez",
        Login: "LivGomez",
        Email: "****",
        IsVerified: true,
        IsLocked: false,
        Created: "2026-02-28",
        Status: "active"
    },
    {
        Id: 10293847,
        FirstName: "Elijah",
        LastName: "Woodard",
        Login: "EliWood3",
        Email: "****",
        IsVerified: false,
        IsLocked: true,
        Created: "2026-01-30",
        Status: "suspended"
    },
    {
        Id: 83920174,
        FirstName: "Ava",
        LastName: "Nguyen",
        Login: "AvaWin99",
        Email: "****",
        IsVerified: true,
        IsLocked: false,
        Created: "2026-03-15",
        Status: "active"
    },
    {
        Id: 56473829,
        FirstName: "William",
        LastName: "Kim",
        Login: "WillK_77",
        Email: "****",
        IsVerified: false,
        IsLocked: false,
        Created: "2026-03-18",
        Status: "new"
    },
    {
        Id: 39485712,
        FirstName: "Isabella",
        LastName: "Martinez",
        Login: "IsaMarti",
        Email: "****",
        IsVerified: true,
        IsLocked: true,
        Created: "2026-01-11",
        Status: "inactive"
    },
    {
        Id: 74839201,
        FirstName: "James",
        LastName: "Taylor",
        Login: "JTaylorX",
        Email: "****",
        IsVerified: true,
        IsLocked: false,
        Created: "2026-02-14",
        Status: "active"
    },
    {
        Id: 18273645,
        FirstName: "Mia",
        LastName: "Anderson",
        Login: "MiaAnd_12",
        Email: "****",
        IsVerified: false,
        IsLocked: false,
        Created: "2026-03-05",
        Status: "new"
    },
    {
        Id: 92837465,
        FirstName: "Benjamin",
        LastName: "Thomas",
        Login: "BenjiT",
        Email: "****",
        IsVerified: true,
        IsLocked: false,
        Created: "2026-01-28",
        Status: "active"
    },
    {
        Id: 47586920,
        FirstName: "Charlotte",
        LastName: "Moore",
        Login: "CharMoore",
        Email: "****",
        IsVerified: true,
        IsLocked: true,
        Created: "2026-02-09",
        Status: "suspended"
    },
    {
        Id: 29384756,
        FirstName: "Lucas",
        LastName: "Jackson",
        Login: "LukeJ_90",
        Email: "****",
        IsVerified: false,
        IsLocked: false,
        Created: "2026-03-12",
        Status: "new"
    },
    {
        Id: 68473920,
        FirstName: "Amelia",
        LastName: "White",
        Login: "AmyWhite2",
        Email: "****",
        IsVerified: true,
        IsLocked: false,
        Created: "2026-01-19",
        Status: "active"
    },
    {
        Id: 57483921,
        FirstName: "Henry",
        LastName: "Harris",
        Login: "HankH_88",
        Email: "****",
        IsVerified: false,
        IsLocked: true,
        Created: "2026-02-25",
        Status: "inactive"
    },
    {
        Id: 38475629,
        FirstName: "Harper",
        LastName: "Martin",
        Login: "HarpMart",
        Email: "****",
        IsVerified: true,
        IsLocked: false,
        Created: "2026-03-08",
        Status: "active"
    }
];
