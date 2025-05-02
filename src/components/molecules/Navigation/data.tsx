import { Globe } from "@geneui/icons";

export const navigationData = [
    {
        title: "Dashboard",
        Icon: Globe,
        children: [
            {
                title: "Overview",
                children: [
                    {
                        title: "Summary",
                        Icon: Globe,
                        children: [
                            { title: "Dashboard", path: "/dashboard" },
                            { title: "Reports", path: "/reports" },
                            { title: "User Management", path: "/users" },
                            { title: "Settings", path: "/settings" },
                            { title: "Notifications", path: "/notifications" },
                            { title: "Analytics", path: "/analytics" },
                            { title: "Integrations", path: "/integrations" },
                            { title: "Audit Logs", path: "/audit-logs" },
                            { title: "Billing", path: "/billing" },
                            { title: "Help Center", path: "/help" },
                            { title: "Feedback", path: "/feedback" },
                            { title: "Support Tickets", path: "/support" },
                            { title: "Activity Feed", path: "/activity" },
                            { title: "Task Board", path: "/tasks" },
                            { title: "Calendar", path: "/calendar" },
                            { title: "Team Members", path: "/team" },
                            { title: "Files", path: "/files" },
                            { title: "Messages", path: "/messages" },
                            { title: "Announcements", path: "/announcements" },
                            { title: "Live Chat", path: "/chat" },
                            { title: "Customer Profiles", path: "/customers" },
                            { title: "Product Catalog", path: "/products" },
                            { title: "Orders", path: "/orders" },
                            { title: "Inventory", path: "/inventory" },
                            { title: "Delivery Tracking", path: "/delivery" },
                            { title: "Invoices", path: "/invoices" },
                            { title: "Subscriptions", path: "/subscriptions" },
                            { title: "Marketing Tools", path: "/marketing" },
                            { title: "SEO Settings", path: "/seo" },
                            { title: "Referral Program", path: "/referrals" },
                            { title: "Admin Tools", path: "/admin-tools" },
                            { title: "Developer API", path: "/api" },
                            { title: "System Status", path: "/status" },
                            { title: "Changelog", path: "/changelog" },
                            { title: "Privacy Policy", path: "/privacy" },
                            { title: "Terms of Service", path: "/terms" }
                        ]
                    },
                    { title: "Performance", path: "/performance" }
                ]
            },
            { title: "Insights", path: "/insights" }
        ]
    },
    {
        title: "Reports",
        Icon: Globe,
        children: [
            {
                title: "Annual Report",
                children: [
                    { title: "2023 Highlights", path: "/2023Highlights" },
                    { title: "Revenue Breakdown", path: "/revenueBreakdown" }
                ]
            },
            {
                title: "Monthly Reports",
                path: "/monthlyReports"
            }
        ]
    },
    {
        title: "Users",
        Icon: Globe,
        children: [
            {
                title: "User List",
                children: [
                    {
                        title: "Admins",
                        path: "/admins"
                    },
                    {
                        title: "Guests",
                        path: "/guests"
                    }
                ]
            },
            { title: "Activity Logs", path: "activityLogs" }
        ]
    },
    {
        title: "Settings",
        Icon: Globe,
        children: [
            {
                title: "Profile Settings",
                children: [
                    { title: "Privacy", path: "/privacy" },
                    { title: "Notifications", path: "notifications" }
                ]
            },
            { title: "Security", path: "/security" } // No children
        ]
    },
    {
        title: "Billing",
        Icon: Globe,
        children: [
            {
                title: "Invoices",
                children: [
                    { title: "2024", path: "/2024" },
                    { title: "2023", path: "/2023" }
                ]
            },
            { title: "Payment Methods", path: "/paymentMethods" }
        ]
    },
    {
        title: "Help Center",
        Icon: Globe,
        children: [
            { title: "FAQ", path: "/faq" },
            { title: "Contact Support", path: "/contactSupport" }
        ]
    }
];
