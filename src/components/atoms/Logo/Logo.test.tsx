import React from "react";
import { ReactWrapper, mount } from "enzyme";

// Components
import Logo, { ILogoProps } from "./index";
import LogoTypeSVG from "./LogoTypeSVG";
import LogoMarkSVG from "./LogoMarkSVG";

describe("Logo ", () => {
    let setup: ReactWrapper<ILogoProps>;

    beforeEach(() => {
        setup = mount(<Logo svg={LogoTypeSVG} />);
    });

    it("renders without crashing", () => {
        expect(setup.exists()).toBeTruthy();
    });

    it("renders with marksvg prop", () => {
        const type = "logomark";
        const markSvg = LogoMarkSVG;
        setup.setProps({ type, markSvg });
        expect(setup.props().markSvg).toBe(markSvg);
    });

    it.each<ILogoProps["type"]>(["logomark", "logotype"])("should have '%s' type", (type) => {
        setup.setProps({ type });
        expect(setup.find(`.logo__${type}`).exists()).toBeTruthy();
    });

    it.each<ILogoProps["size"]>(["large", "medium", "small"])("should have '%s' size", (size) => {
        setup.setProps({ size });
        const { type = "logotype" } = setup.props();
        expect(setup.find(`logo__${type}_size_${size}`)).toBeTruthy();
    });

    it.each<ILogoProps["appearance"]>(["brand", "secondary", "inverse"])(
        "should have '%s' appearance",
        (appearance) => {
            setup.setProps({ appearance });
            const { type = "logotype" } = setup.props();
            expect(setup.find(`logo__${type}_color_${appearance}`)).toBeTruthy();
        }
    );

    it("renders with custom className", () => {
        const className = "test-class";
        setup.setProps({ className });
        expect(setup.find(".logo").hasClass(className)).toBeTruthy();
    });
});
