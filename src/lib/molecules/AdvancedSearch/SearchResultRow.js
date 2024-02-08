import React, { useCallback, useRef, useState } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';

// Helpers
import { useEllipsisDetection } from 'hooks';

// Components
import Icon from '../../atoms/Icon';
import Button from '../../atoms/Button';
import Tooltip from '../Tooltip';

function SearchResultRow({ element }) {
    const { icon, id, title, name, date, actions } = element;
    const [isFocused, setIsFocused] = useState(false);
    const titleRef = useRef(null);
    const isTitleTruncated = useEllipsisDetection(titleRef);
    const nameRef = useRef(null);
    const isNameTruncated = useEllipsisDetection(nameRef);

    // Handle blur event to clear focus state
    const handleBlur = useCallback(() => setIsFocused(false), [element]);

    // Handle Focus event to add focus state
    const handleFocus = useCallback(() => setIsFocused(true), [element]);

    return (
        <li
            className={classnames('searchResultRow', {
                'searchResultRow-hover': isFocused
            })}
        >
            {icon && <Icon type={element.icon} className="searchResultRow__icon" />}
            <div className="searchResultRow__info">
                {(id || title) && (
                    <div className="searchResultRow__titleWrapper">
                        {id && <span className="searchResultRow__id">{id}</span>}
                        {title && (
                            <Tooltip text={title} isVisible={isTitleTruncated}>
                                <span className="searchResultRow__title  ellipsis-text" ref={titleRef}>
                                    {title}
                                </span>
                            </Tooltip>
                        )}
                    </div>
                )}
                {(name || date) && (
                    <div className="searchResultRow__nameWrapper">
                        {name && (
                            <Tooltip text={name} isVisible={isNameTruncated}>
                                <span className="searchResultRow__name ellipsis-text" ref={nameRef}>
                                    {name}
                                </span>
                            </Tooltip>
                        )}
                        {name && date && <Icon type="bc-icon-dot" className="searchResultRow__dateSeparator" />}
                        {date && (
                            <div className="searchResultRow__dateWrapper">
                                {date.labelText && <span className="searchResultRow__dateText">{date.labelText}</span>}
                                {date.date && <span className="searchResultRow__date">{date.date}</span>}
                            </div>
                        )}
                    </div>
                )}
            </div>
            <div
                className={classnames('searchResultRow__actions', {
                    'searchResultRow__actions-hover': isFocused
                })}
            >
                {actions?.map((action, index) => (
                    <Button
                        key={index}
                        tabIndex={0}
                        size="medium"
                        icon={action.icon}
                        onBlur={handleBlur}
                        appearance="minimal"
                        onFocus={handleFocus}
                        cornerRadius="smooth"
                        onClick={() => action?.onClick(element)}
                        className="searchResultRow__action"
                        ariaLabel={action.name || action.icon}
                    />
                ))}
            </div>
        </li>
    );
}

SearchResultRow.defaultProps = {
    element: {}
};

SearchResultRow.propTypes = {
    element: PropTypes.shape({
        icon: PropTypes.string,
        id: PropTypes.string,
        title: PropTypes.string,
        type: PropTypes.string,
        name: PropTypes.string,
        date: PropTypes.shape({
            labelText: PropTypes.string,
            date: PropTypes.oneOfType([
                PropTypes.instanceOf(dayjs),
                PropTypes.instanceOf(Date),
                PropTypes.string,
                PropTypes.number
            ])
        }),
        actions: PropTypes.arrayOf(
            PropTypes.shape({
                name: PropTypes.string,
                icon: PropTypes.string,
                onClick: PropTypes.func
            })
        )
    })
};

export default SearchResultRow;
