import React from 'react';

function Header({ columns }) {
    return (
        <ul className="nt-row nt-head">
            {columns.map((column, index) => {
                const { render, text } = column;
                const children = render ? render(column, index) : text;

                return (
                    <div key={index} title={children} className="nt-cell">
                        <div className="ellipsis-text">{children}</div>
                    </div>
                );
            })}
        </ul>
    );
}

export default Header;
