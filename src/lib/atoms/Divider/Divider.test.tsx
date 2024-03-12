import React from 'react';
import { mount, ReactWrapper, shallow, ShallowWrapper } from 'enzyme';

// Components
import Divider, { IDividerProps } from './Divider';

describe('divider component', () => {
    type WrapperType<T> = (prop?: Partial<IDividerProps>, isShallow?: boolean) => T;
    type GetType<T extends keyof IDividerProps> = Pick<IDividerProps, T>[T];
    let setup: WrapperType<ShallowWrapper | ReactWrapper>;
    beforeEach(() => {
        setup = (props, isShallow = false) => {
            return isShallow ? shallow(<Divider {...props} />) : mount(<Divider {...props} />);
        };
    });

    it('checking if a component exists', () => {
        const wrapper = setup();
        expect(wrapper.exists()).toBeTruthy();
    });

    it.each<GetType<'type'>>(['horizontal', 'vertical'])('checking for class acceptance %p', (prop) => {
        const wrapper = setup({
            type: prop
        });
        expect(wrapper.find(`.type-${prop}`).exists()).toBeTruthy();
    });

    it.each<GetType<'type'>>(['horizontal', 'vertical'])('check styles with %p props', (props) => {
        const size = 25;
        const wrapper = setup({
            type: props,
            size
        });
        const getWrapper = expect(wrapper.find(`.type-${props}`).get(0).props.style);
        const equalSize = `${size / 10}rem`;
        if (props === 'horizontal') {
            getWrapper.toHaveProperty('width', equalSize);
        } else {
            getWrapper.toHaveProperty('height', equalSize);
        }
    });

    it('check through negative "withSpace" value in props', () => {
        const wrapper = setup({
            withSpace: false
        });
        expect(wrapper.find('.divider-withNoSpace').exists()).toBeTruthy();
    });

    it('check with prop "className"', () => {
        const className = 'divider-class';
        const wrapper = setup({
            className
        });
        expect(wrapper.find(`.${className}`).exists()).toBeTruthy();
    });
});
