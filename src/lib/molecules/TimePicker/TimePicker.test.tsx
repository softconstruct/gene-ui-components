import React from 'react';
import { ReactWrapper, mount } from 'enzyme';
import TimePicker, { ITimePickerProps } from './TimePicker';
import GeneUIProvider from '../../providers/GeneUIProvider';
import TimePickerPopover from './Popover';

describe('<TimePicker/>', () => {
    let setup: ReactWrapper<ITimePickerProps>;
    beforeEach(() => {
        // @ts-ignore
        setup = mount(<TimePicker />, {
            wrappingComponent: GeneUIProvider
        });
    });

    it('Checking if a component exists', () => {
        expect(setup.exists()).toBeTruthy();
    });

    it('Test with prop value', () => {
        const value = '10:34:52';

        const wrapper = setup.setProps({ value });
        //@ts-ignore
        const timePickerPopover = wrapper.find(TimePickerPopover).last();
        expect(timePickerPopover.exists()).toBeTruthy();

        const getProvider = mount(<GeneUIProvider />);

        expect(getProvider.find('.time-picker-drop-holder').find('.active')).toBeDefined();
    });

    it('Test with prop onChange', () => {
        const onChange = jest.fn();

        const wrapper = setup.setProps({ onChange, appearance: 'singleInput' });
        const e = { target: { value: 'time-picker-single-input' } };
        //@ts-ignore
        const singleInput = wrapper.find('.time-picker-single-input').first();
        expect(singleInput.exists()).toBeTruthy();
        //@ts-ignore
        singleInput.props().onChange(e);

        expect(onChange).toHaveBeenCalledWith(e);
    });

    it('Test with prop showSeconds', () => {
        const wrapper = setup.setProps({ appearance: 'singleInput', showSeconds: true });
        const singleInput = wrapper.find('.time-picker-single-input').first();
        singleInput.simulate('click');
        const dropSeconds = wrapper.find('.time-picker-drop-seconds');
        expect(dropSeconds.exists()).toBeTruthy();
    });

    it('Test with prop appearance', () => {
        const wrapper = setup.setProps({ appearance: 'singleInput' });
        const singleInput = wrapper.find('.time-picker-single-input').first();
        expect(singleInput.exists()).toBeTruthy();
    });

    it('Test with prop hourFormat', () => {
        const expectedListCount = 24;
        const wrapper = setup.setProps({ appearance: 'singleInput', hourFormat: 'HH' });
        const singleInput = wrapper.find('.time-picker-single-input').first();
        singleInput.simulate('click');
        const dropHours = wrapper.find('.time-picker-drop-hours li');
        expect(dropHours.exists()).toBeTruthy();
        const actualDropHoursCount = dropHours.length;
        expect(actualDropHoursCount).toEqual(expectedListCount);
    });

    it('Test with prop minuteFormat', () => {
        const expectedListCount = 60;
        const wrapper = setup.setProps({ appearance: 'singleInput', minuteFormat: 'mm' });
        const singleInput = wrapper.find('.time-picker-single-input').first();
        singleInput.simulate('click');
        const dropMinutes = wrapper.find('.time-picker-drop-minutes li');
        expect(dropMinutes.exists()).toBeTruthy();
        const actualDropdropMinutesCount = dropMinutes.length;
        expect(actualDropdropMinutesCount).toEqual(expectedListCount);
    });

    it('Test with prop secondFormat', () => {
        const expectedListCount = 60;
        const wrapper = setup.setProps({ appearance: 'singleInput', minuteFormat: 'mm' });
        const singleInput = wrapper.find('.time-picker-single-input').first();
        singleInput.simulate('click');
        const dropSeconds = wrapper.find('.time-picker-drop-seconds li');
        expect(dropSeconds.exists()).toBeTruthy();
        const actualDropdropSecondsCount = dropSeconds.length;
        expect(actualDropdropSecondsCount).toEqual(expectedListCount);
    });

    it('Test with prop separator', () => {
        const wrapper = setup.setProps({ appearance: 'singleInput', separator: ':' });
        const singleInput = wrapper.find('.time-picker-single-input').first();
        const singleInputPlaceholder = singleInput.props().placeholder;
        expect(singleInputPlaceholder).toContain(':');
    });

    it('Test with prop disabled', () => {
        const wrapper = setup.setProps({ appearance: 'singleInput', disabled: true });
        const timePickerHolder = wrapper.find('.time-picker-holder');
        const classNames = timePickerHolder.prop('className');
        expect(classNames).toContain('disabled');
    });

    it('Test with prop readOnly', () => {
        const wrapper = setup.setProps({ appearance: 'singleInput', readOnly: true });
        const timePickerHolder = wrapper.find('.time-picker-holder');
        const classNames = timePickerHolder.prop('className');
        expect(classNames).toContain('read-only');
    });

    it('Test with prop screenType', () => {
        const wrapper = setup.setProps({ appearance: 'singleInput', screenType: 'mobile' });
        const timePickerHolder = wrapper.find('.time-picker-holder');
        const classNames = timePickerHolder.prop('className');
        expect(classNames).toContain('mobile');
    });

    it('Test with prop onBlur', () => {
        const onBlur = jest.fn();

        const wrapper = setup.setProps({ onBlur, appearance: 'singleInput' });
        const e = {
            currentTarget: { value: '12:15:27' }
        };
        //@ts-ignore
        const singleInput = wrapper.find('.time-picker-single-input').first();
        expect(singleInput.exists()).toBeTruthy();
        //@ts-ignore
        singleInput.props().onBlur(e);

        expect(onBlur).toHaveBeenCalled();
    });
});
