import React from "react";

import { Globe, LightBulb } from "@geneui/icons";

import Pill from "@components/atoms/Pill";

export const data = [
    {
        title: "Users",
        selected: false,
        id: "users",
        value: "users",
        IconBefore: Globe,
        danger: true,
        divider: true
    },
    {
        title: "Admins",
        selected: false,
        id: "admins",
        value: "admins",
        IconAfter: LightBulb,
        danger: true
    },
    {
        title: "Options",
        id: "options",
        value: "options",
        ComponentRender: () => (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Pill appearance="informative" filled size="small" withDot />
                <span>custom</span>
            </div>
        )
    },
    {
        title: "Projects",
        selected: false,
        id: "projects",
        value: "projects",
        IconAfter: LightBulb,
        divider: true,
        children: [],
        emptyText: "No projects available"
    },
    {
        title: "Teams",
        selected: false,
        id: "teams",
        value: "teams",
        IconBefore: Globe,
        children: [
            {
                title: "Alpha",
                selected: false,
                id: "team-alpha",
                value: "alpha",
                children: [
                    {
                        title: "UI",
                        id: "alpha-ui",
                        value: "ui",
                        loading: true,
                        loadingText: "Loading...",
                        children: []
                    },
                    { title: "UX", id: "alpha-ux", value: "ux", selected: true },
                    {
                        title: "Dev",
                        selected: false,
                        id: "alpha-dev",
                        value: "dev",
                        children: Array.from({ length: 10 }, (_, i) => ({
                            title: `Module ${i + 1}`,
                            selected: false,
                            id: `alpha-mod-${i + 1}`,
                            value: `mod${i + 1}`
                        }))
                    }
                ]
            },
            {
                title: "Delta",
                selected: false,
                id: "team-delta",
                value: "delta"
            },
            {
                title: "Epsilon",
                selected: false,
                id: "team-epsilon",
                value: "epsilon"
            },
            {
                title: "Beta",
                selected: false,
                id: "team-beta",
                value: "beta",
                children: [
                    {
                        title: "Design",
                        selected: false,
                        id: "beta-design",
                        value: "design"
                    },
                    {
                        title: "Dev",
                        selected: false,
                        id: "beta-dev",
                        value: "dev",
                        children: [
                            { title: "Node", selected: false, id: "beta-node", value: "node" },
                            {
                                title: "Infra",
                                selected: false,
                                id: "beta-infra",
                                value: "infra",
                                children: Array.from({ length: 6 }, (_, i) => ({
                                    title: `Region ${i + 1}`,
                                    selected: false,
                                    id: `infra-region-${i + 1}`,
                                    value: `region${i + 1}`
                                }))
                            }
                        ]
                    }
                ]
            },
            ...Array.from({ length: 10 }, (_, i) => ({
                title: `Team ${i + 1}`,
                selected: false,
                id: `team-${i + 1}`,
                value: `team${i + 1}`
            })),
            {
                title: "Gamma",
                selected: false,
                id: "team-gamma",
                value: "gamma",
                children: [
                    {
                        title: "QA",
                        selected: false,
                        id: "gamma-qa",
                        value: "qa",
                        children: Array.from({ length: 8 }, (_, i) => ({
                            title: `Test ${i + 1}`,
                            selected: false,
                            id: `qa-test-${i + 1}`,
                            value: `test${i + 1}`
                        }))
                    },
                    {
                        title: "Docs",
                        selected: false,
                        id: "gamma-docs",
                        value: "docs"
                    }
                ]
            }
        ]
    },
    {
        title: "Settings",
        selected: false,
        id: "settings",
        value: "settings",
        children: [
            {
                title: "General",
                selected: false,
                id: "settings-general",
                value: "general"
            },
            {
                title: "Security",
                selected: false,
                id: "settings-security",
                value: "security",
                children: [
                    {
                        title: "2FA",
                        selected: false,
                        id: "security-2fa",
                        value: "2fa"
                    },
                    {
                        title: "Sessions",
                        selected: false,
                        id: "security-sessions",
                        value: "sessions"
                    }
                ]
            }
        ]
    }
];
