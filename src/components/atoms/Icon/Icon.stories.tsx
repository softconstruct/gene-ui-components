import React, { ChangeEvent, ComponentType, FC, ReactNode, useMemo, useState } from "react";
import { Meta, StoryObj } from "@storybook/react";
import classNames from "classnames";

// Icons
import * as Icons from "@geneui/icons";
import { Magnifier } from "@geneui/icons";
import type { Icon } from "@geneui/icons/metadata";
import iconsMetadata from "@geneui/icons/metadata";

// Components
import Copy from "@components/atoms/Copy";
import Divider from "@components/atoms/Divider";
import Text from "@components/atoms/Text";
import TextField from "@components/molecules/TextField";

// Styles
import "./Icon.scss";

interface IIconWithMetadata {
    name: string;
    IconComponent: ComponentType<{ size?: number }>;
    metadata: Icon;
}

interface IIconCardProps extends IIconWithMetadata {
    searchTerm: string;
}

const getMatchPriority = (icon: IIconWithMetadata, searchTerm: string) => {
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

// Function to find all matching parts using regex
const findMatches = (
    text: string,
    searchTerm: string
): Array<{ textSegment: string; isMatch: boolean; index: number }> => {
    if (!searchTerm.trim()) {
        return [{ textSegment: text, isMatch: false, index: 0 }];
    }

    const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
    const textSegments = text.split(regex);

    return textSegments.map((textSegment, index) => ({
        textSegment,
        isMatch: searchTerm.toLowerCase() === textSegment.toLowerCase(),
        index: index + 1
    }));
};

const highlightName = (text: string, searchTerm: string): ReactNode => {
    const matches = findMatches(text, searchTerm);

    return matches.map(({ textSegment, isMatch, index }) => (
        <Text
            key={index}
            variant="labelSmallSemibold"
            as="span"
            className={classNames({ iconCatalog_highlight: isMatch })}
        >
            {textSegment}
        </Text>
    ));
};

// Function to highlight only keywords
const highlightKeywords = (keywords: string[], searchTerm: string): ReactNode => {
    if (!searchTerm.trim()) {
        return keywords.map((keyword) => (
            <div key={keyword} className="iconCard__keyword">
                <Text variant="labelSmallSemibold" as="span">
                    {keyword}
                </Text>
            </div>
        ));
    }

    return keywords.map((keyword) => {
        const highlightedText = highlightName(keyword, searchTerm);

        return (
            <div key={keyword} className="iconCard__keyword">
                {highlightedText}
            </div>
        );
    });
};

const IconCard: FC<IIconCardProps> = ({ name, IconComponent, metadata, searchTerm = "" }) => {
    const copyValue = `<${name} />`;

    return (
        <div className="iconCard">
            <div className="iconCard__icon">
                <IconComponent size={32} />
            </div>
            <div className="iconCard__name">{highlightName(name, searchTerm)}</div>
            <Divider />
            {metadata.keywords && metadata.keywords.length > 0 && (
                <div className="iconCard__keywords">{highlightKeywords(metadata?.keywords || [], searchTerm)}</div>
            )}
            <div className="iconCard__copy">
                <Copy
                    value={copyValue}
                    size="medium"
                    appearance="primary"
                    copyTooltipText={`Copy ${copyValue}`}
                    copiedTooltipText="Copied!"
                />
            </div>
        </div>
    );
};

const IconsCatalogComponent: FC = () => {
    const [searchTerm, setSearchTerm] = useState("");

    // Map icons metadata to actual icon components
    const iconsWithMetadata = useMemo((): IIconWithMetadata[] => {
        return Object.entries(iconsMetadata || {})
            .map(([iconName, metadata]) => {
                const IconComponent = (Icons as Record<string, ComponentType<{ size?: number }>>)[iconName];
                return {
                    name: iconName,
                    IconComponent,
                    metadata
                };
            })
            .filter((iconWithComponent): iconWithComponent is IIconWithMetadata => !!iconWithComponent.IconComponent); // Only include icons that exist
    }, [iconsMetadata]);

    // Filter icons based on search term - exact name match first, then start with match, then partial name, then keywords
    const filteredIcons = useMemo((): IIconWithMetadata[] => {
        if (!searchTerm.trim()) return iconsWithMetadata;

        return iconsWithMetadata
            .map((icon) => ({ icon, priority: getMatchPriority(icon, searchTerm.toLowerCase()) }))
            .filter((iconWithPriority) => iconWithPriority.priority > 0)
            .sort((firstIcon, secondIcon) => secondIcon.priority - firstIcon.priority)
            .map((prioritizedIcon) => prioritizedIcon.icon);
    }, [iconsWithMetadata, searchTerm]);

    return (
        <div className="iconCatalog">
            <div className="iconCatalog__header">
                <Text as="h1" variant="headingXLargeSemibold">
                    {`Icons Catalog ${filteredIcons.length} of ${iconsWithMetadata.length} icons`}
                </Text>
            </div>

            <div className="iconCatalog__search">
                <TextField
                    placeholder="Search icons by name or keywords..."
                    value={searchTerm}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                    IconBefore={Magnifier}
                    clearable
                    onClear={() => setSearchTerm("")}
                />
            </div>

            <div className="iconCatalog__grid">
                {filteredIcons.map((iconItem) => (
                    <IconCard key={iconItem.metadata.id} {...iconItem} searchTerm={searchTerm} />
                ))}
            </div>

            {filteredIcons.length === 0 && searchTerm && (
                <div className="iconCatalog__empty">
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
