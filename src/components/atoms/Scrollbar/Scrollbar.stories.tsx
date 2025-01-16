import React, { FC } from "react";
import { Meta } from "@storybook/react";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";

// Components
import Scrollbar, { IScrollbarProps } from "./index";

const meta: Meta<typeof Scrollbar> = {
    title: "Atoms/Scrollbar",
    component: Scrollbar,
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance }),
        children: args({ control: "false", ...propCategory.content }),
        autoScrollTopTo: args({ control: "number", ...propCategory.functionality }),
        autoScrollLeftTo: args({ control: "number", ...propCategory.functionality }),
        onScroll: args({ control: "false", ...propCategory.action }),
        customHeight: args({ control: "text", ...propCategory.appearance }),
        customWidth: args({ control: "text", ...propCategory.appearance })
    },
    args: {
        onScroll: undefined
    } as IScrollbarProps
};

export default meta;

const Template: FC<IScrollbarProps> = (props) => {
    return (
        <div style={{ height: "200px", width: "400px", fontSize: "16px" }}>
            <Scrollbar {...props}>
                Lorem ipsum dolor sit ametametametametametametametametametametamet, consectetur adipiscing elit.
                Vestibulum vel semper dolor. Etiam consequat eget lorem sit amet tempor. Mauris at dolor bibendum,
                vehicula lorem sed, facilisis sapien. Suspendisse eget erat non odio lacinia ultricies. Cras viverra
                ipsum sed enim pulvinar rutrum. Sed vitae lacinia augue, ut lacinia purus. Mauris ac est tortor. Nunc
                vehicula fringilla ullamcorper. Phasellus vulputate, sem in pellentesque consectetur, ex nisl ultricies
                risus, accumsan bibendum orci justo ac ante. Sed sodales ut nisi sit amet sodales. Aliquam ex diam,
                posuere non ipsum eget, iaculis condimentum arcu. Curabitur vitae velit turpis. Orci varius natoque
                penatibus et magnis dis parturient montes, nascetur ridiculus mus. Pellentesque fringilla consequat
                nibh, in rutrum dui auctor non. Nam mollis sed arcu non iaculis. Cras tincidunt ex quis urna elementum,
                id pretium erat dignissim. Duis sed consectetur mi, sed pulvinar nisl. Phasellus feugiat mattis pretium.
                Pellentesque suscipit hendrerit augue eu pellentesque. Proin tincidunt ultrices ultrices. Curabitur eu
                ipsum vitae lectus euismod dictum. Phasellus tristique suscipit dolor, eget ullamcorper dolor
                pharetrapharetrapharetrapharetrapharetrapharetrapharetrapharetrapharetrapharetrapharetrapharetra sit
                amet. Morbi tincidunt lectus eu mi porta sagittis. Donec id ullamcorper sem. Pellentesque maximus urna
                in luctus convallis. Nam sit amet elementum velit. Duis dignissim lacus vitae quam scelerisque
                tristique. Fusce egestas dolor justo, quis sagittis arcu gravida a. Proin ac purus placerat, cursus odio
                et, tempus purus. Suspendisse vel faucibus nulla. Nam lobortis dignissim massa, suscipit aliquet quam
                dignissim nec. Nunc cursus blandit faucibus. Donec sed orci sagittis, malesuada dui nec, iaculis dui.
                Duis imperdiet nisi iaculis, placerat mi id, posuere sem. Donec efficitur congue libero, sed viverra leo
                accumsan sed. Cras interdum, ante posuere faucibus pharetra, sapien risus tincidunt elit, sed varius
                quam felis vitae libero. Aliquam non vulputate quam. Donec finibus sapien sit amet laoreet interdum.
                Nulla eu elit augue. Integer ut nibh faucibus justo ornare euismod eget non lorem. Nam euismod, libero
                nec pharetra pharetra, tortor ipsum posuere lorem, vitae egestas nunc ipsum quis dui. Aenean pulvinar
                ante magna, suscipit commodo massa varius a. Pellentesque lacinia egestas tincidunt. Phasellus eu risus
                diam. Phasellus in orci quis risus pellentesque consectetur. Sed pulvinar a massa eu consequat. Etiam
                vel blandit dolor. Integer blandit id enim vitae feugiat. Etiam velit ipsum, dapibus non nisl nec,
                feugiat posuere diam. Nullam iaculis velit eu justo elementum iaculis. Vivamus pharetra risus
                scelerisque justo condimentum volutpat. Duis velit neque, lobortis fermentum varius vel, bibendum vitae
                augue. Ut in felis non ligula volutpat tempus vitae a ipsum. Nulla eleifend, dolor non scelerisque
                ultrices, mi nisi pretium tortor, a efficitur urna odio ut justo. Nunc vel elit id tellus convallis
                tempus. Fusce efficitur est viverra magna facilisis, eget tristique magna lobortis. Duis magna lectus,
                fermentum quis ornare sit amet, rutrum nec urna. Vestibulum suscipit lobortis augue eu rutrum. Cras id
                fermentum erat. Aliquam erat volutpat.
            </Scrollbar>
        </div>
    );
};

export const Default = Template.bind({});

Default.args = {} as IScrollbarProps;
