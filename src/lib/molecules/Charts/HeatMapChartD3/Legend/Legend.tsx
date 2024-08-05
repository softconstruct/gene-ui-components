import React, { CSSProperties, useMemo } from 'react';
import classnames from 'classnames';

import './Legend.scss';
import Icon from '../../../../atoms/Icon';
import { IColorBreakpoint } from '../HeatMapChartD3';

export enum LegendAppearances {
    Vertical = 'vertical',
    Horizontal = 'horizontal'
}

export interface ILegendProps {
    style?: CSSProperties;
    min: number;
    max: number;
    currentNumber?: number;
    colorBreakpoints: IColorBreakpoint[];
    legendThresholds: number;
    legendLayout: LegendAppearances;
    height: string;
}

const round = (numberValue: number, multiplier = 1) => {
    const nextNumber = numberValue * multiplier;
    const [whole] = String(nextNumber).split('.');

    if (whole.length >= 2) {
        return Math.round(Number(nextNumber)) / multiplier;
    }
    const nextMultiplier = multiplier * 10;
    return round(numberValue, nextMultiplier);
};

const ICON_SIZE = 24;

const percent = (value: number, min: number, max: number) => ((value - min) * 100) / (max - min);

const Legend: React.FC<ILegendProps> = ({
    min,
    max,
    currentNumber,
    colorBreakpoints,
    legendThresholds: initialThresholds,
    legendLayout,
    height
}) => {
    const isHorizontal = legendLayout === LegendAppearances.Horizontal;
    const legendThresholds = initialThresholds >= 2 ? initialThresholds : 2;

    const currentPosition = useMemo(
        () => (currentNumber ? percent(currentNumber, min, max) : undefined),
        [currentNumber, min, max]
    );

    const gradient = useMemo(
        () =>
            `linear-gradient(to ${isHorizontal ? 'right' : 'bottom'}, ${colorBreakpoints.reduce(
                (gradient, { value, color }, index) =>
                    `${gradient}${index > 0 ? ', ' : ''}${color} ${percent(value, min, max)}%`,
                ''
            )})`,
        [colorBreakpoints, isHorizontal, min, max]
    );

    const thresholds = useMemo(
        () =>
            Array(legendThresholds)
                .fill(0)
                .reduce(
                    (result, _, index) => [...result, min + index * ((max - min) / (legendThresholds - 1))],
                    [] as number[]
                ),
        [legendThresholds, min, max]
    );

    return (
        <div className={classnames('legend', { 'legend-horizontal': isHorizontal })} style={{ height }}>
            <div
                className={classnames('gradient', { 'gradient-horizontal': isHorizontal })}
                style={{
                    background: gradient
                }}
            />
            <div className={isHorizontal ? 'xAxis' : 'yAxis'}>
                {thresholds.map((threshold, index) => (
                    <span key={`${threshold}${index}`}>{Math.floor(threshold)}</span>
                ))}
            </div>
            <div
                className={classnames('triangle', { 'triangle-horizontal': isHorizontal })}
                style={{ [isHorizontal ? 'left' : 'top']: `calc(${currentPosition}% - ${ICON_SIZE / 2}px)` }}
            >
                <Icon type="bc-icon-arrow-right-nav" disabled={false} isFilled={true} className="" />
            </div>
        </div>
    );
};

export default Legend;
