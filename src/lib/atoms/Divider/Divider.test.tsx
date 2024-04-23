import React from 'react';
import { mount, ReactWrapper } from 'enzyme';

// Components
import Divider, { IDividerProps } from './Divider';

describe('divider', () => {
    let setup: ReactWrapper<IDividerProps>;

    beforeEach(() => {
        setup = mount(<Divider type={'horizontal'} withSpace={false} />);
    });

    it('renders without crashing', () => {
        expect(setup.exists()).toBeTruthy();
    });
    it.each<IDividerProps['type']>(['horizontal', 'vertical'])('renders type %p prop correctly', (prop) => {
        const wrapper = setup.setProps({
            type: prop
        });
        expect(wrapper.find(`.type-${prop}`).exists()).toBeTruthy();
    });

    it('renders withSpace prop correctly', () => {
        const wrapper = setup.setProps({
            withSpace: false
        });
        expect(wrapper.find('.divider-withNoSpace').exists()).toBeTruthy();
    });

    it('renders className prop correctly"', () => {
        const className = 'divider-class';
        const wrapper = setup.setProps({
            className
        });
        expect(wrapper.hasClass(`${className}`)).toBeTruthy();
    });

    it.each<IDividerProps['type']>(['horizontal', 'vertical'])('renders styles with %p props', (props) => {
        const size = 25;
        const wrapper = setup.setProps({
            type: props,
            size
        });
        const getWrapper = expect(wrapper.find(`.type-${props}`).get(0).props.style);
        const equalSize = `${size / 10}rem`;

        getWrapper.toHaveProperty(props === 'horizontal' ? 'width' : 'height', equalSize);
    });
});
