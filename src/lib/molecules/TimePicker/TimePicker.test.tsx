import React from 'react';
import { ReactWrapper, mount } from 'enzyme';

//Components
import TimePicker, { ITimePickerProps } from './';
import { ExtendedInput } from '../../../index';
import TimePickerPopover from './TimePickerPopover';
import GeneUIProvider from '../../providers/GeneUIProvider';

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

    it('renders with appearance prop', () => {
        const wrapper = setup.setProps({ appearance: 'singleInput' });
        const singleInput = wrapper.find('.time-picker-single-input').first();
        expect(singleInput.exists()).toBeTruthy();
    });

    it('renders with value prop', () => {
        const value = '10:34:52';
        const appearance = 'singleInput';
        const wrapper = setup.setProps({ value, appearance });
        wrapper.update();
        const timePickerInputValue = wrapper.find(ExtendedInput).get(0).props.value;
        expect(timePickerInputValue).toEqual(value);
    });

    it('renders with onChange prop', () => {
        const onChange = jest.fn();
        const value = '10:34:52';
        const wrapper = setup.setProps({ onChange, appearance: 'singleInput', value });
        const event = { currentTarget: { value: 'time-picker-single-input' } } as React.ChangeEvent<HTMLInputElement>;
        wrapper.find(ExtendedInput).get(0).props.onBlur(event);
        expect(onChange).toHaveBeenCalled();
    });

    it('renders with showSeconds prop', () => {
        const wrapper = setup.setProps({ appearance: 'singleInput', showSeconds: true });
        const singleInput = wrapper.find(ExtendedInput);
        singleInput.simulate('click');
        expect(wrapper.find('.time-picker-drop-seconds').exists()).toBeTruthy();
    });

    it('renders with hourFormat prop', () => {
        const expectedListCount = 24;
        const wrapper = setup.setProps({ appearance: 'singleInput', hourFormat: 'HH' });
        const singleInput = wrapper.find(ExtendedInput);
        singleInput.simulate('click');
        const dropHours = wrapper.find('.time-picker-drop-hours li');
        expect(dropHours.exists()).toBeTruthy();
        const actualDropHoursCount = dropHours.length;
        expect(actualDropHoursCount).toEqual(expectedListCount);
    });

    it('renders with minuteFormat prop', () => {
        const expectedListCount = 60;
        const wrapper = setup.setProps({ appearance: 'singleInput', minuteFormat: 'mm' });
        const singleInput = wrapper.find(ExtendedInput);
        singleInput.simulate('click');
        const dropMinutes = wrapper.find('.time-picker-drop-minutes li');
        expect(dropMinutes.exists()).toBeTruthy();
        const actualDropMinutesCount = dropMinutes.length;
        expect(actualDropMinutesCount).toEqual(expectedListCount);
    });

    it('renders with secondFormat prop', () => {
        const expectedListCount = 60;
        const wrapper = setup.setProps({ appearance: 'singleInput', minuteFormat: 'mm' });
        const singleInput = wrapper.find(ExtendedInput);
        singleInput.simulate('click');
        const dropSeconds = wrapper.find('.time-picker-drop-seconds li');
        expect(dropSeconds.exists()).toBeTruthy();
        const actualDropSecondsCount = dropSeconds.length;
        expect(actualDropSecondsCount).toEqual(expectedListCount);
    });

    it('renders with separator prop', () => {
        const wrapper = setup.setProps({ appearance: 'singleInput', separator: ':' });
        const singleInput = wrapper.find(ExtendedInput);
        const singleInputPlaceholder = singleInput.get(0).props.placeholder;
        expect(singleInputPlaceholder).toContain(':');
    });

    it('renders with disabled prop', () => {
        const wrapper = setup.setProps({ appearance: 'singleInput', disabled: true });
        expect(wrapper.find('.time-picker-holder').hasClass('disabled')).toBeTruthy();
    });

    it('renders with readOnly prop', () => {
        const wrapper = setup.setProps({ appearance: 'singleInput', readOnly: true });
        expect(wrapper.find('.time-picker-holder').hasClass('read-only')).toBeTruthy();
    });

    it('renders with className prop', () => {
        const className = 'test-class';
        const wrapper = setup.setProps({ className });
        expect(wrapper.find('.time-picker-holder').hasClass(className)).toBeTruthy();
    });

    it('renders with screenType prop', () => {
        const wrapper = setup.setProps({ appearance: 'singleInput', screenType: 'mobile' });
        expect(wrapper.find('.time-picker-holder').hasClass('mobile')).toBeTruthy();
    });

    it('renders with positions prop', () => {
        const positions = ['bottom', 'top', 'left', 'right'] as ('bottom' | 'top' | 'left' | 'right')[];
        const wrapper = setup.setProps({ positions, appearance: 'singleInput' });

        wrapper.find(TimePickerPopover).get(0).props.positions;

        expect(wrapper.find(TimePickerPopover).get(0).props.positions).toEqual(positions);
    });

    it('handles onBlur event', () => {
        const onBlur = jest.fn();
        const value = '10:34:52';
        const wrapper = setup.setProps({ onBlur, appearance: 'singleInput', value });
        const event = { currentTarget: { value: 'time-picker-single-input' } } as React.ChangeEvent<HTMLInputElement>;
        wrapper.find(ExtendedInput).get(0).props.onBlur(event);

        expect(onBlur).toHaveBeenCalled();
    });
});
