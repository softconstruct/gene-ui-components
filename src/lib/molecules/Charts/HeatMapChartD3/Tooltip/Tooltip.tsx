import React, { useState } from 'react';
import './Tooltip.scss';
import { CONTAINER_PADDING } from '../HeatMapChartD3';

export interface ITooltipProps {
    x: number;
    y: number;
    text: string;
}

const Tooltip: React.FC<ITooltipProps> = ({ x, y, text }) => {
    const [left, setLeft] = useState(0);
    const [top, setTop] = useState(y);

    const onRefBecomeAvailable = (element: HTMLDivElement) => {
        const { width, height } = element?.getBoundingClientRect() ?? {};

        const { right: parentRight = 0 } = element?.parentElement?.getBoundingClientRect() ?? {};

        if (x + width / 2 >= parentRight - CONTAINER_PADDING) {
            setLeft(-1);
        } else if (width) {
            const leftPos = x - width / 2;
            setLeft(leftPos < 0 ? 0 : leftPos);
        }
        if (height) {
            setTop(y - height / 2);
        }
    };

    return (
        <div
            ref={onRefBecomeAvailable}
            className="heatMapTooltip"
            style={{
                left: left === -1 ? undefined : left,
                right: left === -1 ? 0 : undefined,
                top
            }}
        >
            <span style={{ textWrap: 'nowrap' }} dangerouslySetInnerHTML={{ __html: text }} />
        </div>
    );
};

export default Tooltip;
