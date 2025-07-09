import React, { FC } from "react";
import classNames from "classnames";

// Components
import Text from "@components/atoms/Text";

interface ILimitProps {
    label?: string;
    limit?: string | number;
    isMobile?: boolean;
}

const Limit: FC<ILimitProps> = ({ label = "Limit", limit = "0", isMobile }) => {
    return (
        <div className="globalHeader__limit">
            <Text
                as="span"
                variant="labelMediumSemibold"
                className={classNames({ globalHeader__limit_label: isMobile })}
            >
                {isMobile ? label : `${label} -`}
            </Text>
            <Text
                as="span"
                variant="labelMediumSemibold"
                className={classNames({ globalHeader__limit_limit: isMobile })}
            >
                {limit.toString()}
            </Text>
        </div>
    );
};

export { ILimitProps, Limit as default };
