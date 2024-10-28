import React, { FC } from 'react';
import classNames from 'classnames';
// Styles
import './Text.scss';

interface ITextProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    /**
     * The HTML tag with which text will be rendered.
     */
    as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
    /**
     * Style variants
     */
    variant?:
        | 'headingXLargeSemibold'
        | 'headingLargeSemibold'
        | 'headingMediumSemibold'
        | 'headingSmallSemibold'
        | 'headingXSmallSemibold'
        | 'subheadingLargeSemibold'
        | 'subheadingMediumSemibold'
        | 'labelLargeSemibold'
        | 'labelLargeMedium'
        | 'labelLargeUnderlineSemibold'
        | 'labelLargeUnderlineMedium'
        | 'labelMediumSemibold'
        | 'labelMediumMedium'
        | 'labelMediumUnderlineSemibold'
        | 'labelMediumUnderlineMedium'
        | 'labelSmallSemibold'
        | 'labelSmallMedium'
        | 'labelSmallUnderlineSemibold'
        | 'labelSmallUnderlineMedium'
        | 'bodyLargeSemibold'
        | 'bodyLargeMedium'
        | 'bodyLargeRegular'
        | 'bodyLargeUnderlineSemibold'
        | 'bodyLargeUnderlineMedium'
        | 'bodyLargeUnderlineRegular'
        | 'bodyMediumSemibold'
        | 'bodyMediumMedium'
        | 'bodyMediumRegular'
        | 'bodyMediumUnderlineSemibold'
        | 'bodyMediumUnderlineMedium'
        | 'bodyMediumUnderlineRegular'
        | 'captionLargeSemibold'
        | 'captionLargeMedium'
        | 'captionLargeRegular'
        | 'captionMediumMedium'
        | 'captionMediumRegular';

    /**
     * Text
     */
    children: string;
}

const element = {
    h1: 'h1',
    h2: 'h2',
    h3: 'h3',
    h4: 'h4',
    h5: 'h5',
    h6: 'h6',
    p: 'p',
    span: 'span'
};

/**
 * Text component which has predefined tokens
 */
const Text: FC<ITextProps> = ({ className, variant, children, as = 'span' }) => {
    const Element = (element[as] ?? 'span') as React.ElementType;
    return (
        <div className={classNames('text', className)}>
            <Element className={classNames({ [`text_${variant}`]: Boolean(variant) })}>{children}</Element>
        </div>
    );
};

export { ITextProps, Text as default };
