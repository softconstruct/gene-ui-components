import FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

const createFile = async (file, fileName, format) => {
    const blobFile = new Blob([file], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    return () => FileSaver.saveAs(blobFile, `${fileName}.${format}`);
};

const jsonToSheet = (json) => {
    const ws = XLSX.utils.json_to_sheet(json);

    new Set(Object.keys(ws).map((key) => key.replace(/\d+/g, ''))).forEach((key) => {
        if (key !== '!ref') {
            ws[`${key}1`].s = {
                fill: {
                    bgColor: { rgb: '000000' }
                },
                font: {
                    bold: true,
                    color: { rgb: 'ffffff' }
                }
            };
        }
    });

    return ws;
};

const exportToXLSX = async (fileName, data, columns) => {
    const formattedData = data.map((item) =>
        columns.reduce((acc, cur) => {
            if (cur.text && !cur.exportDisabled) {
                return {
                    ...acc,
                    [cur.text]: item[cur.dataKey]
                };
            }
            return acc;
        }, {})
    );

    const wb = {
        Sheets: { data: jsonToSheet(formattedData) },
        SheetNames: ['data']
    };

    const file = XLSX.write(wb, {
        bookType: 'xlsx',
        type: 'array',
        cellStyles: true
    });

    return await createFile(file, fileName, 'xlsx');
};

const ifNeededQuote = (str) => (String(str).includes(',') ? `"${str}"` : String(str));

const exportToCSV = async (fileName, data, columns) => {
    const columnsNames = columns
        .filter((col) => !col.exportDisabled)
        .map((col) => col.text)
        .join(',');
    const rows = data.map((row) =>
        columns
            .filter((col) => !col.exportDisabled)
            .map((col) => (row[col.dataKey] ? ifNeededQuote(row[col.dataKey]) || '' : ' '))
            .join(',')
    );
    const file = `\uFEFF${[columnsNames, ...rows].join('\n')}`;

    return await createFile(file, fileName, 'csv');
};

export { exportToCSV, exportToXLSX };
