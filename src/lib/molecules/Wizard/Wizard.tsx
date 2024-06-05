import React, {
    useEffect,
    FC,
    useState,
    Dispatch,
    SetStateAction,
    createContext,
    PropsWithChildren,
    useContext,
    Children,
    CSSProperties,
    HTMLAttributes
} from 'react';

import {
    useForm,
    SubmitHandler,
    Mode,
    FieldValues,
    UseFormRegister,
    FieldErrors,
    UseFormHandleSubmit,
    UseFormGetFieldState,
    UseFormWatch,
    UseFormSetValue,
    UseFormGetValues,
    UseFormTrigger
} from 'react-hook-form';

// Styles
import './Wizard.scss';

// Types
import { IConfig, IntRange } from './Types';

// Components
import RegisteredElement from './RegisteredElement';
import ExtendedInput from '../ExtendedInput';
import Search from '../Search';
import Textarea from '../Textarea';
import UnregisteredElement from './UnregisteredElement';
import Button from '../../atoms/Button';
import classNames from 'classnames';
import Checkbox from '../Checkbox';
import Radio from '../../atoms/Radio';
import Switcher from '../../atoms/Switcher';
import Modal from '../Modal/index';
import Steps from '../Steps/Steps';
import Step from '../Steps/Step';
const hookFormElements: Array<IConfig['element']> = [ExtendedInput, Search, Textarea, Checkbox, Radio, Switcher];

let formElements = hookFormElements.reduce((aggr, el) => {
    if (!aggr.has(el)) {
        aggr.set(el, el);
    }
    return aggr;
}, new WeakMap());

interface ISteps {
    title: string;
    id: string;
}

interface IWizardProvider {
    setStorageData: (key: string, val: string | null | Record<string, any>) => void;
    getData: (key?: string) => Record<string, never>;
    steps: ISteps[];
    setSteps: Dispatch<SetStateAction<ISteps[]>>;
    currentStep: number;
    setStep: Dispatch<SetStateAction<number>>;
    stepsCount: number;
    clearErrors: (key?: string) => void;
    register: UseFormRegister<FieldValues>;
    errors: FieldErrors<FieldValues>;
    handleSubmit: UseFormHandleSubmit<FieldValues, undefined>;
    getFieldState: UseFormGetFieldState<FieldValues>;
    createCustomError: (key: string, message: string) => void;
    watch: UseFormWatch<FieldValues>;
    setMode: Dispatch<SetStateAction<Mode>>;
    setValue: UseFormSetValue<FieldValues>;
    setIsStepSuccess: Dispatch<SetStateAction<Record<string, boolean>>>;
    isStepSuccess: Record<string, boolean>;
    setDynamicProps: (id: string, name: string, props: Record<string, unknown>) => void;
    dynamicPropsData: Record<string, Record<string, unknown>>;
    setAllConfigs: Dispatch<SetStateAction<Record<string, IConfig[]>>>;
    allConfigs: Record<string, IConfig[]>;
    formerStep: Record<number, number>;
    getValues: UseFormGetValues<FieldValues>;
    isDisabled: boolean;
    setIsDisabled: Dispatch<SetStateAction<boolean>>;
    setAllErrors: Dispatch<SetStateAction<Record<number, FieldErrors<FieldValues>>>>;
    allErrors: Record<number, FieldErrors<FieldValues>>;
    trigger: UseFormTrigger<FieldValues>;
    unregisteredFields: IConfig[];
    setUnregisteredFields: Dispatch<SetStateAction<IConfig[]>>;
    setStorage: Dispatch<SetStateAction<Record<string, Record<string, never>>>>;
    temporaryStorageData: Record<string, string | null | Record<string, any>>;
}
const CreateWizardContext = createContext<IWizardProvider>({} as IWizardProvider);

