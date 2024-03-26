import React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import ImagePreview, { IImagePreviewProps } from './ImagePreview';
import GeneUIProvider from '../../providers/GeneUIProvider';

import { enableFetchMocks } from 'jest-fetch-mock';
enableFetchMocks();

const path =
    'https://images.unsplash.com/photo-1599420186946-7b6fb4e297f0?ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2734&q=80';

const propsToTest = [
    { propName: 'showSize', propValue: true },
    { propName: 'showDownload', propValue: true },
    { propName: 'showRotate', propValue: true },
    { propName: 'showDimensions', propValue: true },
    { propName: 'withMagnifier', propValue: true },
    { propName: 'withModal', propValue: true },
    { propName: 'magnifierDefaultValue', propValue: true },
    { propName: 'isMobile', propValue: true }
];

describe('ImagePreview component', () => {
    let setup: ReactWrapper<IImagePreviewProps>;
    global.URL.createObjectURL = jest.fn();

    beforeEach(() => {
        setup = mount(<ImagePreview path={path} />, { wrappingComponent: GeneUIProvider });
    });

    it('exists', () => {
        expect(setup.exists()).toBeTruthy();
    });

    it('path prop renders correct', () => {
        expect(setup.props().path).toBe(path);
    });

    it('name prop renders correct', () => {
        const name = 'testName';
        const wrapper = setup.setProps({ name });
        expect(wrapper.props().name).toBe(name);
        expect(wrapper.contains(name)).toBeTruthy();
    });

    propsToTest.forEach(({ propName, propValue }) => {
        it(`${propName} prop renders correct`, () => {
            const wrapper = setup.setProps({ [propName]: propValue, path: path });
            expect(wrapper.props()[propName]).toBe(propValue);
        });
    });
});
