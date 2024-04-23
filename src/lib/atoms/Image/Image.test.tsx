import React from 'react';
import { ReactWrapper, mount } from 'enzyme';

// Components
import Image from './';
import Tooltip from '../../molecules/Tooltip';
import Empty from '../Empty';
import Checkbox from '../../molecules/Checkbox';

// Types
import { IImageProps } from '.';
import GeneUIProvider from '../../providers/GeneUIProvider';

describe('Image', () => {
    let setup: ReactWrapper<IImageProps>;

    beforeEach(() => {
        setup = mount(
            <Image src={'https://picsum.photos/1920/1080'} withBorder={false} selectMode={false} isValid={false} />,
            {
                wrappingComponent: GeneUIProvider
            }
        );
    });

    it('renders without crashing', () => {
        expect(setup.exists()).toBeTruthy();
    });

    // TODO: All cases should be uncommented after this PR merge https://github.com/softconstruct/gene-ui-components/pull/93

    // it('renders className prop correctly', () => {
    //     const className = 'test';
    //     setup.setProps({ isValid: true });
    //     const wrapper = setup.setProps && setup.setProps({ isValid: true });
    //     expect(wrapper.find('.test').exists()).toBeTruthy();
    //     expect(setup.exists()).toBeTruthy();
    // });

    // it('renders src prop correctly', () => {
    //     const src = 'test-img';
    //     const wrapper = setup.setProps({ src });
    //     expect(wrapper.find(`[src="${src}"]`).exists()).toBeTruthy();
    // });

    // it('checking with prop "selectMode" and "src" and check rendering component "Checkbox"', () => {
    //     const wrapper = setup.setProps({ selectMode: true, src: 'test-data' });

    //     expect(wrapper.find('.image-content').exists()).toBeTruthy();
    //     expect(wrapper.find('.image-label-holder').exists()).toBeTruthy();
    //     expect(wrapper.find(Checkbox).exists()).toBeTruthy();
    // });

    // it('checking component  "Checkbox" without prop "src"', () => {
    //     expect(setup.find(Checkbox).exists()).toBeFalsy();
    // });

    // it('checking component "Empty" without prop "src"', () => {
    //     const wrapper = setup.setProps({ src: '' });

    //     expect(wrapper.find(Empty).exists()).toBeTruthy();
    // });

    // it('checking ToolTip inside of component', () => {
    //     expect(setup.find(Tooltip).exists()).toBeTruthy();
    // });

    // it('checking component "Empty" with prop "src"', () => {
    //     const wrapper = setup.setProps({ src: 'test-data' });
    //     expect(wrapper.find(Empty).exists()).toBeFalsy();
    // });
});
