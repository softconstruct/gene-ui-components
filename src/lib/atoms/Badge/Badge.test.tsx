import React from 'react';
import { shallow, ShallowWrapper, mount } from 'enzyme';
import Badge, { IBadgeProps } from './index';

const shallowComponent = (props?: IBadgeProps): ShallowWrapper => {
    return shallow(<Badge {...props} />);
};

describe('Badge Component', () => {
    it('renders without crashing', () => {
        const wrapper = shallowComponent();
        expect(wrapper.exists()).toBeTruthy();
    });

    it('className passing correct', () => {
        const component = mount(<Badge className={'testName'} />);
        expect(component.props().className).toEqual('testName');
    });

    it('children renders without crashing', () => {
        const children = <span>test</span>;
        const component = shallow(<Badge>{children}</Badge>);
        expect(component.contains(children)).toBeTruthy();
    });

    it('maxCount passing correct', () => {
        const component = mount(<Badge maxCount={33} />);
        expect(component.props().maxCount).toEqual(33);
    });

    it('count passing correct', () => {
        const component = mount(<Badge count={33} />);
        expect(component.props().count).toEqual(33);
    });

    it('dot passing correct', () => {
        const component = mount(<Badge dot />);
        expect(component.props().dot).toEqual(true);
    });

    it('restProps renders without crashing', () => {
        const component = shallow(<Badge data-test="test" />);
        expect(component.find(`[data-test='test']`)).toHaveLength(1);
    });

    it.each(['big', 'medium', 'default', 'huge'])('%s size passing correct', (size) => {
        const key = size as Pick<IBadgeProps, 'size'>['size'];
        const component = mount(<Badge size={key} />);
        expect(component.props().size).toEqual(key);
    });

    it.each(['danger', 'primary'])('%s color passing correct', (color) => {
        const key = color as Pick<IBadgeProps, 'color'>['color'];
        const component = mount(<Badge color={key} />);
        expect(component.props().color).toEqual(key);
    });
});
