import React, { FC } from "react";

// Components
import Text from "@components/atoms/Text";

interface ILimitProps {
    label?: string;
    limit?: string;
}

const Limit: FC<ILimitProps> = ({ label = "Limit", limit = "0" }) => {
    return (
        <div className="globalHeader__limit">
            <Text as="span" variant="labelMediumSemibold" truncate>
                {`${label} -`}
            </Text>
            <Text as="span" variant="labelMediumSemibold">
                {limit}
            </Text>
        </div>
    );
};

export { ILimitProps, Limit as default };
