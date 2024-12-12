import React from "react";
import { ReactWrapper, mount } from "enzyme";

// Components
import Logo, { ILogoProps } from "./index";

describe("Logo ", () => {
    let setup: ReactWrapper<ILogoProps>;

    beforeEach(() => {
        setup = mount(<Logo />);
    });

    it("renders without crashing", () => {
        expect(setup.exists()).toBeTruthy();
    });

    it("renders className prop correctly", () => {
        const className = "test-class";
        const wrapper = setup.setProps({ className });

        expect(wrapper.hasClass(className)).toBeTruthy();
    });

    it.each<ILogoProps["type"]>(["logomark", "logotype"])(
        "renders correct SVG for `type` prop",
        (type = "logomark") => {
            const wrapper = setup.setProps({ type });
            expect(wrapper.find(`.logo__${type}`).exists()).toBeTruthy();
        }
    );

    it.each<ILogoProps["size"]>(["large", "medium", "small"])("applies correct class based in `size` prop", (size) => {
        const wrapper = setup.setProps({ type: "logotype", size });
        expect(wrapper.find(".logo__logotype").hasClass(`logo__logotype_size_${size}`)).toBeTruthy();

        wrapper.setProps({ type: "logomark" });
        expect(wrapper.find(".logo__logomark").hasClass(`logo__logomark_size_${size}`)).toBeTruthy();
    });

    it.each<ILogoProps["appearance"]>(["brand", "secondary", "inverse"])(
        "applies correct class based on `appearance` prop",
        (appearance) => {
            const wrapper = setup.setProps({ type: "logomark", appearance });
            expect(wrapper.find(".logo__logomark").hasClass(`logo__logomark_color_${appearance}`)).toBeTruthy();

            wrapper.setProps({ type: "logotype" });
            expect(wrapper.find(".logo__logotype").hasClass(`logo__logotype_color_${appearance}`)).toBeTruthy();
        }
    );
});
