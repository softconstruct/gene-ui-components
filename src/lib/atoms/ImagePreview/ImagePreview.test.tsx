import React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import { enableFetchMocks } from 'jest-fetch-mock';

//Components
import ImagePreview, { IImagePreviewProps } from './index';
import Magnifier from './Magnifier';
import GeneUIProvider from '../../providers/GeneUIProvider';

enableFetchMocks();

const path =
    'https://images.unsplash.com/photo-1599420186946-7b6fb4e297f0?ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2734&q=80';

const propsToTest = [
    { propName: 'showSize', className: '.imagePreview__weight' },
    { propName: 'showDownload', className: '.imagePreview__download' },
    { propName: 'showRotate', className: '.imagePreview__rotate' },
    { propName: 'showDimensions', className: '.imagePreview__resolution' },
    { propName: 'withMagnifier', className: '.imagePreview__magnifier' },
    { propName: 'isMobile', className: '.mobile-view' }
];

describe('ImagePreview ', () => {
    let setup: ReactWrapper<IImagePreviewProps>;
    const onClose = jest.fn();
    global.URL.createObjectURL = jest.fn();

    beforeEach(() => (setup = mount(<ImagePreview path={path} />, { wrappingComponent: GeneUIProvider })));

    it('renders without crashing', () => expect(setup.exists()).toBeTruthy());

    it('renders path prop correctly', () => {
        const wrapper = setup.setProps({ path });
        expect(wrapper.find(Magnifier).exists()).toBeTruthy();
    });

    it('renders name prop correctly', () => {
        const name = 'test name';
        const wrapper = setup.setProps({ name });

        expect(wrapper.contains(name)).toBeTruthy();
    });

    it('renders magnifierDefaultValue prop correctly', () => {
        const wrapper = setup.setProps({ magnifierDefaultValue: true, withMagnifier: true });
        expect(wrapper.find('.imagePreview__switcher').first().props().defaultChecked).toBeTruthy();
    });

    it('handles onClose', () => {
        setup.setProps({ onClose });
        setup.find('.bc-icon-close').simulate('click');

        expect(onClose).toHaveBeenCalled();
    });

    it.each(propsToTest)('renders $propName prop correctly', ({ propName, className }) => {
        const wrapper = setup.setProps({ [propName]: true, path });

        expect(wrapper.find(className).exists()).toBeTruthy();
    });
});
