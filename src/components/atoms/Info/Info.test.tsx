import React from 'react';
import { ReactWrapper, mount } from 'enzyme';

// Components
import Info, { IInfoProps } from './index';
import { InfoOutline } from '@geneui/icons';

describe('Info ', () => {
    let setup: ReactWrapper<IInfoProps>;
    beforeEach(() => (setup = mount(<Info size={'small'} infoText={'infoText'} />)));

    it('renders without crashing', () => {
        expect(setup.exists()).toBeTruthy();
    });

    it('renders disabled prop correctly', () => {
        const wrapper = setup.setProps({ disabled: true });

        expect(wrapper.find('button').props().disabled).toBeTruthy();
        expect(wrapper.find('button').hasClass('info_disabled')).toBeTruthy();
    });

    it.each<IInfoProps['appearance']>(['default', 'brand', 'inverse'])('should have "%s" appearance', (appearance) => {
        const wrapper = setup.setProps({ appearance });

        expect(wrapper.find('button').hasClass(`info_appearance_${appearance}`)).toBeTruthy();
    });

    it.each<IInfoProps['size']>(['small', 'smallNudge', 'XSmall'])('should have "%s" size', (size) => {
        const wrapper = setup.setProps({ size });
        const iconSizes = {
            small: 24,
            smallNudge: 20,
            XSmall: 16
        } as const;

        if (size) expect(wrapper.find(InfoOutline).props().size).toEqual(iconSizes[size]);
    });

    it('renders className prop correctly', () => {
        const className = 'test-class';
        const wrapper = setup.setProps({ className });

        expect(wrapper.hasClass(className)).toBeTruthy();
    });
});
