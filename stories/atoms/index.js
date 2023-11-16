/** Please don't touch to this file manually as file is generates by CLI */
import { storiesOf } from '@storybook/react';

/** Start components imports */
import Switcher from './Switcher';
import Button from './Button';
import TextLink from './TextLink';
import Label from './Label';
import Icon from './Icon';
import Divider from './Divider';
import Radio from './Radio';
import Paper from './Paper';
import Avatar from './Avatar';
import Time from './Time';
import Badge from './Badge';
import BusyLoader from './BusyLoader';
import SkeletonLoader from './Skeleton';
import Scrollbar from './Scrollbar';
import ModuleTitle from './ModuleTitle';
import Empty from './Empty';
import Popover from './Popover';
import Title from './Title';
import Image from './Image';
import KeyValue from './KeyValue';
import Option from './Option';
import ImagePreview from './ImagePreview';
import QRCode from './QRCode';
/** End components imports */

/** Start stories adding */
storiesOf('Atoms', module)
    .addParameters({
        info: {
            source: false
        }
    })
    .add('Switcher', ...Switcher)
    .add('Button', ...Button)
    .add('Text Link', ...TextLink)
    .add('Label', ...Label)
    .add('Paper', ...Paper)
    .add('Divider', ...Divider)
    .add('Radio', ...Radio)
    .add('Icon', ...Icon)
    .add('Avatar', ...Avatar)
    .add('Badge', ...Badge)
    .add('BusyLoader', ...BusyLoader)
    .add('Skeleton Loader', ...SkeletonLoader)
    .add('Scrollbar', ...Scrollbar)
    .add('ModuleTitle', ...ModuleTitle)
    .add('Time', ...Time)
    .add('Empty', ...Empty)
    .add('Popover', ...Popover)
    .add('Title', ...Title)
    .add('Image', ...Image)
    .add('KeyValue', ...KeyValue)
    .add('Option', ...Option)
    .add('ImagePreview', ...ImagePreview)
    .add('QRCode', ...QRCode);
/** End stories adding */