export const WizardPRovider: FC<PropsWithChildren> = ({ children }) => {
    const [storage, setStorage] = useState({});
    const [steps, setSteps] = useState<ISteps[]>([]);
    const [currentStep, setStep] = useState(0);
    const [mode, setMode] = useState<Mode>('onChange');
    const [isStepSuccess, setIsStepSuccess] = useState({});
    const [dynamicPropsData, setDynamicPropsData] = useState({});
    const [allConfigs, setAllConfigs] = useState<Record<string, IConfig[]>>({});
    const [formerStep, setFormerStep] = useState<Record<number, number>>({});
    const [isDisabled, setIsDisabled] = useState(false);
    const [allErrors, setAllErrors] = useState<Record<number, FieldErrors<FieldValues>>>({});
    const [unregisteredFields, setUnregisteredFields] = useState<IConfig[]>([]);
    const [temporaryStorageData, setTemporaryStorageData] = useState<
        Record<string, string | null | Record<string, any>>
    >({});

    const setStorageData = (key: string, val: string | null | Record<string, any>) => {
        setTemporaryStorageData((prev) => ({
            ...prev,
            [key]: val
        }));
    };

    useEffect(() => {
        const currentStepId = steps[currentStep]?.id;
        currentStepId &&
            setStorage((prev) => ({
                ...prev,
                [currentStepId]: {
                    ...prev[currentStepId],
                    ...temporaryStorageData
                }
            }));
    }, [currentStep, temporaryStorageData, steps]);

    useEffect(() => {
        setFormerStep((prev) => ({ ...prev, [currentStep]: currentStep }));
    }, [currentStep]);

    const setDynamicProps = (id: string, name: string, props: Record<string, unknown>) => {
        setDynamicPropsData((prev) => ({
            ...prev,
            [id]: { ...prev[id], [name]: { ...prev[id]?.[name], ...props } }
        }));
    };

    const getData = (key?: string): Record<string, never> => (key && storage[key]) || storage;

    const {
        register,
        handleSubmit,
        formState: { errors },
        getFieldState,
        setError,
        setValue,
        watch,
        clearErrors: clearFormErrors,
        getValues,
        trigger
    } = useForm({
        mode
    });

    const clearErrors = (key?: string) => {
        if (key) {
            clearFormErrors(key);
            delete allErrors[currentStep]?.[key];
            setAllErrors(allErrors);
        } else {
            clearFormErrors();
            setAllErrors({});
        }
    };

    const createCustomError = (key: string, message: string) => {
        setError(key, {
            type: 'custom',
            message
        });
    };

    useEffect(() => {
        if (Object.keys(errors).length) {
            setAllErrors((prev) => ({
                ...prev,
                [currentStep]: {
                    ...prev[currentStep],
                    ...errors
                }
            }));
        }
    }, [Object.keys(errors).length]);

    return (
        <CreateWizardContext.Provider
            value={{
                setStorageData,
                getData,
                isDisabled,
                setIsDisabled,
                steps,
                setSteps,
                currentStep,
                setStep,
                stepsCount: steps.length,
                clearErrors,
                register,
                setAllErrors,
                allErrors,
                errors,
                handleSubmit,
                getFieldState,
                createCustomError,
                watch,
                setMode,
                setValue,
                setIsStepSuccess,
                isStepSuccess,
                setDynamicProps,
                dynamicPropsData,
                setAllConfigs,
                allConfigs,
                formerStep,
                getValues,
                trigger,
                unregisteredFields,
                setUnregisteredFields,
                setStorage,
                temporaryStorageData
            }}
        >
            {children}
        </CreateWizardContext.Provider>
    );
};

interface Props extends PropsWithChildren {
    title: string;
    mode?: 'readonly' | 'standard';
}

const Wizard = ({ children, title, mode = 'standard' }: Props) => {
    const childrenFromArray = Children.toArray(children);
    const {
        steps,
        setSteps,
        currentStep,
        setStep,
        errors,
        isStepSuccess,
        setAllConfigs,
        allConfigs,
        formerStep,
        setIsDisabled
    } = useContext(CreateWizardContext);

    useEffect(() => {
        setIsDisabled(mode === 'readonly');

        if (mode === 'standard') {
            setStep(0);
        }
    }, [mode]);

    useEffect(() => {
        const getAllSetupData = (childrenFromArray) => {
            for (let i = 0; i < childrenFromArray.length; i++) {
                const el = childrenFromArray[i];
                if (el?.props?.children && el.type?.displayName !== 'Step') {
                    getAllSetupData(Children.toArray(el.props.children));
                } else if (el.type?.displayName === 'Step') {
                    const { title, config, id } = el.props;
                    if (config) {
                        setAllConfigs((prev) => ({
                            ...prev,
                            [id]: config
                        }));
                    }

                    setSteps((prev) => [...prev, { title, id }]);
                    break;
                }
            }
        };
        setSteps([]);
        getAllSetupData(childrenFromArray);
    }, []);

    const moveBetweenSteps = (i: number, isStepSuccess: boolean) => {
        if (mode === 'readonly' || isStepSuccess || formerStep[i]) {
            setStep(i);
        }
    };

    return (
        <>
            {/* @ts-ignore */}
            <Modal
                visible={true}
                title={title}
                closable={false}
                size={'content-size'}
                disableFooter
                width={'100%'}
                height={'100%'}
                position={'top'}
            >
                <div className="row justify-items-center">
                    {/* @ts-ignore */}

                    <Steps size="big" status="initial" appearance="dots" className={'col-11'} direction="horizontal">
                        {steps.map(({ title, id }, i) => {
                            const isErrorExist = allConfigs[id]?.some((data) => errors[data.name]);
                            const stepStatus =
                                currentStep === i
                                    ? 'current'
                                    : isErrorExist
                                    ? 'fail'
                                    : isStepSuccess[id]
                                    ? 'success'
                                    : 'initial';
                            return (
                                //@ts-ignore
                                <Step
                                    title={title}
                                    successColor="#2bc784"
                                    status={stepStatus}
                                    key={title}
                                    onClick={() => moveBetweenSteps(i, isStepSuccess[id])}
                                />
                            );
                        })}
                    </Steps>
                </div>
                <div className="steps-modal">{childrenFromArray[currentStep]}</div>
            </Modal>
        </>
    );
};

