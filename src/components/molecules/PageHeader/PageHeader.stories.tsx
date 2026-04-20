import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import { args, propCategory } from "stories/assets/storybook.globals";

import { Magnifier } from "@geneui/icons";

// Components
import Avatar from "@components/atoms/Avatar";
import Text from "@components/atoms/Text";
import Breadcrumb from "@components/molecules/Breadcrumb";
import PageHeader, { IPageHeaderProps } from "@components/molecules/PageHeader";
import TextField from "@components/molecules/TextField";

const meta: Meta<IPageHeaderProps> = {
    title: "Molecules/PageHeader",
    component: PageHeader,
    subcomponents: { Breadcrumb },
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance }),
        breadcrumbProps: args({ control: "false", ...propCategory.content }),
        children: args({ control: "false", ...propCategory.content }),
        sticky: args({ control: "boolean", ...propCategory.appearance })
    },
    args: {
        sticky: false
    }
};

type Story = StoryObj<IPageHeaderProps>;

const breadcrumbProps = {
    items: [
        { title: "Home", path: "javascript:void(0)" },
        {
            title: "Page Header",
            path: "javascript:void(0)"
        },
        { title: "Nav Item 3", path: "javascript:void(0)" },
        { title: "Nav Item 4", path: "javascript:void(0)" },
        { title: "Nav Item 5", path: "javascript:void(0)" },
        { title: "Nav Item 6", path: "javascript:void(0)" },
        { title: "Nav Item 7", path: "javascript:void(0)" },
        { title: "Nav Item 8", path: "javascript:void(0)" },
        { title: "Nav Item 9", path: "javascript:void(0)" }
    ]
};

export default meta;

export const Default: Story = {
    args: {
        children: <Avatar onClick={() => {}} />,
        breadcrumbProps
    }
};

export const OnlyBreadcrumb: Story = {
    args: {
        breadcrumbProps
    }
};

export const OnlyContent: Story = {
    args: {
        children: <TextField placeholder="Search" onChange={() => null} IconBefore={Magnifier} />
    }
};

