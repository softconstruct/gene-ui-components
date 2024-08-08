import React from 'react';
import { ReactWrapper, mount } from 'enzyme';

// Components
import Divider, { IDividerProps } from './index';

describe('Divider ', () => {
    let setup: ReactWrapper<IDividerProps>;
    beforeEach(() => (setup = mount(<Divider />)));
    it('renders without crashing', () => {
        expect(setup.exists()).toBeTruthy();
    });
    it('renders isVertical prop correctly', () => {
        const wrapper = setup.setProps({ isVertical: true });
        expect(wrapper.find('.divider_vertical').exists()).toBeTruthy();
    });
    it('renders label prop correctly', () => {
        const label = 'test';
        const wrapper = setup.setProps({ label });
        expect(wrapper.find('.divider').text()).toBe(label);
    });

    it('renders alignContent prop correctly', () => {
        const alignContent = 'test';
        const wrapper = setup.setProps({ alignContent });
        expect(wrapper.find('.divider__element').text()).toBe(alignContent);
    });

    it.each<IDividerProps['appearance']>(['brand', 'default', 'inverse', 'strong'])(
        'checking a component with a prop appearance : %p',
        (appearance) => {
            const wrapper = setup.setProps({ appearance });
            expect(wrapper.find(`.divider_color_${appearance}`).exists()).toBeTruthy();
        }
    );
    it.each<IDividerProps['alignContentPosition']>([, 'left', 'right'])(
        'checking a component with a prop alignContent : %p',
        (alignContentPosition) => {
            const wrapper = setup.setProps({ alignContentPosition, alignContent: 'test' });
            expect(wrapper.find(`.divider_align_${alignContentPosition}`).exists()).toBeTruthy();
        }
    );
    it.each<IDividerProps['labelPosition']>(['center', 'after', 'before'])(
        'checking a component with a prop alignContent : %p',
        (labelPosition) => {
            const wrapper = setup.setProps({ labelPosition });
            expect(wrapper.find(`.divider_withLabel_${labelPosition}`).exists()).toBeTruthy();
        }
    );
});
