import {
    RegisterOptions,
    FieldError,
    FieldErrorsImpl,
    FieldValues,
    Merge,
    UseFormGetFieldState,
    UseFormRegister,
    UseFormWatch,
    UseFormTrigger
} from 'react-hook-form';

import { CSSProperties, FC, JSXElementConstructor, PropsWithChildren, ReactNode } from 'react';

export interface IConfig {
    element: JSXElementConstructor<any>;
    props?: Record<string, any>;
    rules?: RegisterOptions<FieldValues, string>;
    name: string;
    style?: CSSProperties;
    col?: number;
    required?: string;
    wrapper?: FC<PropsWithChildren>;
}

export interface IDrawConfigData extends Pick<IConfig, 'rules' | 'props'> {
    Element: JSXElementConstructor<any>;
    getFieldState: UseFormGetFieldState<FieldValues>;
    elementError: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined;
    watch: UseFormWatch<FieldValues>;
    register: UseFormRegister<FieldValues>;
    name: string;
    value?: unknown;
    trigger: UseFormTrigger<FieldValues>;
    Wrapper?: FC<PropsWithChildren>;
}

type Enumerate<N extends number, Acc extends number[] = []> = Acc['length'] extends N
    ? Acc[number]
    : Enumerate<N, [...Acc, Acc['length']]>;

export type IntRange<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>>;