export const Sticky: Story = {
    render: (props) => {
        return (
            <div style={{ height: "200vh" }}>
                <PageHeader {...props} />
                <div style={{ padding: "0 16px" }}>
                    <Text as="p" variant="captionLargeMedium">
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Architecto dicta exercitationem facere
                        ipsam neque perferendis quis reprehenderit. Assumenda blanditiis commodi consequuntur corporis
                        culpa deleniti distinctio dolore doloremque ducimus eum exercitationem expedita ipsa nesciunt
                        nisi nulla obcaecati odit officia porro, praesentium quaerat quasi qui quidem reprehenderit
                        veritatis voluptas. Aliquam assumenda aut cupiditate eligendi, esse id illo maiores
                        necessitatibus nisi pariatur praesentium sapiente sequi tenetur ullam velit. Distinctio ea et
                        inventore iste laboriosam libero nisi quod repellendus ut voluptatum. Ad aliquam at commodi
                        cupiditate delectus enim est facilis fugiat ipsa laboriosam omnis, repudiandae, sapiente tempore
                        temporibus voluptatibus? Alias aspernatur commodi consequuntur culpa, dolores doloribus ducimus
                        esse et ex fugiat fugit illo illum incidunt ipsum laudantium molestiae odio odit, officia optio
                        pariatur possimus quia quod ratione sit sunt temporibus vel velit vitae voluptatem voluptatibus.
                        Adipisci, aliquam animi error est harum magni nam officiis similique totam veritatis! Ab,
                        aspernatur cum harum id illum in libero minus nam nihil nobis possimus soluta vero voluptatibus?
                        Ad animi cum dolor illo iure pariatur quas rem vitae. A adipisci eligendi est impedit ipsam
                        laborum minima optio quas, quo repellendus, repudiandae unde vitae voluptatum! Aliquam
                        architecto aspernatur aut autem commodi cum delectus dicta dolore esse est, eveniet
                        exercitationem fuga fugit harum inventore ipsa ipsum iure maiores, nam nesciunt nulla numquam
                        odit officia porro quam quidem quis ratione repellendus saepe veritatis. Distinctio dolorem
                        error fugiat magni, nemo nobis porro possimus quo voluptatum. Aspernatur beatae cum doloribus et
                        illum ipsum, iure laboriosam nemo nobis nostrum numquam obcaecati odit provident quaerat quasi,
                        quibusdam quidem quod ratione rem repudiandae similique tempore ullam voluptates! A aliquam
                        aliquid asperiores commodi consectetur culpa deleniti dolore dolorum ducimus earum, eligendi est
                        excepturi exercitationem explicabo facilis inventore ipsam, iure iusto laboriosam laudantium
                        magnam minima, mollitia non numquam officiis pariatur porro quasi quidem reiciendis saepe sed
                        similique tempora totam unde ut veniam voluptatum. Accusantium alias aliquid aspernatur
                        assumenda autem consectetur consequatur consequuntur dignissimos eaque, error est et fuga in
                        incidunt inventore ipsum magni minus natus nemo nihil nostrum nulla placeat praesentium
                        provident quas quis quisquam quod, recusandae sit tempore temporibus ut vel velit vero
                        voluptatem voluptates, voluptatibus. Architecto assumenda debitis dicta error ipsum non
                        voluptate, voluptatibus! A aliquid, earum hic nesciunt odio omnis possimus repudiandae vel! Amet
                        consequuntur deserunt doloremque facilis modi odit rem veritatis. Atque dignissimos dolor
                        exercitationem ipsam perspiciatis quas voluptatem! Aliquam animi aspernatur consectetur eos ex
                        explicabo hic impedit ipsam modi, natus nesciunt, nihil obcaecati quod repellendus sequi, sunt
                        voluptatem. Deleniti incidunt odit quidem! Ea maxime pariatur quia reiciendis! Aspernatur dicta
                        dignissimos expedita molestias necessitatibus, possimus quasi suscipit tempora! Accusamus
                        assumenda, commodi culpa cumque doloribus molestias possimus qui quis quo reprehenderit saepe
                        tempore voluptate. Ab ducimus expedita natus, placeat quidem recusandae ullam? Accusamus alias
                        assumenda at beatae consequatur delectus dolorem, dolorum eius enim labore laborum maxime
                        nesciunt nulla qui, quidem quo quos ratione, repellat sed sequi sit veritatis voluptatum!
                        Accusantium architecto assumenda consequatur doloribus expedita, incidunt maiores numquam
                        quaerat quod sit, vel, veniam veritatis. Ab aliquam aliquid assumenda consequatur cum dolor
                        dolores eius eligendi enim id illo incidunt inventore itaque, laborum magni molestiae
                        necessitatibus odit provident, quaerat saepe ullam unde voluptate voluptatum. Dolor eligendi
                        enim est nemo, saepe sit vero. Culpa dolor fuga fugit inventore libero, neque odio optio porro
                        sunt tenetur. Doloremque eveniet obcaecati odit omnis quos! A alias amet beatae commodi corporis
                        doloremque ex, facere harum illum in ipsum iste libero maiores maxime necessitatibus nemo quidem
                        sunt suscipit vitae voluptatum? Amet at consectetur consequatur ipsam odio. Accusamus aliquid
                        beatae culpa cum deleniti dicta doloribus eligendi eos error fugit illum ipsam iste laborum
                        laudantium magnam magni maxime minus nostrum officia, praesentium qui quidem quis quos saepe
                        similique suscipit tenetur ullam vel velit veniam? Amet, aperiam beatae blanditiis commodi ex
                        hic iste molestias nesciunt obcaecati quam. Blanditiis corporis culpa, dolorem hic iure, magni
                        numquam pariatur perferendis perspiciatis quasi sapiente totam vel vero. Ab amet cum distinctio
                        dolore ea eius expedita explicabo hic incidunt labore laborum minima nam nostrum, rem repellat
                        sequi unde? A ab aliquam atque delectus dolor doloribus dolorum eaque eos et illum ipsa iusto
                        laborum laudantium modi molestias non odio officiis provident quaerat quibusdam quisquam rem
                        repellat sequi similique sit, totam ullam ut veniam, veritatis voluptates! Deleniti, fugit,
                        pariatur. Atque aut culpa cupiditate facere illo in iste mollitia, perspiciatis quos, recusandae
                        repellat, sunt ut voluptatem. Ad asperiores consectetur cupiditate, fugit, magni minima neque
                        nihil odio perferendis quae reprehenderit sed voluptates voluptatibus. Accusamus aliquam enim
                        est facere itaque mollitia sapiente sed tempore totam, voluptates? Ea harum officia porro unde.
                        Eligendi eveniet facere maiores, maxime minima odio quam qui recusandae ut veritatis? Adipisci
                        asperiores blanditiis consequatur dicta distinctio dolore dolores eius esse eum hic illum,
                        inventore magnam maiores modi molestias mollitia nemo neque, nihil nostrum numquam odit
                        praesentium, provident quaerat quasi quia quis quos recusandae sapiente sint unde vitae
                        voluptatem voluptates voluptatibus. Alias, consectetur consequuntur culpa dolore ducimus eum
                        facilis, illum labore laudantium odit, perspiciatis quam qui repellendus! Accusamus ad animi
                        deserunt dignissimos dolor error ex, excepturi maiores nulla numquam officia perferendis
                        possimus quaerat qui quia quis quisquam quos rem, repellat repudiandae sequi sint voluptate.
                        Commodi consequuntur dicta est, fugiat libero modi molestiae odio rem ut veritatis? Amet dolores
                        et, facere impedit iusto, modi molestiae mollitia perferendis possimus quas quia repudiandae
                        unde voluptatibus. A accusantium aliquid amet aperiam cumque doloribus ex fuga fugit harum illo,
                        impedit iure libero magni nisi pariatur placeat, provident quae recusandae similique
                        voluptatibus. Architecto at harum quos. Assumenda ex id impedit iure officia, quis voluptatum?
                        Asperiores dignissimos facilis ipsam omnis possimus. Ad adipisci animi assumenda beatae, debitis
                        esse facilis inventore ipsa itaque laudantium magni maxime molestiae molestias nesciunt nihil
                        numquam odio quam reprehenderit sit suscipit. Animi aspernatur debitis distinctio dolorem eaque
                        eum exercitationem explicabo impedit itaque modi molestiae necessitatibus nostrum nulla
                        perspiciatis placeat, possimus quaerat quas rem reprehenderit rerum similique unde vel
                        voluptatum. Aliquam blanditiis culpa delectus distinctio dolor dolorem dolores expedita facilis
                        fugit, id iure, mollitia nulla obcaecati optio placeat recusandae reprehenderit repudiandae
                        sequi suscipit veniam. A accusantium laboriosam laborum officia repellendus voluptas voluptatum!
                        Cum debitis enim explicabo minima odio velit!
                    </Text>
                </div>
            </div>
        );
    },
    args: {
        breadcrumbProps,
        sticky: true,
        children: <TextField placeholder="Search" onChange={() => null} IconBefore={Magnifier} />
    }
};
