import React from 'react';
import { ReactWrapper, mount } from 'enzyme';
import { CheckMark } from '@geneui/icons';

// Components
import Divider, { IDividerProps } from './index';
import { Avatar } from '../../../index';

describe('Divider ', () => {
    let setup: ReactWrapper<IDividerProps>;
    beforeEach(() => (setup = mount(<Divider />)));

    it('renders without crashing', () => {
        expect(setup.exists()).toBeTruthy();
    });

    it('renders vertical prop correctly', () => {
        const wrapper = setup.setProps({ vertical: true });
        expect(wrapper.find('.divider').hasClass('divider_vertical')).toBeTruthy();
    });

    it('renders Icon prop correctly', () => {
        const wrapper = setup.setProps({ Icon: CheckMark });
        expect(wrapper.find(CheckMark).exists()).toBeTruthy();
    });

    it('renders label prop correctly', () => {
        const label = 'test';
        const wrapper = setup.setProps({ label });
        expect(wrapper.find('.divider').text()).toBe(label);
    });

    it('renders content prop correctly', () => {
        const content = <Avatar />;
        const wrapper = setup.setProps({ content });
        expect(wrapper.find(Avatar)).toBeTruthy();
    });

    it('renders inset prop correctly', () => {
        const wrapper = setup.setProps({ inset: true });
        expect(wrapper.find('.divider').hasClass(`divider_inset`)).toBeTruthy();
    });

    it.each<IDividerProps['appearance']>(['brand', 'default', 'inverse', 'strong'])(
        'should have %s appearance',
        (appearance) => {
            const wrapper = setup.setProps({ appearance });
            expect(wrapper.find('.divider').hasClass(`divider_color_${appearance}`)).toBeTruthy();
        }
    );

    it.each<IDividerProps['labelPosition']>(['center', 'after', 'before'])(
        'should have %s labelPosition',
        (labelPosition) => {
            const wrapper = setup.setProps({ labelPosition, label: 'test' });
            expect(wrapper.find('.divider').hasClass(`divider_withLabel_${labelPosition}`)).toBeTruthy();
        }
    );

    it('renders className prop correctly', () => {
        const className = 'test-class';
        const wrapper = setup.setProps({ className });

        expect(wrapper.hasClass(className)).toBeTruthy();
    });
});
