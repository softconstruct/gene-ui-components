import React, { FC } from "react";

// Components
import Text from "@components/atoms/Text";

interface ILimitProps {
    label?: string;
    limit?: string;
}

const Limit: FC<ILimitProps> = ({ label = "Limit", limit = "0" }) => {
    return (
        <div className="globalHeader__limitWrapper">
            <Text as="span" className="globalHeader__limitLabel">
                {label}
            </Text>
            <Text as="span" className="globalHeader__separator">
                -
            </Text>
            <Text as="span" className="globalHeader__limitAmount">
                {limit}
            </Text>
        </div>
    );
};

export { ILimitProps, Limit as default };
