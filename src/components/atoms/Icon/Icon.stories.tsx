import React, { useMemo, useState } from "react";
import { Meta, StoryObj } from "@storybook/react";

import * as Icons from "@geneui/icons";
import { Magnifier } from "@geneui/icons";
import type { Icon } from "@geneui/icons/metadata";
import metadata from "@geneui/icons/metadata";

import Copy from "@components/atoms/Copy";
import Text from "@components/atoms/Text";
import TextField from "@components/molecules/TextField";

// Styles
import "./Icon.scss";

interface IconWithMetadata {
    name: string;
    component: React.ComponentType<{ size?: number }>;
    metadata: Icon;
}

interface IconCardProps {
    name: string;
    component: React.ComponentType<{ size?: number }>;
}

const getMatchPriority = (icon: IconWithMetadata, searchTerm: string) => {
    const iconNameLower = icon.name.toLowerCase();
    const searchLower = searchTerm.toLowerCase();

    if (iconNameLower === searchLower) {
        return 4; // Exact match
    }
    if (iconNameLower.startsWith(searchLower)) {
        return 3; // Start with match
    }
    if (iconNameLower.includes(searchLower)) {
        return 2; // Partial name match
    }
    if (icon.metadata.keywords?.some((keyword) => keyword.toLowerCase().includes(searchLower))) {
        return 1; // Keyword match
    }
    return 0; // No match
};

const IconCard: React.FC<IconCardProps> = ({ name, component: IconComponent }) => {
    const copyValue = `<${name} />`;

    return (
        <div className="icon-card">
            <div className="icon-card_icon">
                <IconComponent size={32} />
            </div>
            <Text as="span" variant="labelSmallSemibold" className="icon-card_name">
                {name}
            </Text>
            <div className="icon-card_copy">
                <Copy
                    value={`<${name} />`}
                    size="medium"
                    appearance="primary"
                    copyTooltipText={`Copy ${copyValue}`}
                    copiedTooltipText="Copied!"
                />
            </div>
        </div>
    );
};

const IconsCatalogComponent: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState("");

    // Map metadata to actual icon components
    const iconsWithMetadata = useMemo((): IconWithMetadata[] => {
        return Object.entries(metadata || {})
            .map(([iconName, iconData]) => {
                const IconComponent = (Icons as Record<string, React.ComponentType<{ size?: number }>>)[iconName];
                return {
                    name: iconName,
                    component: IconComponent,
                    metadata: iconData
                };
            })
            .filter((item): item is IconWithMetadata => !!item.component); // Only include icons that exist
    }, [metadata]);

    // Filter icons based on search term - exact name match first, then start with match, then partial name, then keywords
    const filteredIcons = useMemo((): IconWithMetadata[] => {
        if (!searchTerm.trim()) return iconsWithMetadata;

        return iconsWithMetadata
            .map((icon) => ({ icon, priority: getMatchPriority(icon, searchTerm.toLowerCase()) }))
            .filter((item) => item.priority > 0)
            .sort((a, b) => b.priority - a.priority)
            .map((item) => item.icon);
    }, [iconsWithMetadata, searchTerm]);

    return (
        <div className="icon-catalog">
            <div className="icon-catalog_header">
                <Text as="h1" variant="headingXLargeSemibold">
                    {`Icons Catalog ${filteredIcons.length} of ${iconsWithMetadata.length} icons`}
                </Text>
            </div>

            <div className="icon-catalog_search">
                <TextField
                    placeholder="Search icons by name or keywords..."
                    value={searchTerm}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                    IconBefore={Magnifier}
                />
            </div>

            <div className="icon-catalog_grid">
                {filteredIcons.map(({ name, component }) => (
                    <IconCard key={name} name={name} component={component} />
                ))}
            </div>

            {filteredIcons.length === 0 && searchTerm && (
                <div className="icon-catalog_empty-state">
                    <Text as="p" variant="bodyMediumSemibold">
                        {`No icons found for "${searchTerm}"`}
                    </Text>
                    <Text as="p" variant="bodyMediumRegular">
                        Try searching with different keywords or browse all icons
                    </Text>
                </div>
            )}
        </div>
    );
};

const meta: Meta = {
    title: "Atoms/Icon",
    component: IconsCatalogComponent,
    argTypes: {},
    args: {},
    parameters: {
        layout: "fullscreen",
        docs: {
            description: {
                component: `
# Icons Catalog

A comprehensive catalog of all available icons from @geneui/icons with advanced search functionality and copy-to-clipboard features.

## Features

- **Search by Name**: Find icons by exact or partial name matches
- **Search by Keywords**: Discover icons using their associated keywords
- **Priority Sorting**: Results are sorted by relevance (exact match → partial match → keyword match)
- **Copy to Clipboard**: Hover over any icon to reveal a copy button that copies the JSX component
- **Responsive Grid**: Icons are displayed in a responsive grid layout
- **Real-time Search**: Instant filtering as you type

## Usage

The Icons Catalog automatically loads all available icons from the @geneui/icons package and provides an intuitive interface for browsing and copying them.

### Copying Icons

1. Hover over any icon card
2. Click the copy button that appears
3. The JSX component (e.g., \`<ArrowUp />\`) will be copied to your clipboard
4. Paste directly into your React code

### Search Tips

- **Exact Match**: Type the exact icon name for instant results
- **Partial Match**: Type part of the icon name to find related icons
- **Keywords**: Use descriptive terms like "arrow", "user", "settings" to find icons by their keywords
                `
            }
        }
    }
};

export default meta;

type Story = StoryObj<typeof IconsCatalogComponent>;

export const IconsCatalog: Story = {};
