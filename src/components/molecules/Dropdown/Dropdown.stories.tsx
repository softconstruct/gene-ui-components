import React, { useEffect, useMemo, useState } from "react";
import { Meta, StoryObj } from "@storybook/react";
// eslint-disable-next-line import/no-extraneous-dependencies
import { fn } from "@storybook/test";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
import { dropdownOptions } from "../../../../stories/data/__dropdown";
// Components
import Dropdown, { IDropdownOption, IDropdownProps } from "./index";

const meta: Meta<IDropdownProps> = {
    title: "Molecules/Dropdown",
    component: Dropdown,
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance }),
        variant: args({ control: "select", options: ["single", "multi"], ...propCategory.functionality }),
        options: args({ control: "false", ...propCategory.content }),
        size: args({ control: "select", options: ["large", "medium", "small"], ...propCategory.appearance }),
        label: args({ control: "text", ...propCategory.content }),
        infoText: args({ control: "text", ...propCategory.content }),
        helperText: args({ control: "text", ...propCategory.content }),
        required: args({ control: "boolean", ...propCategory.validation }),
        disabled: args({ control: "boolean", ...propCategory.states }),
        readOnly: args({ control: "boolean", ...propCategory.states }),
        status: args({ control: "select", options: ["rest", "warning", "error"], ...propCategory.states }),
        searchable: args({ control: "boolean", ...propCategory.functionality }),
        searchAutoFocus: args({ control: "boolean", ...propCategory.functionality }),
        searchPlaceholder: args({ control: "text", ...propCategory.content }),
        defaultSearchValue: args({ control: "text", ...propCategory.content }),
        resetSearchOnClose: args({ control: "boolean", ...propCategory.functionality }),
        filterFn: args({ control: "false", ...propCategory.functionality }),
        loading: args({ control: "boolean", ...propCategory.states }),
        loadingText: args({ control: "text", ...propCategory.content }),
        emptyText: args({ control: "text", ...propCategory.content }),
        actions: args({ control: "object", ...propCategory.action })
    },
    args: {
        options: dropdownOptions,
        size: "medium",
        label: "Label",
        infoText: "Info text",
        helperText: "Helper text",
        placeholder: "Select option",
        status: "rest",
        searchable: true,
        loadingText: "Loading info",
        emptyText: "No data",
        onOpenChange: fn(),
        onChange: fn(),
        onSearchChange: fn()
    }
};

export default meta;

type Story = StoryObj<IDropdownProps>;

export const Default: Story = {};

const MultiSelectStory = (renderProps: IDropdownProps) => {
    const [values, setValues] = useState<string[]>(["dropdown-item-1", "dropdown-item-2"]);
    return (
        <Dropdown
            {...renderProps}
            variant="multi"
            values={values}
            onChange={(nextValue) => {
                if (Array.isArray(nextValue)) {
                    setValues(nextValue.map((item) => item.value));
                }
            }}
        />
    );
};

export const MultiSelect: Story = {
    render: (renderProps) => <MultiSelectStory {...renderProps} />
};

export const Loading: Story = {
    args: {
        loading: true
    }
};

export const Empty: Story = {
    args: {
        options: []
    }
};

export const WithFooterActions: Story = {
    args: {
        actions: {
            secondary: { text: "Secondary" },
            primary: { text: "Submit" }
        }
    }
};

const AsyncSearchStory = (renderProps: IDropdownProps) => {
    const [search, setSearch] = useState("");
    const [results, setResults] = useState<IDropdownOption[]>(dropdownOptions);
    const [loading, setLoading] = useState(false);

    /* eslint consistent-return: off */
    useEffect(() => {
        if (!search) {
            setResults(dropdownOptions);
            setLoading(false);
            return;
        }
        setLoading(true);
        const timeoutId = window.setTimeout(() => {
            const normalized = search.toLowerCase();
            setResults(dropdownOptions.filter((option) => option.label.toLowerCase().includes(normalized)));
            setLoading(false);
        }, 600);
        return () => window.clearTimeout(timeoutId);
    }, [search]);

    return (
        <Dropdown {...renderProps} options={results} loading={loading} filterFn={false} onSearchChange={setSearch} />
    );
};

export const AsyncSearch: Story = {
    args: {
        searchable: true,
        helperText: "Type to search; results are fetched by the parent."
    },
    render: (renderProps) => <AsyncSearchStory {...renderProps} />
};

const CustomFilterStory = (renderProps: IDropdownProps) => {
    const startsWithFilter = useMemo(
        () => (option: IDropdownOption, term: string) => option.label.toLowerCase().startsWith(term),
        []
    );
    return <Dropdown {...renderProps} filterFn={startsWithFilter} />;
};

export const CustomFilter: Story = {
    args: {
        searchable: true,
        helperText: "Custom filter: starts-with match on label."
    },
    render: (renderProps) => <CustomFilterStory {...renderProps} />
};
