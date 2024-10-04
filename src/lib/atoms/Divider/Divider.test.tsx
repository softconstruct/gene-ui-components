import React from 'react';
import { ReactWrapper, mount } from 'enzyme';
import { CheckMark } from '@geneui/icons';

// Components
import Divider, { IDividerProps } from './index';
import Button from '../Button/Button';

describe('Divider ', () => {
    let setup: ReactWrapper<IDividerProps>;
    beforeEach(() => (setup = mount(<Divider />)));
    it('renders without crashing', () => {
        expect(setup.exists()).toBeTruthy();
    });
    it('renders isVertical prop correctly', () => {
        const wrapper = setup.setProps({ isVertical: true });
        expect(wrapper.find('.divider').hasClass('divider_vertical')).toBeTruthy();
    });

    it('renders Icon prop correctly', () => {
        const wrapper = setup.setProps({ Icon: <CheckMark /> });
        expect(wrapper.find(CheckMark).exists()).toBeTruthy();
    });

    it('renders label prop correctly', () => {
        const label = 'test';
        const wrapper = setup.setProps({ label });
        expect(wrapper.find('.divider').text()).toBe(label);
    });

    it('renders alignContent prop correctly', () => {
        //@ts-ignore
        const alignContent = <Button>Test</Button>;
        const wrapper = setup.setProps({ alignContent });
        expect(wrapper.find(Button).text()).toBe('Test');
    });

    it('renders inset  prop correctly', () => {
        const wrapper = setup.setProps({ inset: true });
        expect(wrapper.find('.divider').hasClass(`divider_inset`)).toBeTruthy();
    });

    it.each<IDividerProps['appearance']>(['brand', 'default', 'inverse', 'strong'])(
        'checking a component with a prop appearance : %p',
        (appearance) => {
            const wrapper = setup.setProps({ appearance });
            expect(wrapper.find('.divider').hasClass(`divider_color_${appearance}`)).toBeTruthy();
        }
    );

    it.each<IDividerProps['alignContentPosition']>([, 'left', 'right'])(
        'checking a component with a prop alignContent : %p',
        (alignContentPosition) => {
            //@ts-ignore
            const wrapper = setup.setProps({ alignContentPosition, alignContent: <Button>Test</Button> });
            expect(wrapper.find('.divider').hasClass(`divider_align_${alignContentPosition}`)).toBeTruthy();
        }
    );
    it.each<IDividerProps['labelPosition']>(['center', 'after', 'before'])(
        'checking a component with a prop alignContent : %p',
        (labelPosition) => {
            const wrapper = setup.setProps({ labelPosition });
            expect(wrapper.find('.divider').hasClass(`divider_withLabel_${labelPosition}`)).toBeTruthy();
        }
    );
});
