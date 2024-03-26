import React from 'react';
import { ReactWrapper, mount } from 'enzyme';

// Components
import KeyValue from '.';
import Icon from '../Icon';

// Types
import { IKeyValueProps } from '.';

//config
import { keyValueConfig } from '../../../configs';

describe('KeyValue component', () => {
    let setup: ReactWrapper<IKeyValueProps>;

    beforeEach(() => {
        setup = mount(<KeyValue />);
    });
    it('checking if a component exists', () => {
        expect(setup.exists()).toBeTruthy();
    });
    it.each<IKeyValueProps['appearance']>(['horizontal', 'vertical'])('check with props %p', (appearance) => {
        const wrapper = setup.setProps({ appearance });
        expect(wrapper.props().appearance).toBe(appearance);
        expect(wrapper.find('.geneKeyValue').props().className).toContain(
            keyValueConfig.appearance[appearance].parentItemClassName
        );
    });

    it('with prop "className"', () => {
        const className = 'test1';
        const wrapper = setup.setProps({ className });
        expect(wrapper.hasClass(className)).toBeTruthy();
    });

    it('with prop "icon"', () => {
        const icon = 'test-data';
        const wrapper = setup.setProps({ icon });
        //@ts-ignore
        expect(wrapper.find(Icon).props().type).toBe(icon);
        expect(wrapper.find(Icon).exists()).toBeTruthy();
    });

    it('with prop "value"', () => {
        const value = 'test-data';
        const wrapper = setup.setProps({ value });
        expect(wrapper.contains(value)).toBeTruthy();
    });

    it('with prop "label"', () => {
        const label = 'test-data';
        const wrapper = setup.setProps({ label });
        expect(wrapper.props().label).toBe(label);
        expect(wrapper.contains(label)).toBeTruthy();
    });
    it('without prop "icon"', () => {
        const wrapper = setup;
        expect(wrapper.find(Icon).exists()).toBeFalsy();
    });
});
