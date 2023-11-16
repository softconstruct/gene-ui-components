/** Please don't touch to this file manually as file is generates by CLI */
import { storiesOf } from '@storybook/react';

/** Start components imports */
import CheckboxGroup from './CheckboxGroup';
import Toaster from './Toaster';
import Form from './Form';
import DatePicker from './DatePicker';
import DateFilter from './DateFilter';
import Editor from './Editor';
import Dropdown from './Dropdown';
import SearchWithDropdown from './SearchWithDropdown';
import CheckboxGroupWithSearch from './CheckboxGroupWithSearch';
import Table from './Table';
import CardList from './CardList';
import Overspread from './Overspread';
import TransferList from './TransferList';
import RichEditor from './RichEditor';
import Drawer from './Drawer';
import ActionableList from './ActionableList';
/** End components imports */

/** Start stories adding */
storiesOf('Organisms', module)
    .addParameters({
        info: {
            source: false
        }
    })
    .add('Dropdown', ...Dropdown)
    .add('Form', ...Form)
    .add('DatePicker', ...DatePicker)
    .add('DateFilter', ...DateFilter)
    .add('Editor', ...Editor)
    .add('CheckboxGroup', ...CheckboxGroup)
    .add('CheckboxGroupWithSearch', ...CheckboxGroupWithSearch)
    .add('Toaster', ...Toaster)
    .add('Table', ...Table)
    .add('Search with Dropdown', ...SearchWithDropdown)
    .add('Overspread (Mobile)', ...Overspread)
    .add('CardList (Mobile)', ...CardList)
    .add('Transfer List', ...TransferList)
    .add('Rich Editor', ...RichEditor)
    .add('Drawer', ...Drawer)
    .add('ActionableList experimental', ...ActionableList);
/** End stories adding */
