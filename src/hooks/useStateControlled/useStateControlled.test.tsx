import React, { FC } from 'react';
import { mount } from 'enzyme';
import useControlledState from './useStateControlled';

describe('useControlledState', () => {
    it('should use the default value when the controlledValue is undefined', () => {
        const Component: FC = () => {
            const [state] = useControlledState(undefined, 'default');
            return <div>{state}</div>;
        };

        const wrapper = mount(<Component />);
        expect(wrapper.text()).toBe('default');
    });
});
