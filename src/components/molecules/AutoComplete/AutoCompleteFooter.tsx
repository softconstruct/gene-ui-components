import React, { FC } from "react";

// Components
import Button from "@components/atoms/Button";

interface IAutoCompleteFooterProps {
    /**
     * When true, the footer with "Show more" button is visible.
     */
    showMore?: boolean;
    /**
     * Callback when the "Show more" button is clicked.
     */
    onShowMore?: () => void;
    /**
     * Text for the "Show more" button.
     */
    showMoreLabel?: string;
    /**
     * Disables the "Show more" button.
     */
    disabled?: boolean;
    /**
     * Shows loading state for the "Show more" button.
     */
    loading?: boolean;
}

/**
 * Footer for the Autocomplete dropdown. Shown when showMore is true.
 * Contains a "Show more" button aligned to the right.
 */
const AutoCompleteFooter: FC<IAutoCompleteFooterProps> = ({
    showMore = false,
    onShowMore,
    showMoreLabel = "Show more",
    disabled,
    loading = false
}) => {
    return (
        showMore && (
            <div className="autoComplete__footer">
                <Button
                    className="autoComplete__footer_button"
                    appearance="secondary"
                    layout="text"
                    size="small"
                    onClick={onShowMore}
                    loading={loading}
                    disabled={disabled || loading}
                >
                    {showMoreLabel}
                </Button>
            </div>
        )
    );
};

export { IAutoCompleteFooterProps, AutoCompleteFooter as default };
