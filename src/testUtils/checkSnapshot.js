import React from 'react';
import renderer from 'react-test-renderer';

const checkSnapshot = (testCase, Component) => {
    test(testCase, () => {
        const component = renderer.create(Component);
        const tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });
};

export default checkSnapshot;
