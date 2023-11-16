/** Please don't touch to this file manually as file is generates by CLI */
import { storiesOf } from '@storybook/react';

/** Start components imports */
import AreaChart from './AreaChart.stories';
import BarChart from './BarChart.stories';
import ColumnChart from './ColumnChart.stories';
import ColumnRange from './ColumnRange.stories';
import DalColumnChart from './DalColumnChart.stories';
import DonutChart from './DonutChart.stories';
import FunnelChart from './FunnelChart.stories';
import HeatMapChart from './HeatMapChart.stories';
import LineChart from './LineChart.stories';
import MapChart from './MapChart.stories';
import PieChart from './PieChart.stories';
import ScatterChart from './ScatterChart.stories';
import StackedBarChart from './StackedBarChart.stories';
import StackedColumnChart from './StackedColumnChart.stories';
import TreeMapChart from './TreeMapChart.stories';
/** End components imports */

/** Start stories adding */
storiesOf('Charts', module)
    .addParameters({
        info: {
            source: false
        }
    })
    .add('AreaChart', ...AreaChart)
    .add('BarChart', ...BarChart)
    .add('ColumnChart', ...ColumnChart)
    .add('ColumnRange', ...ColumnRange)
    .add('DalColumnChart', ...DalColumnChart)
    .add('DonutChart', ...DonutChart)
    .add('FunnelChart', ...FunnelChart)
    .add('HeatMapChart', ...HeatMapChart)
    .add('LineChart', ...LineChart)
    .add('MapChart', ...MapChart)
    .add('PieChart', ...PieChart)
    .add('ScatterChart', ...ScatterChart)
    .add('StackedColumnChart', ...StackedColumnChart)
    .add('StackedBarChart', ...StackedBarChart)
    .add('TreeMapChart', ...TreeMapChart);
/** End stories adding */
