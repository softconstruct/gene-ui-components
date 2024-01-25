import React, { useRef, useCallback } from 'react';

// Helpers
import { stopEvent } from '../../../../utils';

// Components
import Icon from '../../../atoms/Icon';
import Paper from '../../../atoms/Paper';
import Option from '../../../atoms/Option';
import Tooltip from '../../../molecules/Tooltip';

function ExportItem({
    type,
    icon,
    title,
    isLoading,
    converter,
    onResetLoading,
    onStartLoading,
    tooltipTitle,
    ...props
}) {
    const isPossibly = useRef(true);
    const isCanceled = useRef(false);

    const handleStart = useCallback(() => {
        isCanceled.current = false;
        onStartLoading({ type });
    }, [type]);

    const handleFinish = useCallback(() => {
        isCanceled.current = false;
        isPossibly.current = true;
        onResetLoading({ type });
    }, [type]);

    const handleCancel = useCallback(
        (event) => {
            stopEvent(event);
            isCanceled.current = true;
            onResetLoading({ type });
        },
        [type]
    );

    const handleExport = useCallback(async () => {
        if (!isLoading) {
            handleStart();
            if (isPossibly.current) {
                isPossibly.current = false;
                const exportData = await converter({ type });
                !isCanceled.current && exportData();
                handleFinish();
            }
        }
    }, [type, isCanceled, isPossibly, converter]);

    return (
        <Option
            title={title}
            onClick={handleExport}
            leftCustomElement={!!icon && <Tooltip title={tooltipTitle}>{icon}</Tooltip>}
            rightCustomElement={
                isLoading && (
                    <Paper isTransparent>
                        <Icon type="bc-icon-loader" />
                        <Icon type="bc-icon-cancel" onClick={handleCancel} />
                    </Paper>
                )
            }
            {...props}
        />
    );
}

export default ExportItem;
