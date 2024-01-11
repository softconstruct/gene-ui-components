import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import LinkButton, { ILinkButtonProps } from './LinkButton';

describe('LinkButton Component', () => {
    const defaultProps: ILinkButtonProps = {
        onClick: jest.fn(),
        onMouseDown: jest.fn()
    };

    const setup = (props?: ILinkButtonProps): ShallowWrapper => {
        const finalProps = { ...defaultProps, ...props };
        return shallow(<LinkButton {...finalProps} />);
    };

    it('renders without crashing', () => {
        const wrapper = setup();
        expect(wrapper.exists()).toBeTruthy();
    });

    it('renders as a button by default', () => {
        const wrapper = setup();
        expect(wrapper.find('button')).toHaveLength(1);
    });

    it('renders as a link when `href` prop is provided', () => {
        const wrapper = setup({ href: 'https://example.com' });
        expect(wrapper.find('a')).toHaveLength(1);
    });

    it('calls onClick callback when clicked', () => {
        const onClick = jest.fn();
        const wrapper = setup({ onClick });
        wrapper.find('button').simulate('click');
        expect(onClick).toHaveBeenCalled();
    });

    it('calls onMouseDown callback when mouse is down', () => {
        const onMouseDown = jest.fn();
        const wrapper = setup({ onMouseDown });
        wrapper.find('button').simulate('mousedown');
        expect(onMouseDown).toHaveBeenCalled();
    });

    it('renders children inside the button', () => {
        const wrapper = setup({ children: <div className="test-child" /> });
        expect(wrapper.find('button').find('.test-child')).toHaveLength(1);
    });
});
