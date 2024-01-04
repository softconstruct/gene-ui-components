import React, { useState } from 'react';

import MobileNavigation from 'src/lib/molecules/MobileNavigation';

import { args, category, componentStage } from '../../assets/storybook.globals';

import {
    Col,
    Form,
    FormableCheckbox,
    FormableDatePicker,
    FormableDropdown,
    FormableEditor,
    FormableMultiSelectDropdown,
    FormableNumberInput,
    FormableRadio,
    FormableSwitcher,
    FormableTextInput,
    FormableUploader,
    Row
} from '../../../src';
import './style.scss';

const dataOfDropdown = [
    { label: 'Option 1', value: 1 },
    { label: 'Option 2', value: 2 },
    { label: 'Option 3', value: 3 }
];

export default {
    title: 'Organisms/Form-d',
    component: MobileNavigation,
    argTypes: {
        list: args({ control: false, category: category.content }),
        onChange: args({ control: false, category: category.action }),
        className: args({ control: false, category: category.others }),
        activeSlug: args({ control: false, category: category.states })
    },
    args: {
        componentStage: {
            type: componentStage.deprecated
        }
    }
};

export const PersonalInfoForm = (args) => {
    const [email, setEmail] = useState('');
    const [lastName, setLastName] = useState('');
    const [birthday, setBirthday] = useState('');
    const [range, setRange] = useState([]);
    const [firstName, setFirstName] = useState('');
    const [birthCity, setBirthCity] = useState('');
    const [personalID, setPersonalID] = useState('');
    const [middleName, setMiddleName] = useState('');
    const [isResident, setIsResident] = useState(false);
    const [radio, setRadio] = useState(null);
    const [birthDepartment, setBirthDepartment] = useState('');

    return (
        <Form {...args} className={'sb_form'}>
            <Row>
                <Col size={4}>
                    <FormableTextInput
                        name="FirstName"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        label="First Name"
                        labelAppearance="title"
                        cornerRadius="smooth-radius"
                        appearance="minimal"
                        errorText="Required field"
                    />
                </Col>
                <Col size={4}>
                    <FormableTextInput
                        value={middleName}
                        onChange={(e) => setMiddleName(e.target.value)}
                        label="Middle Name"
                        labelAppearance="title"
                        cornerRadius="smooth-radius"
                        appearance="minimal"
                    />
                </Col>
                <Col size={4}>
                    <FormableTextInput
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        label="Last Name"
                        labelAppearance="title"
                        cornerRadius="smooth-radius"
                        appearance="minimal"
                        showErrorWithTooltip
                        errorText="Required field"
                    />
                </Col>
                <Col size={4}>
                    <FormableTextInput
                        isEmail
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        label="Email"
                        labelAppearance="title"
                        cornerRadius="smooth-radius"
                        appearance="minimal"
                    />
                </Col>
                <Col size={4}>
                    <FormableDatePicker
                        required
                        value={birthday}
                        onChange={(value) => setBirthday(value)}
                        label="Birthday"
                        labelAppearance="title"
                        cornerRadius="smooth-radius"
                        appearance="minimal"
                    />
                </Col>
                <Col size={4}>
                    <FormableTextInput
                        value={birthCity}
                        onChange={(e) => setBirthCity(e.target.value)}
                        label="Birth City"
                        labelAppearance="title"
                        cornerRadius="smooth-radius"
                        appearance="minimal"
                    />
                </Col>
                <Col size={12}>
                    <FormableDatePicker
                        required
                        withRange
                        value={range}
                        format="MM/DD/YYYY"
                        onChange={(value) => setRange(value)}
                        label="Range"
                        labelAppearance="title"
                        cornerRadius="smooth-radius"
                        appearance="minimal"
                    />
                </Col>
                <Col size={4}>
                    <FormableTextInput
                        required
                        value={birthDepartment}
                        onChange={(e) => setBirthDepartment(e.target.value)}
                        label="Birth Department"
                        labelAppearance="title"
                        cornerRadius="smooth-radius"
                        appearance="minimal"
                    />
                </Col>
                <Col size={4}>
                    <FormableNumberInput
                        required
                        value={personalID}
                        onChange={(e) => setPersonalID(e.target.value)}
                        label="Personal ID"
                        labelAppearance="title"
                        cornerRadius="smooth-radius"
                        appearance="minimal"
                    />
                </Col>
                <Col size={4}>
                    <FormableCheckbox
                        required
                        labelPosition="top"
                        label="Is resident"
                        value={isResident}
                        onChange={(e) => setIsResident(e.target.checked)}
                    />
                </Col>
                <Col size={4}>
                    <FormableRadio
                        required
                        type="radio"
                        value={radio}
                        options={dataOfDropdown}
                        onChange={(e) => setRadio(e.target.value)}
                        name="radio-group"
                    />
                </Col>
            </Row>
        </Form>
    );
};

export const FormWithDate = () => {
    return (
        <Form className={'sb_form'}>
            <FormableDatePicker required label="Birthday" cornerRadius="smooth-radius" appearance="minimal" />
        </Form>
    );
};

export const BigForm = (args) => {
    return (
        <Form {...args} className={'sb_form'}>
            <Row span={12} padding={20} gutter={20}>
                <Col size={6}>
                    <FormableTextInput required defaultValue="Some text" type="text" />
                </Col>
                <Col size={6}>
                    <FormableNumberInput
                        forceValidateDuringChange
                        required
                        min={100}
                        max={500}
                        placeholder="Number field (minimum value: 100, maximum value: 500)"
                        type="number"
                    />
                </Col>
                <Col size={12}>
                    <FormableTextInput defaultValue="Not required field" type="text" />
                </Col>
                <Col size={6}>
                    <FormableNumberInput
                        showIconOnValid={false}
                        showErrorIcon={false}
                        min={5}
                        placeholder="Must be number or empty (minimum value is 5)"
                        type="number"
                    />
                </Col>
                <Col size={6}>
                    <FormableDropdown
                        required
                        clearable
                        type="dropdown"
                        placeholder="Select option"
                        data={dataOfDropdown}
                    />
                </Col>
                <Col size={6}>
                    <FormableMultiSelectDropdown
                        required
                        label="New lavel"
                        type="dropdown"
                        min={2}
                        max={5}
                        clearable
                        labelAppearance="title"
                        placeholder="Select options"
                        data={dataOfDropdown}
                    />
                </Col>
                <Col size={6}>
                    <FormableCheckbox required type="checkbox" label="Some label" labelPosition="top" name="checkbox" />
                </Col>
                <Col size={3}>
                    <FormableSwitcher
                        required
                        type="checkbox"
                        onText="On"
                        offText="Off"
                        errorText="Switch On for continue"
                        label="Some label"
                        labelPosition="top"
                        name="switcher"
                    />
                </Col>
                <Col size={12}>
                    <FormableEditor type="editor" name="editor" />
                </Col>
                <Col size={6}>
                    <FormableUploader
                        fileAppearance="attachment"
                        label="Upload File"
                        required
                        allTypesAccepted
                        isActiveDrop
                        name="imageUploader"
                    />
                </Col>
                <Col size={6}>
                    <FormableUploader
                        fileAppearance="attachment"
                        label="Upload"
                        required
                        isActiveDrop
                        name="imageUploader"
                    />
                </Col>
            </Row>
        </Form>
    );
};