Wizard.StepContainer = ({ children, ...props }: HTMLAttributes<HTMLDivElement>) => {
    return (
        <div {...props} className={'wizard-container'}>
            {children}
        </div>
    );
};

interface IStepProps extends PropsWithChildren {
    config: IConfig[];
    className?: string;
    title: string;
    id: string;
    mode?: Mode;
    nextButtonTitle?: string;
    prevButtonTitle?: string;
    actionsClassName?: string;
    actionsStyles?: CSSProperties;
    actionAfterSuccess?: () => void;
}

Wizard.Step = ({
    className,
    children,
    nextButtonTitle = 'next',
    prevButtonTitle = 'prev',
    actionsClassName,
    actionsStyles,
    actionAfterSuccess
}: IStepProps) => {
    const {
        steps,
        setStep,
        handleSubmit,
        setAllErrors,
        currentStep,
        setStorage,
        createCustomError,
        isDisabled,
        setIsStepSuccess,
        getData,
        isStepSuccess,
        unregisteredFields
    } = useContext(CreateWizardContext);

    const onSubmits: SubmitHandler<Record<string, string>> = (data) => {
        const currentStepId = steps[currentStep].id;

        const mergeData = {
            ...getData(),
            [currentStepId]: {
                ...getData(currentStepId),
                ...data
            }
        } as ReturnType<typeof getData>;

        setStorage(mergeData);
        const isDataExist = Object.keys(mergeData[currentStepId]).length;
        const submitTriggeredBy = document.activeElement as HTMLElement;
        const isSuccessBtn = submitTriggeredBy && submitTriggeredBy.dataset.success;

        if (isDataExist && isSuccessBtn) {
            setAllErrors((prev) => {
                delete prev[currentStep];
                return prev;
            });
            if (actionAfterSuccess) actionAfterSuccess();
            setIsStepSuccess((prev) => ({ ...prev, [currentStepId]: true }));
            nextStep();
        }
    };

    const nextStep = () => {
        setStep((prev) => (prev + 1 < steps.length ? prev + 1 : prev));
    };
    const prevStep = () => {
        setStep((prev) => (prev - 1 >= 0 ? prev - 1 : prev));
    };

    const triggerUnregisteredValues = () => {
        const currentStepId = steps[currentStep].id;

        if (isStepSuccess[currentStepId]) {
            setStep((prev) => (prev + 1 < steps.length ? prev + 1 : prev));
        }

        unregisteredFields.forEach((element) => {
            const isDataExist = getData(steps[currentStep].id)[element.name];

            if (element.required && !isDataExist) {
                createCustomError(element.name, element.required);
            }
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmits)} className={classNames('wizard-form', className)} noValidate>
            {children}
            <div
                className={classNames('row', 'justify-items-center', 'actions', { actionsClassName })}
                style={actionsStyles}
            >
                {currentStep !== 0 && (
                    /**@ts-ignore */
                    <Button onClick={prevStep} className="col-5" appearance="minimal" disabled={isDisabled}>
                        {prevButtonTitle}
                    </Button>
                )}
                {/**@ts-ignore */}
                <Button onClick={triggerUnregisteredValues} className="col-5" disabled={isDisabled} data-success={true}>
                    {nextButtonTitle}
                </Button>
            </div>
        </form>
    );
};

