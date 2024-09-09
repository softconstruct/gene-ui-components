import React from 'react';
import { mount, ReactWrapper } from 'enzyme';

//Components
import Tooltip from './index';
import GeneUIProvider from '../../providers/GeneUIProvider';

//Types
import { ITooltipProps } from './index';

describe('Tooltip', () => {
    let setup: ReactWrapper<ITooltipProps>;

    beforeEach(() => {
        setup = mount(<Tooltip children={<div className="test">Test</div>} />, {
            wrappingComponent: GeneUIProvider,
            attachTo: document.body
        });
    });

    afterEach(() => {
        setup.unmount();
    });

    it('renders without crashing', () => {
        expect(setup.exists()).toBeTruthy();
    });

    it.each<ITooltipProps['size']>(['default', 'small'])('renders %p size prop correct', (size) => {
        setup.setProps({ size, alwaysShow: true });
        expect(document.querySelector(`.s-${size}`)).toBeTruthy();
    });

    it('renders text prop correct', () => {
        const text = 'test';
        setup.setProps({ text, alwaysShow: true });
        expect(document.querySelector('.tooltip-text')?.innerHTML).toEqual(text);
    });

    it('renders title prop correct', () => {
        const title = 'test';
        setup.setProps({ title, alwaysShow: true });
        expect(document.querySelector('.tooltip-title')?.innerHTML).toEqual(title);
    });

    it('renders alwaysShow prop correct', () => {
        setup.setProps({ alwaysShow: true });
        expect(document.querySelector('.tooltip-c-p')).toBeTruthy();
    });

    it('renders position prop correct', () => {
        const position = 'right';

        setup.setProps({ alwaysShow: true, position, title: 'test', text: 'test' });
        expect(document.querySelector(`.${position}`)).toBeTruthy();
    });

    it('handle onClick', () => {
        const jestFn = jest.fn();
        const wrapper = setup.setProps({ onClick: jestFn });
        wrapper.find('.test').simulate('click');
        expect(jestFn).toHaveBeenCalled();
    });

    it('handle onMouseEnter', () => {
        setup.find('.test').simulate('mouseEnter');
        expect(document.querySelector('.tooltip-c-p')).toBeTruthy();
    });
});
