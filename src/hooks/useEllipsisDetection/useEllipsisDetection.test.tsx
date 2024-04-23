import React, { RefObject } from 'react';
import { mount } from 'enzyme';
import useEllipsisDetection from './useEllipsisDetection';

describe('useEllipsisDetection', () => {
    it('should return false if text is not truncated', () => {
        const ref = {
            current: { scrollWidth: 100, clientWidth: 200, scrollHeight: 50, clientHeight: 100 }
        } as RefObject<HTMLElement>;

        const Component = () => {
            const isTruncated = useEllipsisDetection(ref);
            return <div>{isTruncated ? 'Truncated' : 'Not Truncated'}</div>;
        };

        const wrapper = mount(<Component />);
        expect(wrapper.text()).toBe('Not Truncated');
    });

    it('should return true if text is truncated', () => {
        const ref = {
            current: { scrollWidth: 300, clientWidth: 200, scrollHeight: 150, clientHeight: 100 }
        } as RefObject<HTMLElement>;

        const Component = () => {
            const isTruncated = useEllipsisDetection(ref);
            return <div>{isTruncated ? 'Truncated' : 'Not Truncated'}</div>;
        };

        const wrapper = mount(<Component />);
        expect(wrapper.text()).toBe('Truncated');
    });

    // TODO: need to add resize test case
});
