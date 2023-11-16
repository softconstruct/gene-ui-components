import React from 'react';
import classnames from 'classnames';

function BreadcrumbItem({ data, active, onClick }) {
    return (
        <button onClick={onClick} className={classnames('breadcrumbs-link', { active })}>
            {data.title}
        </button>
    );
}

export default BreadcrumbItem;
