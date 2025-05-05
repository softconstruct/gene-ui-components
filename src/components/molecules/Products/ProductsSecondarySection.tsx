import React, { FC } from "react";

// Components
import Divider from "@components/atoms/Divider";

import { IProductsMainSectionProps, ProductsMainSection } from "./index";

const ProductsSecondarySection: FC<IProductsMainSectionProps> = ({ className, children }) => {
    return (
        <>
            <Divider />
            <ProductsMainSection className={className}>{children}</ProductsMainSection>
        </>
    );
};

export { ProductsSecondarySection as default };
