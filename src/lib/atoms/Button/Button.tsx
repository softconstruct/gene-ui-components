import React, { forwardRef } from 'react';

// Styles
import './Button.scss';

interface IButtonProps {
    /**
     * size description
     */
    size?: unknown;
}

/**
 * Button initiates an action or event. Use buttons for key actions like submitting a form, saving changes, or advancing to the next step.
 */
const Button = forwardRef<unknown, IButtonProps>(({ size }: IButtonProps, ref) => {
    return <div className="button">Button</div>;
});

export { IButtonProps, Button as default };
