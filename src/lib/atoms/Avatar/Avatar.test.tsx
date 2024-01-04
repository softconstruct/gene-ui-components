import React from 'react';
import { shallow } from 'enzyme';
import Avatar from './index';

describe('Avatar Component', () => {
    it('renders without crashing', () => {
        const wrapper = shallow(<Avatar />);
        expect(wrapper.exists()).toBeTruthy();
    });

    it('renders with an image when src prop is provided', () => {
        const wrapper = shallow(<Avatar src="test-image.jpg" />);
        expect(wrapper.find('.user-avatar-c').prop('style')).toHaveProperty('backgroundImage', 'url(test-image.jpg)');
    });

    it('renders with an icon when icon prop is provided', () => {
        const wrapper = shallow(<Avatar icon="icon-test" />);
        expect(wrapper.find('.user-avatar-c').hasClass('icon-test')).toBeTruthy();
    });

    it('renders with initials when children prop is provided', () => {
        const wrapper = shallow(<Avatar children="John Doe" />);
        expect(wrapper.text()).toBe('JD'); // Assuming getInitials returns 'JD'
    });

    it('calls onClick prop when clicked', () => {
        const onClickMock = jest.fn();
        const wrapper = shallow(<Avatar onClick={onClickMock} />);
        wrapper.simulate('click');
        expect(onClickMock).toHaveBeenCalled();
    });
});
