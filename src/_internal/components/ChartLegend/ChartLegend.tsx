import React, { FC, useEffect, useLayoutEffect, useRef, useState } from "react";
import classNames from "classnames";

// Components
import Text from "@components/atoms/Text";

// Styles
import "./ChartLegend.scss";

interface IChartLegendItem {
    /**
     * Series / channel label.
     */
    name: string;
    /**
     * Swatch color. Accepts any valid CSS color (including `var(--guit-...)`).
     */
    color: string;
    /**
     * Whether the related series is currently visible on the chart.
     * @default true
     */
    visible?: boolean;
}

interface IChartLegendProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    /**
     * Legend entries to render.
     */
    items: IChartLegendItem[];
    /**
     * Called when a legend item is clicked (typically to toggle series visibility).
     */
    onItemClick?: (item: IChartLegendItem, index: number) => void;
    /**
     * Called when the "Show more"/"Show less" state changes. Lets the parent react to the legend
     * growing taller (e.g. keep the chart from shrinking).
     */
    onExpandedChange?: (expanded: boolean) => void;
}

const renderLegendItem = (item: IChartLegendItem, index: number, onItemClick: IChartLegendProps["onItemClick"]) => {
    const { name, color, visible = true } = item;
    const isInteractive = Boolean(onItemClick);

    return (
        <li key={`${name}-${color}`} className="chartLegend__item">
            <button
                type="button"
                className={classNames("chartLegend__button", {
                    chartLegend__button_hidden: !visible,
                    chartLegend__button_interactive: isInteractive
                })}
                disabled={!isInteractive}
                aria-pressed={visible}
                onClick={() => onItemClick?.(item, index)}
            >
                <span
                    className="chartLegend__swatch"
                    style={{ backgroundColor: color, borderColor: color }}
                    aria-hidden
                />
                <Text as="span" variant="captionLargeMedium" className="chartLegend__label">
                    {name}
                </Text>
            </button>
        </li>
    );
};

/**
 * Horizontal chart legend with color swatches. Item order and alignment follow the nearest `dir` context.
 * When `onItemClick` is provided, items act as toggles for series visibility.
 *
 * The list wraps with flexbox; while collapsed it is clipped to a single row (`overflow: hidden`) and any
 * items that wrapped onto a second row are hidden behind a "Show N more" toggle. Expanding removes the clip.
 */
const ChartLegend: FC<IChartLegendProps> = ({ className, items, onItemClick, onExpandedChange }) => {
    const listRef = useRef<HTMLUListElement>(null);
    const [expanded, setExpanded] = useState(false);
    const [hiddenCount, setHiddenCount] = useState(0);
    const [rowHeight, setRowHeight] = useState<number>();

    // Detect overflow purely from layout: items that wrapped onto a later row sit lower than the first.
    const measure = () => {
        const list = listRef.current;
        const children = list ? (Array.from(list.children) as HTMLElement[]) : [];

        if (!children.length) {
            setHiddenCount(0);
            return;
        }

        const firstRowTop = children[0].offsetTop;
        const wrapped = children.reduce((count, child) => (child.offsetTop > firstRowTop ? count + 1 : count), 0);

        setRowHeight(children[0].offsetHeight);
        setHiddenCount(wrapped);
    };

    const measureRef = useRef(measure);
    measureRef.current = measure;

    useLayoutEffect(() => {
        measureRef.current();
    });

    useLayoutEffect(() => {
        const list = listRef.current;

        if (!list || typeof ResizeObserver === "undefined") {
            return undefined;
        }

        const observer = new ResizeObserver(() => measureRef.current());
        observer.observe(list);

        return () => observer.disconnect();
    }, []);

    const toggleExpanded = () => {
        setExpanded((previous) => {
            const next = !previous;
            onExpandedChange?.(next);
            return next;
        });
    };

    const isOverflowing = hiddenCount > 0;
    const isExpanded = expanded && isOverflowing;

    // Collapse automatically when everything fits again (e.g. the container grew wider).
    useEffect(() => {
        if (expanded && !isOverflowing) {
            setExpanded(false);
            onExpandedChange?.(false);
        }
    }, [expanded, isOverflowing, onExpandedChange]);

    if (!items?.length) {
        return null;
    }

    return (
        <div className={classNames("chartLegend", className)}>
            <ul
                ref={listRef}
                className={classNames("chartLegend__list", {
                    chartLegend__list_expanded: isExpanded
                })}
                style={isOverflowing && !isExpanded ? { maxHeight: rowHeight } : undefined}
            >
                {items.map((item, index) => renderLegendItem(item, index, onItemClick))}
            </ul>
            {isOverflowing && (
                <button
                    type="button"
                    className="chartLegend__toggle"
                    aria-expanded={isExpanded}
                    onClick={toggleExpanded}
                >
                    <Text as="span" variant="bodyMediumSemibold" className="chartLegend__toggleLabel">
                        {isExpanded ? "Show less" : `Show ${hiddenCount} more`}
                    </Text>
                </button>
            )}
        </div>
    );
};

export { IChartLegendProps, IChartLegendItem, ChartLegend as default };
