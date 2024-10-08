import React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import * as TestsUtils from 'react-dom/test-utils';

//Components
import Tooltip from './index';
import GeneUIProvider from '../../providers/GeneUIProvider';

//Types
import { ITooltipProps } from './index';
import { InfoOutline } from '@geneui/icons';

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

    it('renders text prop correct inside the portal', async () => {
        const text = 'test';
        setup.setProps({ text, alwaysShow: true });

        expect(provider().find('.tooltip__text').text()).toEqual(text);
    });

    it('renders Icon prop correct inside the portal', () => {
        setup.setProps({ alwaysShow: true, Icon: <InfoOutline /> });
        expect(provider().find('.tooltip__icon').exists()).toBeTruthy();
    });

    it('renders alwaysShow prop correct inside the portal', () => {
        setup.setProps({ alwaysShow: true });
        expect(provider().find('.tooltip').exists()).toBeTruthy();
    });

    it('renders appearance prop correct inside the portal', () => {
        const appearance = 'inverse';
        setup.setProps({ alwaysShow: true, appearance });
        expect(provider().find(`.tooltip_color_${appearance}`).exists()).toBeTruthy();
    });

    it('renders withArrow  prop correct inside the portal', async () => {
        setup.setProps({ alwaysShow: true, withArrow: true, text: 'test' });

        expect(provider().find('.tooltip__arrow').exists()).toBeTruthy();
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
