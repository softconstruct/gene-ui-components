import React, { useState } from 'react';

import Row from 'src/lib/molecules/GridD/row';
import Col from 'src/lib/molecules/GridD/col';
import Button from 'src/lib/atoms/Button';
import { args, category } from '../../assets/storybook.globals';
import './index.scss';

export default {
    title: 'Molecules/GridD',
    component: Col,
    subcomponents: { Row, Col },
    argTypes: {
        className: args({ control: false, category: category.others }),
        lg: args({ control: 'number', category: category.appearance }),
        md: args({ control: 'number', category: category.appearance }),
        xl: args({ control: 'number', category: category.appearance }),
        xs: args({ control: 'number', category: category.appearance }),
        style: args({ control: false, category: category.appearance }),
        xxl: args({ control: 'number', category: category.appearance }),
        size: args({ control: 'number', category: category.appearance }),
        children: args({ control: 'text', category: category.content }),
        __count: args({ control: 'number', category: category.appearance }),
        __gutter: args({ control: 'number', category: category.appearance }),
        __padding: args({ control: 'number', category: category.appearance }),
        __parentWidth: args({ control: 'number', category: category.appearance }),
        text: args({ control: 'text', name: 'column text', category: category.content }),
        padding: args({ control: 'number', name: 'Grid row gap (px)', category: category.content }),
        span: args({ control: 'number', name: 'Row separations count', category: category.content }),
        gutter: args({ control: 'number', name: 'Grid column gap (px)', category: category.content }),
        xl1: args({ control: 'number', name: 'Column size on xl screens', category: category.appearance }),
        lg1: args({ control: 'number', name: 'Column size on lg screens', category: category.appearance }),
        md1: args({ control: 'number', name: 'Column size on md screens', category: category.appearance }),
        xs1: args({ control: 'number', name: 'Column size on xs screens', category: category.appearance }),
        xl2: args({ control: 'number', name: 'Column2 size on xl screens', category: category.appearance }),
        lg2: args({ control: 'number', name: 'Column2 size on lg screens', category: category.appearance }),
        md2: args({ control: 'number', name: 'Column2 size on md screens', category: category.appearance }),
        xs2: args({ control: 'number', name: 'Column2 size on xs screens', category: category.appearance }),
        xxl1: args({ control: 'number', name: 'Column size on xxl screens', category: category.appearance }),
        xxl2: args({ control: 'number', name: 'Column2 size on xxl screens', category: category.appearance })
    }
};

const Template = ({ ...args }) => {
    const [colCount, setColCount] = useState(() => [1, 2, 3, 4, 5]);
    const add = () => setColCount((cols) => [...cols, cols.length + 1]);
    const remove = () =>
        setColCount(() => {
            const cols = [...colCount];

            cols.pop();
            return cols;
        });
    const { span, text, gutter, padding, ...rest } = args;
    return (
        <>
            <div style={{ display: 'flex' }}>
                <Button
                    size="medium"
                    icon="bc-icon-plus"
                    flexibility="content-size"
                    color="confirm"
                    appearance="minimal"
                    onClick={add}
                />
                <Button
                    size="medium"
                    icon="bc-icon-minus"
                    flexibility="content-size"
                    color="danger"
                    appearance="minimal"
                    onClick={remove}
                />
            </div>

            <Row span={span} padding={padding} gutter={gutter}>
                {colCount.map((item, i) => (
                    <Col
                        key={i}
                        xxl={rest[`xxl${item}`]}
                        xl={rest[`xl${item}`]}
                        lg={rest[`lg${item}`]}
                        md={rest[`md${item}`]}
                        xs={rest[`xs${item}`]}
                    >
                        <div className="grid-item">{text}</div>
                    </Col>
                ))}
            </Row>
        </>
    );
};

export const Gridd = Template.bind({});

Gridd.args = {
    span: 12,
    padding: 20,
    gutter: 20,
    text: 'Column',
    xxl1: 3,
    xl1: 2,
    lg1: 1,
    md1: 1,
    xs1: 1,
    xxl2: 3,
    xl2: 2,
    lg2: 1,
    md2: 1,
    xs2: 1
};
