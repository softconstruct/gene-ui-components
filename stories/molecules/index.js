/** Please don't touch to this file manually as file is generates by CLI */
import { storiesOf } from '@storybook/react';

/** Start components imports */
import Tag from './Tag';
import Tabs from './Tabs';
import Card from './Card';
import Grid from './Grid';
import Menu from './Menu';
import Alert from './Alert';
import Modal from './Modal';
import Range from './Range';
import Steps from './Steps';
import Slider from './Slider';
import Status from './Status';
import Widget from './Widget';
import Profile from './Profile';
import Tooltip from './Tooltip';
import Overlay from './Overlay';
import Timeline from './Timeline';
import Checkbox from './Checkbox';
import Collapse from './Collapse';
import Pagination from './Pagination';
import RadioGroup from './RadioGroup';
import ColorPicker from './ColorPicker';
import Notification from './Notification';
import ExtendedInput from './ExtendedInput';
import DatePickerInput from './DatePickerInput';
import ValidatableElements from './ValidatableElements';
import FileUpload from './FileUpload';
import ImageUpload from './ImageUpload';
import * as Chart from './Charts';
import Progress from './Progress';
import MobileNavigation from './MobileNavigation';
import MobilePopup from './MobilePopup';
import Products from './Products';
import Search from './Search';
import Breadcrumb from './Breadcrumb';
import Holder from './Holder';
import Section from './Section';
import TimePicker from './TimePicker';
import NavigationMenu from './NavigationMenu';
import Textarea from './Textarea';
import ComboBox from './ComboBox';
import Counter from './Counter';
/** End components imports */

/** Start stories adding */
storiesOf('Molecules', module)
    .addParameters({
        info: {
            source: false
        }
    })
    .add('Tag', ...Tag)
    .add('Tabs', ...Tabs)
    .add('Grid', ...Grid)
    .add('Progress', ...Progress)
    .add('Alert', ...Alert)
    .add('Steps', ...Steps)
    .add('Modal', ...Modal)
    .add('Widget', ...Widget)
    .add('Status', ...Status)
    .add('Menu', ...Menu)
    .add('Slider', ...Slider)
    .add('Range', ...Range)
    .add('Overlay', ...Overlay)
    .add('Tooltip', ...Tooltip)
    .add('Profile', ...Profile)
    .add('Timeline', ...Timeline)
    .add('Checkbox', ...Checkbox)
    .add('Collapse', ...Collapse)
    .add('Line Chart', Chart.LineChart)
    .add('Pie Chart', Chart.PieChart)
    .add('Map Chart', Chart.MapChart)
    .add('Funnel Chart', Chart.FunnelChart)
    .add('Bar Chart', Chart.BarChart)
    .add('Column Chart', Chart.ColumnChart)
    .add('Area Chart', Chart.AreaChart)
    .add('Donut Chart', Chart.DonutChart)
    .add('Dual axes line and column Chart', Chart.DalColumnChart)
    .add('Stacked Column Chart', Chart.StackedColumnChart)
    .add('Stacked Bar Chart', Chart.StackedBarChart)
    .add('Scatter Chart', Chart.ScatterChart)
    .add('Tree Map Chart', Chart.TreeMapChart)
    .add('HeatMap Chart', Chart.HeatMapChart)
    .add('Column Range Chart', Chart.ColumnRangeChart)
    .add('Date Picker Input', ...DatePickerInput)
    .add('Pagination', ...Pagination)
    .add('RadioGroup', ...RadioGroup)
    .add('Notification', ...Notification)
    .add('Extended Input', ...ExtendedInput)
    .add('Validatable Elements', ...ValidatableElements)
    .add('File Upload', ...FileUpload)
    .add('Image Upload', ...ImageUpload)
    .add('Color Picker', ...ColorPicker)
    .add('MobileNavigation', ...MobileNavigation)
    .add('MobilePopup', ...MobilePopup)
    .add('Products', ...Products)
    .add('Search', ...Search)
    .add('Breadcrumb', ...Breadcrumb)
    .add('Holder', ...Holder)
    .add('Section', ...Section)
    .add('Card', ...Card)
    .add('TimePicker', ...TimePicker)
    .add('NavigationMenu', ...NavigationMenu)
    .add('Textarea', ...Textarea)
    .add('ComboBox', ...ComboBox)
    .add('Counter', ...Counter);
/** End stories adding */
