import React, { FC } from "react";

// Components
import Divider from "@components/atoms/Divider";

import { IProductsMainSectionProps, ProductsMainSection } from "./index";

const ProductsSecondarySection: FC<IProductsMainSectionProps> = ({ children }) => {
    return (
        <>
            <Divider />
            <ProductsMainSection>{children}</ProductsMainSection>
        </>
    );
};

export { ProductsSecondarySection as default };
