import React, { Children, FC, useEffect, useState } from 'react';
import Confetti from 'react-confetti';

import WizardComponent, { useGetDataFromContext, WizardPRovider } from './';
import { args, category } from '../../../../stories/assets/storybook.globals';

import Counter from '../Counter';
import ExtendedInput from '../ExtendedInput';
import Textarea from '../Textarea';
import Dropdown from '../../organisms/Dropdown';

import Checkbox from '../Checkbox';
import DateRangePickerInput from '../DatePickerInput/DateRangeInput';
import { IConfig } from './Types';
import Switcher from '../../atoms/Switcher';
import UploadView from '../Uploader/uploadView';
import { Meta } from '@storybook/react';
import Uploader from '../Uploader';
import DatePickerInput from '../DatePickerInput/DateInput';
import RadioGroup from '../RadioGroup';
import Rating from '../../atoms/Rating/Rating';
import useWindowSize from '../../../hooks/useWindowSize';
import { Star } from 'lucide-react';

import { faker } from '@faker-js/faker';
import { element } from 'prop-types';
import { Tab, Tabs } from '../Tabs';
import Icon from '../../atoms/Icon';
const meta: Meta<typeof WizardComponent> = {
    title: 'Molecules/Wizard',
    component: WizardComponent,
    argTypes: { mode: args({ control: 'select', defaultValue: 'standard', category: category.appearance }) }
};
export default meta;

interface IWizardProps {
    mode: 'readonly' | 'standard';
    title?: string;
}

