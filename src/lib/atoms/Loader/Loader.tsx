import React, { FC, ReactNode } from 'react';

// Styles
import './Loader.scss';

interface ILoaderProps {
    /**
     * Any valid React node. Renders when "isLoading" is set to false
     */
    children?: ReactNode;
    /**
     * Indicates if spinner should be visible.
     */
    isLoading?: boolean;
    /**
     * Text to provide more context for Loader.
     */
    text?: string;
    /**
     * Loader visual style. <br/>
     * Possible values: `brand | neutral | inverse`
     */
    appearance?: 'brand' | 'neutral' | 'inverse';
    /**
     * Loader size <br/>
     * Possible values: `2xLarge | xLarge | large | medium | small | smallNudge`
     */
    size?: '2xLarge' | 'xLarge' | 'large' | 'medium' | 'small' | 'smallNudge';
    /**
     *  Loader text position. <br/>.
     *  Possible values: `below | after`
     */
    textPosition?: 'below' | 'after';
}

/**
 *Loading spinner is a visual indicator that informs users an operation is in progress. Typically displayed as a rotating icon or circular animation, it signals that the system is working on a task, such as loading data or processing a request, and that the user should wait until the process is complete.
 */

const Loader: FC<ILoaderProps> = ({
    isLoading = true,
    text,
    textPosition = 'after',
    size = 'medium',
    appearance = 'brand',
    children
}) => {
    if (isLoading) {
        return (
            <span className={`loader loader_direction_${textPosition} loader_size_${size} loader_color_${appearance}`}>
                <svg className="loader__spinner" viewBox="0 0 50 50">
                    <circle className="loader__spinner_path" cx="25" cy="25" r="20" fill="none" strokeWidth="5" />
                </svg>
                {text && <span className={`loader__text loader__text_color_${appearance}`}>{text}</span>}
            </span>
        );
    } else {
        return <>{children}</>;
    }
};

export { ILoaderProps, Loader as default };
