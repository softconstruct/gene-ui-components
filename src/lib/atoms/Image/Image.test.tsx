import React from 'react';
import { ReactWrapper, ShallowWrapper, mount, shallow } from 'enzyme';

// Components
import Image, { IImageProps } from './';
import Tooltip from '../../molecules/Tooltip';
import Empty from '../Empty';
import Checkbox from '../../molecules/Checkbox';

describe('Image component', () => {
    type WrapperType<T> = (prop?: Partial<IImageProps>, isShallow?: boolean) => T;
    let setup: WrapperType<ShallowWrapper | ReactWrapper>;
    beforeEach(() => {
        setup = (props, isShallow = true) => {
            let image = <Image {...props} />;
            return isShallow ? shallow(image) : mount(image);
        };
    });

    it('checking if a component exists', () => {
        const wrapper = setup({}, true);
        expect(wrapper.exists());
    });

    it('checking "ToolTip" inside of component', () => {
        const wrapper = setup({}, true);
        expect(wrapper.find(Tooltip).exists()).toBeTruthy();
    });

    it('checking with prop "className"', () => {
        const className = 'test';
        const wrapper = setup({ className });
        expect(wrapper.find(`.${className}`).exists()).toBeTruthy();
    });

    it('checking with prop "src" and "title"', () => {
        const src = 'test-img';
        const title = 'test-title';
        const wrapper = setup({ src, title });
        expect(wrapper.find(`[src="${src}"]`).exists()).toBeTruthy();

        expect(wrapper.find(`[alt="${title}"]`).exists()).toBeTruthy();
    });

    it('checking with prop "selectMode" and "src" and check rendering component "Checkbox"', () => {
        const wrapper = setup({ selectMode: true, src: 'test-data' });

        expect(wrapper.find('.image-content').exists()).toBeTruthy();
        expect(wrapper.find('.image-label-holder').exists()).toBeTruthy();
        expect(wrapper.find(Checkbox).exists()).toBeTruthy();
    });

    it('checking component  "Checkbox" without prop "src"', () => {
        const wrapper = setup();
        expect(wrapper.find(Checkbox).exists()).toBeFalsy();
    });

    it('checking component "Empty" without prop "src"', () => {
        const wrapper = setup();
        expect(wrapper.find(Empty).exists()).toBeTruthy();
    });

    it('checking component "Empty" with prop "src"', () => {
        const wrapper = setup({ src: 'test-data' });
        expect(wrapper.find(Empty).exists()).toBeFalsy();
    });
});
