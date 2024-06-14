import React from 'react';
import { mount, ReactWrapper } from 'enzyme';

import Tooltip, { ITooltipProps } from './index';

import GeneUIProvider from '../../providers/GeneUIProvider';

describe('Tooltip', () => {
    let setup: ReactWrapper<ITooltipProps>;

    beforeEach(() => {
        setup = mount(<Tooltip children={<div>z</div>} />, { wrappingComponent: GeneUIProvider });
    });

    afterEach(() => {
        setup.unmount();
    });

    test('checking if a component exists', async () => {
        expect(setup.exists()).toBeTruthy();
    });

    test.each<ITooltipProps['size']>(['default', 'small'])('check with props %p', async (size) => {
        setup.setProps({ size, alwaysShow: true });
        expect(document.querySelector(`.s-${size}`)).toBeDefined();
    });
});
