import React, { FC, useRef } from "react";

// Components
import Text from "@components/atoms/Text";
import Tooltip from "@components/molecules/Tooltip";

// Hooks
import useEllipsisDetection from "@hooks/useEllipsisDetection";

interface INavigationMenuHeaderProps {
    title?: string;
}

const NavigationMenuHeader: FC<INavigationMenuHeaderProps> = ({ title }) => {
    const textRef = useRef<HTMLHeadingElement | null>(null);
    const isTruncated: boolean = useEllipsisDetection(textRef, [title]);

    return title ? (
        <div className="navigation__header">
            <Tooltip text={title} isVisible={isTruncated}>
                <Text as="h3" variant="labelMediumSemibold" className="ellipsis-text" ref={textRef}>
                    {title}
                </Text>
            </Tooltip>
        </div>
    ) : null;
};

export default NavigationMenuHeader;
