import React, { CSSProperties } from "react";
import { Meta } from "@storybook/react";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";

// Components
import { Grid, Row, Col } from "./index";

const meta: Meta = {
    title: "Atoms/Grid",
    component: Grid,
    subcomponents: {
        Row,
        Col
    },
    argTypes: {
        size: args({ control: "false", ...propCategory.content }),
        offset: args({ control: "false", ...propCategory.content }),
        children: args({ control: "false", ...propCategory.others }),
        flexible: args({ control: "false", ...propCategory.appearance })
    },
    args: {}
};

export default meta;

const style: CSSProperties = {
    backgroundColor: "#0092ff",
    height: 200,
    margin: "3px",
    color: "#fff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 15
};

const Template = () => {
    return (
        <Grid>
            <Row>
                <Col size={4}>
                    <div style={style}>Col 4</div>
                </Col>
                <Col size={8}>
                    <div style={style}>Col 8</div>
                </Col>
            </Row>
            <Row>
                <Col size={12}>
                    <div style={style}>Col-12</div>
                </Col>
            </Row>
            <Row>
                <Col size={10}>
                    <div style={style}>Col-10</div>
                </Col>
                <Col size={2}>
                    <div style={style}>Col-2</div>
                </Col>
            </Row>
            <Row>
                <Col size={6}>
                    <div style={style}>Col-6</div>
                </Col>
                <Col size={6}>
                    <div style={style}>Col-6</div>
                </Col>
            </Row>
        </Grid>
    );
};

export const StandardGridLayout = Template.bind({});

StandardGridLayout.args = {};

export const ColumnsWithOffset = () => {
    return (
        <Grid>
            <Row>
                <Col size={2} offset={2}>
                    <div style={style}>Col-2 offset-2</div>
                </Col>
                <Col size={6} offset={0}>
                    <div style={style}>Col-6 offset-0</div>
                </Col>
            </Row>

            <Row>
                <Col size={5} offset={2}>
                    <div style={style}>Col-5 offset-2</div>
                </Col>
                <Col size={3} offset={0}>
                    <div style={style}>Col-3 offset-0</div>
                </Col>
            </Row>

            <Row>
                <Col size={8} offset={2}>
                    <div style={style}>Col-8 offset-2</div>
                </Col>
            </Row>
            <Row>
                <Col size={4} offset={2}>
                    <div style={style}>Col-4 offset-2</div>
                </Col>
                <Col size={4} offset={0}>
                    <div style={style}>Col-4 offset-0</div>
                </Col>
            </Row>
        </Grid>
    );
};

export const AdaptiveGridRow = () => {
    return (
        <Grid>
            <Row flexible>
                <Col size={3}>
                    <div style={style}>Col-1 </div>
                </Col>
                <Col size={7}>
                    <div style={style}>Col-7 </div>
                </Col>
            </Row>

            <Row flexible>
                <Col size={4}>
                    <div style={style}>Col-7 </div>
                </Col>
                <Col size={1}>
                    <div style={style}>Col-2</div>
                </Col>
            </Row>

            <Row flexible>
                <Col size={4}>
                    <div style={style}>Col-4</div>
                </Col>
                <Col size={4}>
                    <div style={style}>Col-4 </div>
                </Col>
            </Row>
        </Grid>
    );
};
