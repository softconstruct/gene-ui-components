import React from 'react';
import { mount, shallow } from 'enzyme';
import Button, { IButtonProps } from './index';

type ButtonKeysType = keyof Readonly<IButtonProps>;

interface IDataProp {
    propName: ButtonKeysType;
    expectVal: unknown;
    propVal: unknown;
}

// type WrapperPropsForCall = typeof shallow & typeof mount;

// type WrapperProps = typeof shallow | typeof mount;

const Props: IDataProp[] = [
    { propName: 'children', propVal: 'dataset', expectVal: 'dataset' },
    { propName: 'appearance', propVal: true, expectVal: true },
    { propName: 'flexibility', propVal: 'flex2', expectVal: 'flex2' },
    { propName: 'color', propVal: 'red', expectVal: 'red' },
    { propName: 'itemsDirection', propVal: 'itemsDirection', expectVal: 'itemsDirection' },
    { propName: 'cornerRadius', propVal: 'cornerRadius', expectVal: 'cornerRadius' },
    { propName: 'icon', propVal: 'icon', expectVal: 'icon' },
    { propName: 'disabled', propVal: true, expectVal: true },
    { propName: 'active', propVal: true, expectVal: true },
    { propName: 'withShadow', propVal: true, expectVal: true },
    { propName: 'className', propVal: 'amd', expectVal: 'amd' },
    { propName: 'loading', propVal: false, expectVal: false }
];

// wrapper: WrapperProps = mount
describe('Button Component', () => {
    const setup = (props?: Partial<IButtonProps>, isShallow: boolean = false) => {
        // const wrapperFunction = wrapper as WrapperPropsForCall;
        return isShallow ? shallow(<Button {...props} />) : mount(<Button {...props} />);

        //wrapperFunction(<Button {...props} />);
    };

    it.each<IDataProp>(Props)('call with property $propName', ({ propName, propVal, expectVal }) => {
        const wrapper = setup({
            [propName]: propVal
        });
        expect(wrapper.props()[propName]).toBe(expectVal);
    });

    it.each<Omit<IDataProp, 'expectVal'>>([
        { propName: 'children', propVal: '' },
        { propName: 'appearance', propVal: false },
        { propName: 'flexibility', propVal: '' },
        { propName: 'color', propVal: '' },
        { propName: 'itemsDirection', propVal: '' },
        { propName: 'cornerRadius', propVal: '' },
        { propName: 'icon', propVal: '' },
        { propName: 'disabled', propVal: false },
        { propName: 'active', propVal: false },
        { propName: 'withShadow', propVal: false },
        { propName: 'className', propVal: '' },
        { propName: 'loading', propVal: '' }
    ])('call with empty props $propName', ({ propName, propVal }) => {
        const wrapper = setup({
            [propName]: propVal
        });
        expect(wrapper.props()[propName]).toBeFalsy();
    });

    it('check click event', () => {
        const onClick = jest.fn();
        const wrapper = setup({
            onClick
        });
        wrapper.simulate('click');
        expect(onClick).toHaveBeenCalled();
    });

    it('check conditional rendering', () => {
        const wrapper = setup({
            loading: true
        });

        expect(wrapper.find('.btn-loader-holder').exists()).toBeTruthy();
    });
});
