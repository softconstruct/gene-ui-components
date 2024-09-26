import React from 'react';
import { mount, ReactWrapper } from 'enzyme';

//Components
import Tooltip from './index';
import GeneUIProvider from '../../providers/GeneUIProvider';

//Types
import { ITooltipProps } from './index';

describe('Tooltip', () => {
    let setup: ReactWrapper<ITooltipProps>;
    const Component = <Tooltip children={<div className="test">Test</div>} />;
    const provider = () =>
        setup.getWrappingComponent().setProps({
            children: Component
        });

    beforeEach(() => {
        setup = mount(Component, {
            wrappingComponent: GeneUIProvider
        });
    });

    afterEach(() => {
        setup.unmount();
    });

    it('renders without crashing', () => {
        expect(setup.exists()).toBeTruthy();
    });
    it.each<ITooltipProps['size']>(['default', 'small'])('renders %p size prop correct inside the portal', (size) => {
        setup.setProps({ size, alwaysShow: true });

        expect(provider().find(`.s-${size}`).exists()).toBeTruthy();
    });

    it('renders text prop correct inside the portal', () => {
        const text = 'test';
        setup.setProps({ text, alwaysShow: true });

        expect(provider().find('.tooltip-text')?.text()).toEqual(text);
    });

    it('renders title prop correct inside the portal', () => {
        const title = 'test';
        setup.setProps({ title, alwaysShow: true });
        expect(provider().find('.tooltip-title').text()).toEqual(title);
    });

    it('renders alwaysShow prop correct inside the portal', () => {
        setup.setProps({ alwaysShow: true });
        expect(provider().find('.tooltip-c-p').exists()).toBeTruthy();
    });

    it('renders position prop correct inside the portal', () => {
        const position = 'right';

        setup.setProps({ alwaysShow: true, position, title: 'test', text: 'test' });
        expect(provider().find(`.${position}`).exists()).toBeTruthy();
    });

    it('handle onMouseEnter', () => {
        setup.find('.test').simulate('mouseEnter');
        expect(provider().find('.tooltip-c-p').exists()).toBeTruthy();
    });
});
