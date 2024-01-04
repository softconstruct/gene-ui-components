import './index.scss';

import DatePicker from './DatePicker';
import WeekPicker from './WeekPicker';
import MonthPicker from './MonthPicker';
import RangePicker from './RangePicker';
import Context, { Provider, useDatePickerContext } from './Context';

DatePicker.WeekPicker = WeekPicker;
DatePicker.MonthPicker = MonthPicker;
DatePicker.RangePicker = RangePicker;
DatePicker.Context = Context;
DatePicker.Provider = Provider;
DatePicker.useDatePickerContext = useDatePickerContext;

export default DatePicker;
