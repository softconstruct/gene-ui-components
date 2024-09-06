import React, { FC } from 'react';

// Styles
import './Header.scss';

interface IHeaderProps {
    /**
     * type description
     */
    type?: unknown;
}

/**
 * Global Header component is a persistent navigation element that appears at the top of an application or website. It serves as a central hub for accessing key features and tools, ensuring consistent and intuitive navigation across all pages.
 */
const Header: FC<IHeaderProps> = ({ type }) => {
    return <header className="header">Header component</header>;
};

export { IHeaderProps, Header as default };
