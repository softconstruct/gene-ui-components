import React, { PropsWithChildren } from "react";
import { ReactWrapper, mount } from "enzyme";

// Components
import Grid from "./index";

const { Col, GridContainer, Row } = Grid;

describe("Grid ", () => {
    let setup: (children: PropsWithChildren) => ReactWrapper<unknown>;

    beforeEach(() => {
        setup = ({ children }: PropsWithChildren) => mount(<GridContainer>{children}</GridContainer>);
    });

    it("renders without crashing", () => {
        const component = setup({ children: <Col size={2} /> });
        expect(component.exists()).toBeTruthy();
    });

    it("renders with prop size for component Col", () => {
        const size = 2;
        const component = setup({
            children: (
                <Row>
                    <Col size={size} />
                </Row>
            )
        });
        expect(component.find(`.col-${size}`).exists()).toBeTruthy();
    });

    it("renders with prop offset for component Col", () => {
        const offset = 2;
        const component = setup({
            children: (
                <Row>
                    <Col offset={offset} size={2} />
                </Row>
            )
        });
        expect(component.find(`.col-offset-${offset}`).exists()).toBeTruthy();
    });

    it("renders with prop flexible for component Row", () => {
        const component = setup({
            children: <Row flexible />
        });
        expect(component.find(`.flexible`).exists()).toBeTruthy();
    });
});
