import React, { forwardRef } from 'react';

// Styles
import './SplitButton.scss';

interface ISplitButtonProps {
    /**
     * size description
     */
    size?: unknown;
}

/**
 * A split button allows users to choose from several related actions. The primary action is displayed as the button label, while additional actions are accessible from a dropdown menu.
 */
const SplitButton = forwardRef<unknown, ISplitButtonProps>(({ size }: ISplitButtonProps, ref) => {
    return <div className="splitButton">SplitButton</div>;
});

export { ISplitButtonProps, SplitButton as default };
