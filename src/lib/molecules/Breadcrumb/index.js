import React, { Fragment, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// Helpers
import { noop } from 'utils';

// Components
import Button from '../../atoms/Button';
import Popover from '../../atoms/Popover';
import Icon from '../../atoms/Icon';
import Menu from '../Menu';

// Local components
import BreadcrumbItem from './item';

// Styles
import './index.scss';

function Breadcrumb({ data, onClick, collapsed, className, separator, ...restProps }) {
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const [firstItem, ...others] = data;

    const handlePopoverItemClick = useCallback(
        (_, item) => {
            onClick(item);
            setIsPopoverOpen(false);
        },
        [onClick]
    );

    const handlePopoverToggle = useCallback(() => {
        setIsPopoverOpen((prev) => !prev);
    }, []);

    return (
        <div className={classnames('bread-crumbs-holder', className)} {...restProps}>
            {collapsed && data.length > 4 ? (
                <>
                    <BreadcrumbItem onClick={() => onClick(firstItem)} data={firstItem} />
                    {separator}
                    <Popover
                        isOpen={isPopoverOpen}
                        align="bottom-start"
                        toggleHandler={handlePopoverToggle}
                        extendTargetWidth={false}
                        Content={<Menu onSelect={handlePopoverItemClick} data={others.slice(0, -2)} />}
                        customStyles={{
                            margin: '0 0.4rem'
                        }}
                    >
                        <Button
                            onClick={handlePopoverToggle}
                            icon="bc-icon-more-horizontal"
                            appearance="minimal"
                            color="default"
                        />
                    </Popover>
                    {separator}
                    {others.slice(-2).map((item, i) => (
                        <Fragment key={item.slug}>
                            <BreadcrumbItem
                                onClick={() => onClick(item)}
                                active={i === 1}
                                key={item.slug}
                                data={item}
                            />
                            {i !== 1 && separator}
                        </Fragment>
                    ))}
                </>
            ) : (
                data.map((item, i) => (
                    <Fragment key={item.slug}>
                        <BreadcrumbItem onClick={() => onClick(item)} active={data.length - 1 === i} data={item} />
                        {data.length - 1 !== i && separator}
                    </Fragment>
                ))
            )}
        </div>
    );
}

Breadcrumb.propTypes = {
    /**
     * Data items to display
     */
    data: PropTypes.arrayOf(
        PropTypes.shape({
            title: PropTypes.node.isRequired
        })
    ).isRequired,
    /**
     * Additional className
     */
    className: PropTypes.string,
    /**
     * Breadcrumbs will render collapsed view when "data" length is greater than 4, when set to "true"
     */
    collapsed: PropTypes.bool,
    /**
     * Fires an event on breadcrumb item click((item: data[item] => void))
     */
    onClick: PropTypes.func,
    /**
     * Use this prop to define the middle component between breadcrumb items.
     */
    separator: PropTypes.node
};

Breadcrumb.defaultProps = {
    collapsed: false,
    onClick: noop,
    separator: <Icon type="bc-icon-arrow-right" />
};

export default Breadcrumb;
