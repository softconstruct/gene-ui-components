import React, { FC } from "react";
import classNames from "classnames";

import { Download, Eye, Tag, ThreeDotsHorizontal } from "@geneui/icons";

import Button from "@components/atoms/Button";
import Text from "@components/atoms/Text";
import ButtonGroup from "@components/molecules/ButtonGroup";
import Checkbox from "@components/molecules/Checkbox";

// Styles
import "./Image.scss";
// import Loader from "@components/atoms/Loader";
// eslint-disable-next-line import/no-extraneous-dependencies
// import { ImageIcon } from "lucide-react";

interface IImageProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    // fill Image component props interface
}

/**
 * The Image Component is used to display visual content within an interface. It supports various image formats, sizes, and ratios, allowing for responsive and accessible image handling.
 */
const Image: FC<IImageProps> = ({ className }) => {
    return (
        // Size - .image_size_1x1, .image_size_3x2, .image_size_2x1, .image_size_16x9
        // Failed state - .image_failed
        <article className={classNames("image image_size_3x2", className)}>
            <div className="image__body">
                <button type="button" className="image__preview">
                    <img className="image__img" src="https://picsum.photos/id/849/500/500" alt="" />
                    <span className="image__content">
                        <Eye className="image__overlay" size={20} />
                        {/* <Loader className="image__loader" size="large" text="Loading" textPosition="below" /> */}
                        {/* <ImageIcon className="image__error" size={24} /> */}
                    </span>
                </button>
                <Checkbox className="image__checkbox" />
            </div>
            <div className="image__footer">
                <div className="image__info">
                    <Text as="h3" variant="labelMediumSemibold">
                        Title
                    </Text>
                    <Text as="p" variant="bodyMediumRegular">
                        Description
                    </Text>
                </div>
                <ButtonGroup className="image__actions" size="small">
                    <Button appearance="secondary" layout="text" Icon={Download} />
                    <Button appearance="secondary" layout="text" Icon={Tag} />
                    <Button appearance="secondary" layout="text" Icon={ThreeDotsHorizontal} />
                </ButtonGroup>
            </div>
        </article>
    );
};

export { IImageProps, Image as default };
