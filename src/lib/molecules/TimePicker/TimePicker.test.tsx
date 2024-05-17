import React from 'react';
import { ReactWrapper, mount } from 'enzyme';
import TimePicker, { ITimePickerProps } from './TimePicker';
import GeneUIProvider from '../../providers/GeneUIProvider';
import TimePickerPopover from './TimePickerPopover';

describe('TimePicker Component', () => {
    let setup: ReactWrapper<ITimePickerProps>;
    beforeEach(() => {
        setup = mount(<TimePicker />, {
            wrappingComponent: GeneUIProvider
        });
    });

    it('renders without crashing', () => {
        expect(setup.exists()).toBeTruthy();
    });

    it('renders with value prop', () => {
        const value = '10:34:52';

        const wrapper = setup.setProps({ value });
        const timePickerPopover = wrapper.find(TimePickerPopover).last();
        expect(timePickerPopover.exists()).toBeTruthy();

        const getProvider = mount(<GeneUIProvider />);

        expect(getProvider.find('.time-picker-drop-holder').find('.active')).toBeDefined();
    });

    it('renders with onChange prop', () => {
        const onChange = jest.fn();
        const wrapper = setup.setProps({ onChange, appearance: 'singleInput' });
        const event = { target: { value: 'time-picker-single-input' } } as React.ChangeEvent<HTMLInputElement>;
        const singleInput = wrapper.find('.time-picker-single-input').first();
        expect(singleInput.exists()).toBeTruthy();
        const onChangeHandler = singleInput.prop('onChange');
        onChangeHandler && onChangeHandler(event);

        expect(onChange).toHaveBeenCalledWith(event);
    });

    it('renders with showSeconds prop', () => {
        const wrapper = setup.setProps({ appearance: 'singleInput', showSeconds: true });
        const singleInput = wrapper.find('.time-picker-single-input').first();
        singleInput.simulate('click');
        const dropSeconds = wrapper.find('.time-picker-drop-seconds');
        expect(dropSeconds.exists()).toBeTruthy();
    });

    it('renders with appearance prop', () => {
        const wrapper = setup.setProps({ appearance: 'singleInput' });
        const singleInput = wrapper.find('.time-picker-single-input').first();
        expect(singleInput.exists()).toBeTruthy();
    });

    it('renders with hourFormat prop', () => {
        const expectedListCount = 24;
        const wrapper = setup.setProps({ appearance: 'singleInput', hourFormat: 'HH' });
        const singleInput = wrapper.find('.time-picker-single-input').first();
        singleInput.simulate('click');
        const dropHours = wrapper.find('.time-picker-drop-hours li');
        expect(dropHours.exists()).toBeTruthy();
        const actualDropHoursCount = dropHours.length;
        expect(actualDropHoursCount).toEqual(expectedListCount);
    });

    it('renders with minuteFormat prop', () => {
        const expectedListCount = 60;
        const wrapper = setup.setProps({ appearance: 'singleInput', minuteFormat: 'mm' });
        const singleInput = wrapper.find('.time-picker-single-input').first();
        singleInput.simulate('click');
        const dropMinutes = wrapper.find('.time-picker-drop-minutes li');
        expect(dropMinutes.exists()).toBeTruthy();
        const actualDropMinutesCount = dropMinutes.length;
        expect(actualDropMinutesCount).toEqual(expectedListCount);
    });

    it('renders with secondFormat prop', () => {
        const expectedListCount = 60;
        const wrapper = setup.setProps({ appearance: 'singleInput', minuteFormat: 'mm' });
        const singleInput = wrapper.find('.time-picker-single-input').first();
        singleInput.simulate('click');
        const dropSeconds = wrapper.find('.time-picker-drop-seconds li');
        expect(dropSeconds.exists()).toBeTruthy();
        const actualDropSecondsCount = dropSeconds.length;
        expect(actualDropSecondsCount).toEqual(expectedListCount);
    });

    it('renders with separator prop', () => {
        const wrapper = setup.setProps({ appearance: 'singleInput', separator: ':' });
        const singleInput = wrapper.find('.time-picker-single-input').first();
        const singleInputPlaceholder = singleInput.props().placeholder;
        expect(singleInputPlaceholder).toContain(':');
    });

    it('renders with disabled prop', () => {
        const wrapper = setup.setProps({ appearance: 'singleInput', disabled: true });
        const timePickerHolder = wrapper.find('.time-picker-holder');
        const classNames = timePickerHolder.prop('className');
        expect(classNames).toContain('disabled');
    });

    it('renders with readOnly prop', () => {
        const wrapper = setup.setProps({ appearance: 'singleInput', readOnly: true });
        const timePickerHolder = wrapper.find('.time-picker-holder');
        const classNames = timePickerHolder.prop('className');
        expect(classNames).toContain('read-only');
    });

    it('renders with screenType prop', () => {
        const wrapper = setup.setProps({ appearance: 'singleInput', screenType: 'mobile' });
        const timePickerHolder = wrapper.find('.time-picker-holder');
        const classNames = timePickerHolder.prop('className');
        expect(classNames).toContain('mobile');
    });

    it('handles onBlur event', () => {
        const onBlur = jest.fn();
        const wrapper = setup.setProps({ onBlur, appearance: 'singleInput' });
        const e = {
            currentTarget: { value: '12:15:27' }
        } as React.FocusEvent<HTMLInputElement>;
        const singleInput = wrapper.find('.time-picker-single-input').first();
        expect(singleInput.exists()).toBeTruthy();
        const onBlurHandler = singleInput.prop('onBlur');
        onBlurHandler && onBlurHandler(e);

        expect(onBlur).toHaveBeenCalled();
    });
});
