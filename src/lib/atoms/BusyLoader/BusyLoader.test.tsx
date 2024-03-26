import React from 'react';
import { shallow, mount, render, ShallowWrapper } from 'enzyme';

// Components
import { Icon } from '../../../index';
import BubbleLoader from './BubbleLoader';
import BusyLoader from './index';

//Types
import { IBusyLoaderProps } from './index';

const shallowComponent = (props?: IBusyLoaderProps): ShallowWrapper => shallow(<BusyLoader {...props} />);

const renderComponent = (props?: IBusyLoaderProps) => render(<BusyLoader {...props} />);

const mountComponent = (props?: IBusyLoaderProps) => mount(<BusyLoader {...props} />);

describe('BusyLoader Component', () => {
    it('renders without crashing', () => {
        const wrapper = shallowComponent(<BusyLoader />);
        expect(wrapper.exists()).toBeTruthy();
    });

    it('className passing correct', () => {
        const component = renderComponent({ className: 'testName' });
        expect(component.hasClass('testName')).toBeTruthy();
    });

    it('children renders without crashing', () => {
        const children = <span>test</span>;
        const component = shallowComponent({ children, isBusy: false });
        expect(component.contains(children)).toBeTruthy();
    });

    it('isBusy passing correct', () => {
        const render = renderComponent({ isBusy: true });
        expect(render.hasClass('loader-holder')).toBeTruthy();
    });

    it('loadingText passing correct', () => {
        const mount = mountComponent({ loadingText: 'loadingText' });
        const shallow = shallowComponent({ loadingText: 'loadingText' });
        expect(mount.props().loadingText).toEqual('loadingText');
        expect(shallow.contains('loadingText')).toBeTruthy();
    });

    it.each(['spinner', 'bubbles', 'bar'])('%s type passing correct', (type) => {
        const key = type as Pick<IBusyLoaderProps, 'type'>['type'];
        const mount = mountComponent({ type: key });
        const render = renderComponent({ type: key });
        const shallow = shallowComponent({ type: key });

        expect(mount.props().type).toEqual(key);

        if (key === 'bar') {
            expect(render.hasClass('bar-loader')).toBeTruthy();
        } else if (key === 'spinner') {
            expect(shallow.find(Icon).exists()).toBeTruthy();
        } else if (key === 'bubbles') {
            expect(shallow.find(BubbleLoader).exists()).toBeTruthy();
        }
    });

    it.each(['small', 'medium', 'big'])('%s spinnerSize passing correct', (spinnerSize) => {
        const key = spinnerSize as Pick<IBusyLoaderProps, 'spinnerSize'>['spinnerSize'];
        const mount = mountComponent({ spinnerSize: key });

        expect(mount.props().spinnerSize).toEqual(key);
        expect(mount.find(`.s-${key}`).exists()).toBeTruthy();
    });
});
