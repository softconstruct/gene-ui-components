import React, { useMemo, useState, useCallback } from 'react';
import PropTypes from 'prop-types';

// Statics
import xlsSvg from '../../../../assets/media/export/xls.svg';
import csvSvg from '../../../../assets/media/export/csv.svg';

// Helpers
import { exportToXLSX, exportToCSV } from '../utils/Export';

// Components
import Paper from '../../../atoms/Paper';
import Button from '../../../atoms/Button';
import Popover from '../../../atoms/Popover';

// Local components
import ExportItem from './Item';

const LOADING_DEFAULT_VALUE = {
    csv: false,
    xls: false
};

function Export({
    fileName,
    isDisable,
    tableColumns,
    getDataForExport,
    exportButtonText,
    xlsIconTooltipText,
    csvIconTooltipText
}) {
    const [loading, setLoading] = useState(LOADING_DEFAULT_VALUE);
    const isLoading = useMemo(() => Object.values(loading).some(Boolean), [loading]);

    const handleConvert = useCallback(
        async (converter, type) => {
            const exportableData = await getDataForExport(type);
            if (exportableData) {
                if (exportableData.data && exportableData.columns) {
                    return await converter(
                        exportableData.name || fileName,
                        exportableData.data,
                        exportableData.columns
                    );
                }
                if (exportableData.length) {
                    return await converter(fileName, exportableData, tableColumns);
                }
            }
        },
        [fileName, getDataForExport, tableColumns]
    );

    const handleLoading = useCallback((type, status) => {
        setLoading((prev) => ({
            ...prev,
            [type]: status
        }));
    }, []);

    const handleStartLoading = useCallback(({ type }) => handleLoading(type, true), [handleLoading]);
    const handleResetLoading = useCallback(({ type }) => handleLoading(type, false), [handleLoading]);

    return (
        <Popover
            align="bottom-end"
            disabled={isDisable}
            extendTargetWidth={false}
            Content={
                <Paper padding="1rem 0" paperDirection="column" className="menu-items-wrapper">
                    <ExportItem
                        type="xls"
                        title="XLS"
                        tooltipTitle={xlsIconTooltipText}
                        icon={<img src={xlsSvg} alt="xls" />}
                        isLoading={loading.xls}
                        onStartLoading={handleStartLoading}
                        onResetLoading={handleResetLoading}
                        converter={({ type }) => handleConvert(exportToXLSX, type)}
                    />
                    <ExportItem
                        type="csv"
                        title="CSV"
                        tooltipTitle={csvIconTooltipText}
                        icon={<img src={csvSvg} alt="csv" />}
                        isLoading={loading.csv}
                        onStartLoading={handleStartLoading}
                        onResetLoading={handleResetLoading}
                        converter={({ type }) => handleConvert(exportToCSV, type)}
                    />
                </Paper>
            }
        >
            <Button
                disabled={isDisable}
                color="primary"
                appearance="minimal"
                itemsDirection="end"
                flexibility="content-size"
                icon={isLoading ? 'bc-icon-loader' : 'bc-icon-arrow-next'}
            >
                {exportButtonText}
            </Button>
        </Popover>
    );
}

Export.propTypes = {
    fileName: PropTypes.string.isRequired,
    exportButtonText: PropTypes.string,
    exportButtonTooltipText: PropTypes.string,
    csvIconTooltipText: PropTypes.string,
    xlsIconTooltipText: PropTypes.string,
    isDisable: PropTypes.bool,
    tableColumns: PropTypes.arrayOf(PropTypes.object).isRequired,
    getDataForExport: PropTypes.func
};

Export.defaultProps = {
    isDisable: false,
    exportButtonText: 'Export',
    exportButtonTooltipText: 'Export',
    csvIconTooltipText: 'Export CSV format',
    xlsIconTooltipText: 'Export XLS format'
};

export default Export;
