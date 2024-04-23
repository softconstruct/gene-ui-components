import React from 'react';
import { ReactWrapper, mount } from 'enzyme';

// Components
import KeyValue, { IKeyValueProps } from './index';
import Icon from '../Icon';

describe('KeyValue', () => {
    let setup: ReactWrapper<IKeyValueProps>;

    beforeEach(() => {
        setup = mount(<KeyValue label={'label'} value={'value'} appearance={'horizontal'} />);
    });

    it('renders without crashing', () => {
        expect(setup.exists()).toBeTruthy();
    });

    it.each<IKeyValueProps['appearance']>(['horizontal', 'vertical'])('check with props %p', (appearance) => {
        const wrapper = setup.setProps({ appearance });
        expect(wrapper.props().appearance).toBe(appearance);
        expect(wrapper.find('.geneKeyValue').props().className).toContain(`geneKeyValue--${appearance}`);
    });

    it('renders className prop correctly', () => {
        const className = 'test1';
        const wrapper = setup.setProps({ className });
        expect(wrapper.hasClass(className)).toBeTruthy();
    });

    it('renders icon prop correctly', () => {
        const icon = 'test-data';
        const wrapper = setup.setProps({ icon });
        //@ts-ignore
        expect(wrapper.find(Icon).props().type).toBe(icon);
        expect(wrapper.find(Icon).exists()).toBeTruthy();
    });

    it('renders value prop correctly', () => {
        const value = 'test-data';
        const wrapper = setup.setProps({ value });
        expect(wrapper.contains(value)).toBeTruthy();
    });

    it('renders label prop correctly', () => {
        const label = 'test-data';
        const wrapper = setup.setProps({ label });
        expect(wrapper.contains(label)).toBeTruthy();
    });

    it('renders without prop icon', () => {
        expect(setup.find(Icon).exists()).toBeFalsy();
    });
});
