import React from "react";
import { ReactWrapper, mount } from "enzyme";
// import * as TestsUtils from "react-dom/test-utils";

// Components
import Popover, { IPopoverProps } from "./index";
import GeneUIProvider from "../../providers/GeneUIProvider";
// import Button from "../Button";
// import { correctPosition } from "./Popover";

describe("Popover", () => {
    let setup: ReactWrapper<IPopoverProps>;

    const Component = (
        <Popover size="small" padding={0} setProps={() => {}}>
            <div className="swapComponent" style={{ minHeight: "100%", background: "#F4E1EC" }} />
        </Popover>
    );

    beforeEach(() => {
        setup = mount(Component, {
            wrappingComponent: GeneUIProvider
        });
    });

    // const act = typeof React.act === "function" ? React.act : TestsUtils.act;

    // const provider = () =>
    //     setup.getWrappingComponent().setProps({
    //         children: Component
    //     });

    afterEach(() => {
        setup.unmount();
    });

    it("renders without crashing", () => {
        expect(setup.exists()).toBeTruthy();
    });

    // it("renders children prop correct inside the portal", async () => {
    //     setup.setProps({ alwaysShow: true });
    //     expect(provider().find(".swapComponent").exists()).toBeTruthy();
    // });

    // it("renders title prop correct inside the portal", () => {
    //     const title = "test";
    //     setup.setProps({ alwaysShow: true, title });
    //     expect(provider().find(".popover__header").text()).toBe(title);
    // });

    // it.each<IPopoverProps["size"]>(["xLarge", "large", "medium", "small", "mobile"])(
    //     "renders size prop correct inside the portal",
    //     (size) => {
    //         setup.setProps({ alwaysShow: true, size });
    //         expect(provider().find(`.popover_size_${size}`).exists()).toBeTruthy();
    //     }
    // );

    // it("renders position prop correct inside the portal", async () => {
    //     const position = "top-center";
    //     setup.setProps({ alwaysShow: true, position });
    //     await act(async () => {
    //         await new Promise((resolve) => {
    //             setTimeout(resolve);
    //         });
    //     });
    //     expect(provider().find(".popover_position_top").exists()).toBeTruthy();
    // });
    // it.each<keyof typeof correctPosition>(Object.keys(correctPosition))(

    //     "renders title prop correct inside the portal",

    //     async (position) => {

    //         setup.setProps({ alwaysShow: true, position });
    //         await act(async () => {
    //             await new Promise((resolve) => {
    //                 setTimeout(resolve);
    //             });
    //         });
    //         expect(provider().find(".popover_position_top").exists()).toBeTruthy();
    //     }
    // );
    // it("renders primaryButton prop correct inside the portal", async () => {
    //     setup.setProps({
    //         alwaysShow: true,
    //         primaryButton: {
    //             title: "test",
    //             onClick: () => {}
    //         }
    //     });
    //     expect(provider().find(Button).props().appearance).toBe("primary");
    //     expect(provider().find(Button).props().title).toBe("test");
    // });
    // it("renders secondaryButton prop correct inside the portal", async () => {
    //     setup.setProps({
    //         alwaysShow: true,
    //         primaryButton: { title: "test", onClick: () => {} },
    //         secondaryButton: {
    //             title: "test",
    //             onClick: () => {}
    //         }
    //     });
    //     expect(provider().find(Button).first().props().appearance).toBe("inverse");
    //     expect(provider().find(Button).first().props().title).toBe("test");
    // });
});
