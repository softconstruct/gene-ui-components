import React from "react";
import { mount, ReactWrapper } from "enzyme";

import { ArrowRight, ChevronDoubleRight, Download, RecycleBin } from "@geneui/icons";

// Components
import { ISplitButtonProps, SplitButton } from "./index";

describe("SplitButton ", () => {
    let setup: ReactWrapper<ISplitButtonProps>;
    const items = [
        { title: "Replay", Icon: ArrowRight, id: "replay" },
        { title: "Forward", Icon: ChevronDoubleRight, id: "forward" },
        { title: "Download", Icon: Download, id: "download" },
        { title: "Delete", Icon: RecycleBin, id: "delete" }
    ];

    beforeEach(() => {
        setup = mount(<SplitButton appearance="primary" layout="outline" items={items} />);
    });

    it("renders without crashing", () => {
        expect(setup.exists()).toBeTruthy();
    });

    it("renders className prop correctly", () => {
        const className = "test-class";
        const wrapper = setup.setProps({ className });

        expect(wrapper.hasClass(className)).toBeTruthy();
    });

    // Your tests here
});
