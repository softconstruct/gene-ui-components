import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// Helpers
import { widgetConfig } from 'configs';

// Components
import Icon from '../../atoms/Icon';
import KeyValue from '../../atoms/KeyValue';
import ModuleTitle from '../../atoms/ModuleTitle';

// Styles
import './index.scss';

function Widget({
    type,
    img,
    title,
    text,
    color,
    headerActions,
    noDataText,
    noData,
    className,
    withShadow,
    withBorder,
    titleIcon,
    showComparisonIcons,
    comparisonText,
    comparisonStatus,
    size,
    titleProps,
    keyValues,
    ...restProps
}) {
    const isCompact = type === widgetConfig.type[1];
    const showKeyValues = useMemo(() => !!keyValues.length && size === widgetConfig.size[2], [size, keyValues]);

    return (
        <ul
            {...restProps}
            className={classnames(className, 'widget-holder', `t-${type}`, `s-${size}`, {
                'widget-grid': type !== widgetConfig.type[2] && type !== widgetConfig.type[3],
                shadow: withShadow,
                border: withBorder
            })}
            style={{ '--hero': color }}
        >
            {type === widgetConfig.type[2] ? (
                <>
                    <li>
                        <i style={{ background: color }} />
                        <span className="ellipsis-text">{title}</span>
                    </li>
                    <li>
                        <span
                            className={classnames('ellipsis-text', {
                                'no-data': noData
                            })}
                        >
                            {noData ? noDataText : text}
                        </span>
                        {!noData && (showComparisonIcons || comparisonText) && (
                            <div className={classnames('comparison-icons-holder', `cs-${comparisonStatus}`)}>
                                {comparisonText && <div className="comparison-text">{comparisonText}</div>}
                                {showComparisonIcons && (
                                    <div className="comparison-icons">
                                        <Icon type="bc-icon-comparison-up" />
                                        <Icon type="bc-icon-comparison-down" />
                                    </div>
                                )}
                            </div>
                        )}
                    </li>
                </>
            ) : type === widgetConfig.type[3] ? (
                <>
                    <li className="widget-c-title">
                        <p className="ellipsis-text">{title}</p>
                    </li>
                    <li className="widget-c-text">
                        <p
                            className={classnames('ellipsis-text', {
                                'no-data': noData
                            })}
                        >
                            {noData ? noDataText : text}
                        </p>
                    </li>
                </>
            ) : (
                <>
                    <li className="image">{img && <img src={img} alt="" />}</li>
                    <li className="head">
                        <ModuleTitle
                            title={title}
                            color={color}
                            size={size}
                            cornerRadius="position-radius"
                            titleIcon={titleIcon}
                            {...titleProps}
                        >
                            {!isCompact && headerActions}
                        </ModuleTitle>
                    </li>
                    <li
                        className={classnames('text', {
                            'key-values': showKeyValues
                        })}
                    >
                        <p
                            className={classnames('ellipsis-text', {
                                'no-data': noData
                            })}
                        >
                            {noData ? noDataText : text}
                        </p>
                        {!noData && (showComparisonIcons || comparisonText) && (
                            <>
                                <div className={classnames('comparison-icons-holder', `cs-${comparisonStatus}`)}>
                                    {comparisonText && <div className="comparison-text">{comparisonText}</div>}
                                    {showComparisonIcons && (
                                        <div className="comparison-icons">
                                            <Icon type="bc-icon-comparison-up" />
                                            <Icon type="bc-icon-comparison-down" />
                                        </div>
                                    )}
                                </div>
                                {showKeyValues && (
                                    <div className="widget-timeline-holder">
                                        {keyValues.map(({ label, value, className, ...rest }, index) => (
                                            <KeyValue
                                                key={index}
                                                label={label}
                                                value={value}
                                                className={className}
                                                {...rest}
                                            />
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </li>
                </>
            )}
        </ul>
    );
}

Widget.propTypes = {
    /**
     * Switching to different types of widget's view, can be
     * default, minimal, compact
     */
    type: PropTypes.oneOf(widgetConfig.type),
    /**
     * Setting image to widget
     */
    img: PropTypes.string,
    /**
     * Title for widget
     */
    title: PropTypes.node.isRequired,
    /**
     * Main text for widget
     */
    text: PropTypes.node,
    /**
     * Theme color for widget
     */
    color: PropTypes.string,
    /**
     * Header of widget can have actions, so with this prop can be set actions
     */
    headerActions: PropTypes.node,
    /**
     * Text for No data state
     */
    noDataText: PropTypes.string,
    /**
     * Show/hide No data state
     */
    noData: PropTypes.bool,
    /**
     * Additional className
     */
    className: PropTypes.string,
    /**
     * Show/Hide shadow effect for widget
     */
    withShadow: PropTypes.bool,
    /**
     * Show/Hide bordered effect
     */
    withBorder: PropTypes.bool,
    /**
     * Title can have icon, defining with this prop
     */
    titleIcon: PropTypes.string,
    /**
     * Show/Hide comparison icons
     */
    showComparisonIcons: PropTypes.bool,
    /**
     * Props for title component
     */
    titleProps: PropTypes.object,
    /**
     * Comparison text
     */
    comparisonText: PropTypes.string,
    /**
     * Defining status/state of comparison icon
     * can be one of `'initial','up','down'`
     */
    comparisonStatus: PropTypes.oneOf(widgetConfig.comparisonStatus),
    /**
     * Widget size
     * `small, big, medium`
     */
    size: PropTypes.oneOf(widgetConfig.size),
    /**
     * Widget keyValues is an array of keyValue
     * it will appear when the size is big
     */
    keyValues: PropTypes.arrayOf(PropTypes.shape({ ...KeyValue.propTypes }))
};

Widget.defaultProps = {
    type: widgetConfig.type[0],
    noDataText: 'No Data',
    noData: false,
    titleProps: {},
    withShadow: true,
    withBorder: false,
    showComparisonIcons: false,
    comparisonStatus: widgetConfig.comparisonStatus[0],
    size: widgetConfig.size[1],
    keyValues: []
};

export default Widget;