interface IWizardControlProps extends PropsWithChildren {
    col?: IntRange<1, 13>;
    className?:
        | 'justify-items-between'
        | 'justify-items-center'
        | 'align-items-center'
        | 'align-items-end'
        | 'align-items-start'
        | 'align-items-start justify-items-start'
        | 'justify-items-center align-items-center';

    style?: CSSProperties;
}
Wizard.Col = ({ children, col = 1, style }: IWizardControlProps) => {
    const cols = col ? `col-${col}` : 'col';

    return (
        <div className={cols} style={{ gap: 25, ...style }}>
            {children}
        </div>
    );
};

Wizard.Row = ({ children, className, style }: Omit<IWizardControlProps, 'col'>) => {
    return (
        <div className={classNames('row', className)} style={{ gap: 5, ...style }}>
            {children}
        </div>
    );
};

Wizard.Element = ({
    names,
    globalStyles,
    collForAll
}: {
    names: string[];
    globalStyles?: CSSProperties;
    collForAll?: number;
}) => {
    const {
        steps,
        register,
        getFieldState,
        watch,
        allErrors,
        currentStep,
        dynamicPropsData,
        allConfigs,
        getData,
        getValues,
        isDisabled,
        trigger,
        setUnregisteredFields,
        setStorage
    } = useContext(CreateWizardContext);
    const [filteredDate, setFilteredDate] = useState<IConfig[]>([]);
    const [fieldsNames, setFieldsNames] = useState<Record<string, string>>({});
    const isDataRended = {};

    useEffect(() => {
        const filterByName = names.reduce((aggr, val) => {
            aggr[val] = val;
            return aggr;
        }, {});
        setFieldsNames(filterByName);
        const getCurrentStepId = steps[currentStep]?.id;

        if (getCurrentStepId) {
            const unregisteredData: IConfig[] = [];
            const filteredData = allConfigs[getCurrentStepId]?.filter((el) => {
                !formElements.has(el.element) && unregisteredData.push(el);
                return filterByName[el.name];
            });

            setUnregisteredFields(unregisteredData);
            setFilteredDate(filteredData);
        }
    }, [steps.length, currentStep]);

    useEffect(() => {
        const getCurrentStepId = steps[currentStep]?.id;
        setStorage((prev) => {
            if (getCurrentStepId) {
                const obj = prev[getCurrentStepId];
                for (let key in obj) {
                    if (!fieldsNames[key]) {
                        delete obj[key];
                    }
                }
            }
            return prev;
        });
    }, [fieldsNames, currentStep, getData()]);

    return filteredDate.map(({ element, props, name, rules, col, style, required, wrapper: Wrapper }, i) => {
        const getDynamicPropsData = dynamicPropsData[steps[currentStep]?.id]?.[name];
        if (getDynamicPropsData) {
            props = {
                ...props,
                ...getDynamicPropsData
            };
        }

        if (isDisabled) {
            props = {
                ...props,
                disabled: isDisabled,
                isDisabled,
                readonly: true
            };
        }

        if (rules?.required || required) {
            props = {
                ...props,
                required: true
            };
        }

        const styles = style || globalStyles || {};
        const getStorageData = getData(steps[currentStep]?.id);

        if (isDataRended[name]) {
            return;
        } else {
            isDataRended[name] = true;
        }

        return (
            <div className={`col-${col || collForAll || 12} col`} style={styles} key={name}>
                {formElements.has(element) ? (
                    <RegisteredElement
                        Element={element}
                        props={props}
                        name={name}
                        register={register}
                        rules={rules}
                        elementError={allErrors[currentStep]?.[name]}
                        getFieldState={getFieldState}
                        watch={watch}
                        trigger={trigger}
                        value={getValues?.(name)}
                        Wrapper={Wrapper}
                    />
                ) : (
                    <UnregisteredElement
                        trigger={trigger}
                        Element={element}
                        props={props}
                        getFieldState={getFieldState}
                        elementError={allErrors[currentStep]?.[name]}
                        name={name}
                        value={getStorageData?.[name]}
                        Wrapper={Wrapper}
                    />
                )}
            </div>
        );
    });
};

export const useGetDataFromContext = () => {
    const {
        setStorageData,
        getData,
        currentStep,
        stepsCount,
        createCustomError,
        clearErrors,
        errors,
        setMode,
        setValue,
        setDynamicProps
    } = useContext(CreateWizardContext);
    return {
        setStorageData,
        getData,
        currentStep,
        stepsCount,
        createCustomError,
        clearErrors,
        errors,
        setMode,
        setValue,
        setDynamicProps
    };
};
//@ts-ignore
Wizard.Step.displayName = 'Step';

export default Wizard;
