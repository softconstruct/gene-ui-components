import React, { FC } from 'react';
import { Meta } from '@storybook/react';

// Helpers
import { args, propCategory } from '../../../../stories/assets/storybook.globals';

// Components
import Grid, { IGridProps } from './index';

const meta: Meta<typeof Grid> = {
    title: 'Atoms/Grid',
    component: Grid.Row,
    argTypes: {
        Col: args({ control: false, ...propCategory.others }),
        Row: args({ control: false, ...propCategory.others })
    },
    args: {
        Col: 'fill the Col prop value',
        Row: 'fill the Row prop value'
    } as IGridProps
};

export default meta;
const { Row, Col, GridContainer } = Grid;
const Template: FC<IGridProps> = (args) => {
    return (
        <GridContainer>
            <Row className="flexible">
                <Col size={3}>
                    <div>12312</div>
                </Col>
                <Col size={3}>
                    <div>12312</div>
                </Col>
                <Col size={3}>
                    <div>12312</div>
                </Col>
                <Col size={3}>
                    <div>12312</div>
                </Col>
            </Row>
            <Row>
                <Col size={4}>
                    <div>12312</div>
                </Col>
                <Col size={8}>
                    <div>12312</div>
                </Col>
            </Row>
            <Row>
                <Col size={12}>
                    <div>12312</div>
                </Col>
            </Row>
            <Row>
                <Col size="fixed">
                    <div>12312</div>
                </Col>
                <Col size={12}>
                    <div>12312</div>
                </Col>
            </Row>
        </GridContainer>
    );
};

export const Default = Template.bind({});

Default.args = {} as IGridProps;
