import React, { FC } from "react";

// Components
import Button from "@components/atoms/Button";

interface IListFooterProps {
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
 * Footer for the List. Shown when showMore is true.
 * Contains a "Show more" button aligned to the right.
 */
const ListFooter: FC<IListFooterProps> = ({
    showMore = false,
    onShowMore,
    showMoreLabel = "Show more",
    disabled,
    loading = false
}) => {
    return (
        showMore && (
            <div className="list__footer">
                <Button
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

export { IListFooterProps, ListFooter as default };
