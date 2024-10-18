import React, { FC, useState } from 'react';
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

    it('should use the controlledValue', () => {
        const controlledValue = 'controlledValue';
        const Component: FC = () => {
            const [state] = useControlledState(controlledValue, 'default');
            return <div>{state}</div>;
        };

        const wrapper = mount(<Component />);
        expect(wrapper.text()).toBe(controlledValue);
    });

    it('should correctly update default value when the controlledValue is undefined', () => {
        const defaultValue = 'default';
        const controlledValue = 'controlledValue';

        const Component: FC = () => {
            const [state, setState] = useControlledState(undefined, defaultValue);
            return (
                <div id="button" onClick={() => setState(controlledValue)}>
                    {state}
                </div>
            );
        };

        const wrapper = mount(<Component />);
        expect(wrapper.text()).toBe(defaultValue);
        wrapper.find('#button').simulate('click');
        expect(wrapper.text()).toBe(controlledValue);
    });

    it('should not update controlledValue by setState when the controlledValue is not undefined', () => {
        const defaultValue = 'default';
        const controlledValue = 'controlledValue';
        const newControlledValue = 'newControlledValue';

        const Component: FC = () => {
            const [state, setState] = useControlledState(controlledValue, defaultValue);
            return (
                <div id="button" onClick={() => setState(newControlledValue)}>
                    {state}
                </div>
            );
        };

        const wrapper = mount(<Component />);
        expect(wrapper.text()).toBe(controlledValue);
        wrapper.find('#button').simulate('click');
        expect(wrapper.text()).toBe(controlledValue);
    });

    it('should sync state and controlledValue', () => {
        const defaultValue = 'default';
        const controlledValue = 'controlledValue';
        const newControlledValue = 'newControlledValue';

        const Component: FC = () => {
            const [controlledValueState, setControlledValue] = useState(controlledValue);
            const [state] = useControlledState(controlledValueState, defaultValue);
            return (
                <div id="button" onClick={() => setControlledValue(newControlledValue)}>
                    {state}
                </div>
            );
        };

        const wrapper = mount(<Component />);
        expect(wrapper.text()).toBe(controlledValue);
        wrapper.find('#button').simulate('click');
        expect(wrapper.text()).toBe(newControlledValue);
    });
});
