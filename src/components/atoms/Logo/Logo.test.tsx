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

    it("renders with default props correctly", () => {
        expect(setup.find(".logo__logotype").hasClass("logo__logotype_size_medium")).toBeTruthy();
        expect(setup.find(".logo__logotype").hasClass("logo__logotype_color_brand")).toBeTruthy();
    });

    it.each<ILogoProps["type"]>(["logomark", "logotype"])("applies correct type class for type prop", (type) => {
        const svg = type === "logomark" ? LogoMarkSVG : LogoTypeSVG;
        setup.setProps({ type, svg });
        expect(setup.find(`.logo__${type}`).exists()).toBeTruthy();
    });

    it.each<ILogoProps["size"]>(["large", "medium", "small"])("applies correct size class for size prop", (size) => {
        setup.setProps({ size });
        const { type = "logotype" } = setup.props();
        expect(setup.find(`.logo__${type}`).hasClass(`logo__${type}_size_${size}`)).toBeTruthy();
    });

    it.each<ILogoProps["appearance"]>(["brand", "secondary", "inverse"])(
        "applies correct appearance class for appearance prop",
        (appearance) => {
            setup.setProps({ appearance });
            const { type = "logotype" } = setup.props();
            expect(setup.find(`.logo__${type}`).hasClass(`logo__${type}_color_${appearance}`)).toBeTruthy();
        }
    );

    it("renders with custom className", () => {
        const className = "test-class";
        setup.setProps({ className });
        expect(setup.find(".logo").hasClass(className)).toBeTruthy();
    });
});
