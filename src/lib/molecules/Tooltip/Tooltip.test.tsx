import React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import * as TestsUtils from 'react-dom/test-utils';

//Components
import Tooltip from './index';
import GeneUIProvider from '../../providers/GeneUIProvider';

//Types
import { ITooltipProps } from './index';

describe('Tooltip', () => {
    let setup: ReactWrapper<ITooltipProps>;
    const Component = <Tooltip children={<div className="test">Test</div>} />;
    const act = typeof React.act === 'function' ? React.act : TestsUtils.act;

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

        expect(provider().find('.tooltip__text').text()).toEqual(text);
    });

    it('renders alwaysShow prop correct inside the portal', () => {
        setup.setProps({ alwaysShow: true });
        expect(provider().find('.tooltip').exists()).toBeTruthy();
    });

    it('renders position prop correct inside the portal', async () => {
        const position = 'top-center';

        setup.setProps({ alwaysShow: true, position, text: 'test' });
        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve));
        });
        expect(provider().find('.tooltip_position_top').exists()).toBeTruthy();
    });
});
