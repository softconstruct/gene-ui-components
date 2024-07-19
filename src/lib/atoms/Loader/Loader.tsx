import React, { FC } from 'react';

// Styles
import './Loader.scss';

interface ILoaderProps {
    /**
     * Indicates if Spinner should be visible.
     */
    show?: boolean;
    /**
     * Label to provide more context around the Tooltip’s function or purpose. By default text is used but this prop allows you to override it.
     */
    text?: string;
    /**
     * <code> "default" | "inverted"</code> <br/>
     * The tooltip's visual appearance.
     */
    appearance?: 'default' | 'inverted';
    /**
     * Whether or not to render with a 300ms delay.
     */
    delay?: boolean;

    size?: 'xs' | 's' | 'm' | 'l' | 'xl' | '2xl';
    /**
     * horizontal | vertical to define text position after or below the spinner.
     */
    textDirection?: 'horizontal' | 'vertical';
}

/**
 *Loading Spinner is a visual indicator that informs users an operation is in progress. Typically displayed as a rotating icon or circular animation, it signals that the system is working on a task, such as loading data or processing a request, and that the user should wait until the process is complete.
 */

const Loader: FC<ILoaderProps> = ({ show = true, text, textDirection = 'horizontal' }) => {
    if (!show) return null;
    return (
        <span className={`loader loader_direction_${textDirection} loader_size_2xlarge loader_color_brand`}>
            <svg className="loader__spinner" viewBox="0 0 50 50">
                <circle className="loader__spinner_path" cx="25" cy="25" r="20" fill="none" strokeWidth="5" />
            </svg>
            {text && <span className="loader__text loader__text_color_brand">{text}</span>}
        </span>
    );
};

export { ILoaderProps, Loader as default };
