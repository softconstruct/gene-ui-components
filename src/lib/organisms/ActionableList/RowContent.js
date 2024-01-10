import React, { useRef } from 'react';
import PropTypes from 'prop-types';
// Import styles

import './index.scss';
// Import helpers
import { noop } from 'utils';
import isEmpty from 'lodash/isEmpty';
// Import components
import { Button, Icon, Tooltip, Checkbox } from 'components';

function RowContent({
    label,
    highlightedLabel,
    isChecked,
    isPermanent, // @TODO extend CRM permanent row styles for this flag
    isOpened,
    isDraggable,
    isSelectable,
    hasChildren,
    onArrowBtnClick,
    onCheckboxClick,
    tooltipProps,
    childNodesCount,
    selectedChildNodesCount
}) {
    const checkboxRef = useRef({});

    const handleCheckboxChange = ({ current }) => {
        onCheckboxClick(current.checked);
    };

    const dynamicProps = {};

    if (isSelectable) {
        dynamicProps.onChange = () => {
            handleCheckboxChange(checkboxRef);
        };
        dynamicProps.style = { cursor: 'pointer' };
    }

    return (
        <div className="gene-actionable-list-row-content">
            {hasChildren && (
                <Button
                    appearance="minimal"
                    icon={`bc-icon-arrow-${isOpened ? 'down' : 'right'}`}
                    onClick={onArrowBtnClick}
                />
            )}

            <div className="gene-actionable-list-row-content-body">
                {isSelectable && (
                    <Checkbox
                        indeterminate={isChecked === null}
                        checked={isChecked}
                        ref={checkboxRef}
                        {...dynamicProps}
                    />
                )}

                <span>{React.isValidElement(highlightedLabel) ? highlightedLabel : label}</span>

                {/* {hasChildren && `${selectedChildNodesCount} / ${childNodesCount}`} */}
            </div>

            {!isEmpty(tooltipProps) && (
                <Tooltip {...tooltipProps}>
                    <Icon type="bc-icon-info" />
                </Tooltip>
            )}

            {isDraggable && <Icon type="bc-icon-drag" />}
        </div>
    );
}

RowContent.propTypes = {
    label: PropTypes.string,
    highlightedLabel: PropTypes.node,
    isChecked: PropTypes.bool,
    isPermanent: PropTypes.bool,
    isOpened: PropTypes.bool,
    hasChildren: PropTypes.bool,
    onArrowBtnClick: PropTypes.func,
    onCheckboxClick: PropTypes.func,
    isDraggable: PropTypes.bool,
    isSelectable: PropTypes.bool,
    tooltipProps: PropTypes.shape({
        ...Tooltip.propTypes
    })
};

RowContent.defaultProps = {
    onArrowBtnClick: noop,
    onCheckboxClick: noop,
    tooltipProps: {}
};

RowContent.displayName = 'RowContent';

export default RowContent;
