import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import Copy, { ICopyProps } from './Copy';

describe('Copy Component', () => {
    const defaultProps: ICopyProps = {
        size: 'medium',
        displayOnHover: false,
        copyTooltipText: 'Copy',
        copiedTooltipText: 'Copied!'
    };

    const setup = (props?: ICopyProps): ShallowWrapper => {
        const finalProps = { ...defaultProps, ...props };
        return shallow(<Copy {...finalProps} />);
    };

    const wrapper = setup();
    it('renders without crashing', () => {
        expect(wrapper.exists()).toBeTruthy();
    });

    it('renders the copy icon', () => {
        expect(wrapper.find('.copy__icon').exists()).toBeTruthy();
    });

    it('renders the correct tooltip text', () => {
        expect(wrapper.find('Tooltip').prop('title')).toBe(defaultProps.copyTooltipText);
    });
});