const Wizard: FC<IWizardProps> = ({ mode, title = 'mMm' }) => {
    const { setStorageData, createCustomError, clearErrors, getData, setDynamicProps, errors, currentStep } =
        useGetDataFromContext();

    const step1Config: IConfig[] = [
        {
            element: ExtendedInput,
            col: 12,
            wrapper: ({ children }) => {
                return (
                    <div>
                        <h1>Name</h1> {children}
                    </div>
                );
            },
            props: {
                label: 'Name (English)',
                dataKey: 'Name',
                placeholder: 'Name'
            },
            rules: {
                required: 'this field is required',
                maxLength: {
                    message: 'max length is 8',
                    value: 8
                }
            },

            name: 'first-name'
        },
        {
            element: ExtendedInput,
            col: 12,
            props: {
                label: 'LastName (English)',
                dataKey: 'LastName',
                placeholder: 'Last Name'
            },
            rules: {
                required: 'this field is required',
                maxLength: {
                    message: 'max length is 14',
                    value: 14
                }
            },

            name: 'last-name'
        },
        {
            element: DatePickerInput,
            props: {
                onChange: (e) => {
                    clearErrors('birth-date');
                    setStorageData('birth-date', e);
                }
            },
            required: 'Partadir gri',

            name: 'birth-date'
        },
        {
            element: ExtendedInput,
            props: {
                placeholder: 'phone-number',
                type: 'number'
            },

            rules: {
                required: 'this field is required',
                maxLength: {
                    message: 'max length is 14',
                    value: 14
                }
            },
            name: 'phone-number'
        },
        {
            element: ExtendedInput,
            props: {
                placeholder: 'email',
                type: 'email'
            },

            rules: {
                required: 'this field is required'
            },
            name: 'email'
        },

        {
            element: Textarea,
            props: {
                placeholder: 'additional information (optional)'
            },
            name: 'description'
        }
    ];

    const step2Config: IConfig[] = [
        {
            element: Uploader,
            required: 'add photo',
            wrapper: ({ children }) => {
                return (
                    <div>
                        <h1>11</h1> {children}
                    </div>
                );
            },
            props: {
                multiple: false,
                isImageUpload: true,
                isDisabled: false,
                isActiveDrop: true,
                startUploadLabel: 'upload',
                maxFileSize: 3000000,
                chooseFileLabel: 'upload',
                uploadedItemsAppearance: 'box',
                maxFileCount: 1,
                onChange: (e) => {
                    if (e.value.length) {
                        setStorageData('user-photo', e.value);
                    } else {
                        setStorageData('user-photo', null);
                    }
                    clearErrors('user-photo');
                }
            },

            name: 'user-photo'
        },
        {
            element: RadioGroup,
            rules: { required: 'this field is required' },
            props: {
                value: 'male',
                options: [
                    {
                        label: 'male',
                        value: 'male',
                        info: 'description1'
                    },
                    {
                        label: 'female',
                        value: 'female',
                        info: 'description2'
                    }
                ],
                onChange: (e) => {
                    setStorageData('gender', e.target?.value);
                }
            },
            name: 'gender'
        },
        {
            element: Dropdown,
            required: 'Chose country',
            props: {
                onChange: (e) => {
                    if (e.value) {
                        setStorageData('dropdown', e.value);
                        clearErrors('dropdown');
                    }
                },

                label: 'City',
                data: Array(20)
                    .fill(undefined)
                    .map(() => ({
                        label: faker.address.country(),
                        value: Array(5)
                            .fill(undefined)
                            .map(() => ({
                                label: faker.address.cityName(),
                                value: faker.address.cityName()
                            }))
                    }))
            },
            name: 'dropdown'
        }
    ];

    const step3Config: IConfig[] = [
        {
            element: Rating,
            name: 'rating',
            col: 3,
            wrapper: ({ children }) => {
                return (
                    <div>
                        <h1>Rating!!!</h1>
                        {children}
                    </div>
                );
            }
        }
    ];

    const { height, width } = useWindowSize();

    const [xlapushka, setXlapushka] = useState(false);

    const actionAfterSuccess = () => {
        setXlapushka(true);
    };

    return (
        <>
            {' '}
            <Confetti
                width={width}
                height={height}
                style={{ zIndex: 777 }}
                recycle={false}
                gravity={0.2}
                run={xlapushka}
            />
            <WizardComponent title={title} mode={mode}>
                <WizardComponent.StepContainer>
                    <WizardComponent.Step
                        title="Info1"
                        id="step1"
                        config={step1Config}
                        mode="onChange"
                        actionsStyles={{ marginTop: 20 }}
                    >
                        <WizardComponent.Row className="justify-items-center">
                            <WizardComponent.Col col={8} className="align-items-center">
                                <WizardComponent.Element
                                    globalStyles={{ marginTop: 20 }}
                                    names={[
                                        'first-name',
                                        'last-name',
                                        'birth-date',
                                        'phone-number',
                                        'email',
                                        'description'
                                    ]}
                                />
                            </WizardComponent.Col>
                        </WizardComponent.Row>
                    </WizardComponent.Step>
                </WizardComponent.StepContainer>
                <WizardComponent.StepContainer>
                    <WizardComponent.Step title="Info2" id="step2" config={step2Config}>
                        <WizardComponent.Row className="justify-items-center">
                            <WizardComponent.Col col={3}>
                                <WizardComponent.Element
                                    names={['user-photo', 'gender', 'dropdown']}
                                    globalStyles={{ padding: '10px', gap: '15px' }}
                                />
                            </WizardComponent.Col>
                        </WizardComponent.Row>
                    </WizardComponent.Step>
                </WizardComponent.StepContainer>
                <WizardComponent.StepContainer>
                    <WizardComponent.Step
                        title="Info3"
                        config={step3Config}
                        id="step3"
                        nextButtonTitle="Finish!"
                        actionAfterSuccess={actionAfterSuccess}
                    >
                        <WizardComponent.Row
                            style={{ gap: 0, height: '100%' }}
                            className="justify-items-center align-items-center"
                        >
                            <WizardComponent.Element names={['rating']} globalStyles={{ padding: '10px' }} />
                        </WizardComponent.Row>
                    </WizardComponent.Step>
                </WizardComponent.StepContainer>
            </WizardComponent>
        </>
    );
};

export const WizardProvider = (args) => {
    return (
        <WizardPRovider>
            <Wizard {...args} />
        </WizardPRovider>
    );
};
