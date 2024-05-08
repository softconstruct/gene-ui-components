import React from 'react';
import { ReactWrapper, mount } from 'enzyme';

// Components
import InteractiveWidget, { IInteractiveWidgetProps } from './index';

describe('Button', () => {
    let setup: ReactWrapper<IInteractiveWidgetProps>;

    beforeEach(() => {
        setup = mount(<InteractiveWidget />);
    });

    it('renders without crashing', () => {
        expect(setup.exists()).toBeTruthy();
    });
});
