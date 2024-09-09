import React from 'react';
import jsPDF from 'jspdf';
import * as ImageExporter from 'html-to-image';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import autoTable, { ColumnInput } from 'jspdf-autotable';
//TODO: change file location after tests

export const exportToTablePdf = (
    data: Record<string, string>[],
    columns?: Record<string, unknown>[],
    fileName: string = 'document'
) => {
    try {
        const doc = new jsPDF({
            format: 'letter'
        });

        const pdfColumns = columns
            ? columns.map((column) => ({ header: column.header, dataKey: column.key }))
            : data
                  .reduce((aggr: string[], val) => {
                      aggr = [...aggr, ...Object.keys(val)];
                      return aggr;
                  }, [])
                  .map((el) => ({ header: el, dataKey: el }));

        autoTable(doc, {
            columns: [...new Set(pdfColumns)] as ColumnInput[],
            body: data
        });

        doc.save(`${fileName}.pdf`);
    } catch (error) {
        return error;
    }
};

export const pdf = (HTMLelement: HTMLElement, fileName: string = 'document') => {
    try {
        const doc = new jsPDF({
            format: 'a4',
            unit: 'px'
        });

        doc.html(HTMLelement, {
            callback(doc) {
                doc.save(fileName);
            },
            x: 10,
            y: 10
        });
    } catch (error) {
        return error;
    }
};

export type ImageFormats = 'toPng' | 'toJpeg';
export const exportImage = async (
    HTMLelement: HTMLElement,
    format: ImageFormats = 'toPng',
    fileName: string = 'document'
) => {
    try {
        const request = await ImageExporter[format](HTMLelement, { cacheBust: true, height: 1000 });
        const link = document.createElement('a');
        link.download = fileName;
        link.href = request;
        link.click();
    } catch (error) {
        return error;
    }
};

interface IDataWithStyle {
    style: {
        fontSize?: number;
        color?: `#${string}`;
        bold?: boolean;
        italic?: boolean;
        underline?: boolean;
        background?: `#${string}`;
    };
    value: string | number;
}
export interface ITableHeader extends Partial<Omit<ExcelJS.Column, 'style'>> {
    style?: IDataWithStyle['style'];
    header: string;
    key: string;
}
export type DataType = Record<string, IDataWithStyle | string>;

type AllIndexType = Set<Record<string, string | number | IDataWithStyle>>;

const transformData = {
    font: {} as Record<string, unknown>,
    fontSize(size: number) {
        this.font.size = size;

        return { font: this.font };
    },
    color(color: `#${string}`) {
        if (!this.font.color) {
            this.font.color = {};
        }
        this.font.color = { argb: color.replace('#', '') };
        return { font: this.font };
    },
    bold(isBold: boolean) {
        this.font.bold = isBold;
        return { font: this.font };
    },
    italic(isItalic: boolean) {
        this.font.italic = isItalic;
        return { font: this.font };
    },
    underline(isUnderline: boolean) {
        this.font.underline = isUnderline;
        return { font: this.font };
    },
    background: (color: `#${string}`) => ({
        fill: {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: color.replace('#', '') }
        }
    })
};
const tableFormats = async (
    data: DataType[],
    header?: ITableHeader[],
    fileName: string = 'document',
    type: 'xlsx' | 'csv' = 'xlsx'
) => {
    try {
        let transformedStyles = {};

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet();
        const allRows: Record<number, ExcelJS.Row> = {};
        const dataFromHeader: string[] = [];
        const allIndex: AllIndexType = new Set();

        const transformedData = (transformedStyles: Record<string, Record<string, IDataWithStyle['style']>>) => {
            Object.keys(transformedStyles).forEach((el) => {
                let styles = transformedStyles[el].style;
                transformData.font = {};
                Object.keys(styles).forEach((key) => {
                    if (typeof transformData[key] === 'function') {
                        transformedStyles[el].style = {
                            ...transformedStyles[el].style,
                            ...transformData[key](styles[key])
                        };
                    }
                    delete transformedStyles[el].style[key];
                });
            });
        };
        const transformAllIndex = (allIndex: AllIndexType) => {
            allIndex.forEach((el) => {
                if (typeof el.element === 'object') {
                    allRows[el.rowIndex as number].getCell(el.colIndex as number).style =
                        transformedStyles[el.element.value].style;
                }
            });
        };
        const fillTransformedStyles = (key: string | number, style: IDataWithStyle['style']) => {
            transformedStyles = {
                ...transformedStyles,
                [key]: {
                    ...transformedStyles[key],
                    style
                }
            };
        };

        if (!header) {
            const createHeder = data
                .reduce((aggr: string[], val) => {
                    aggr = [...aggr, ...Object.keys(val)];
                    return aggr;
                }, [])
                .map((val) => {
                    dataFromHeader.push(val);
                    return { header: val, key: val };
                });

            worksheet.columns = [...new Set(createHeder)];
        } else {
            const headerWithoutStyles = header.map((el) => {
                dataFromHeader.push(el.key!);
                if (el.style && el.key) {
                    fillTransformedStyles(el.key, el.style);
                }
                return el;
            });
            transformedData(transformedStyles);
            worksheet.columns = headerWithoutStyles as Partial<ExcelJS.Column>[];
            worksheet.getRow(1).eachCell((cell, colNumber) => {
                const getCol = worksheet.getColumn(colNumber);
                if (getCol.key && transformedStyles.hasOwnProperty(getCol.key)) {
                    cell.style = { ...cell.style, ...transformedStyles[getCol.key].style };
                }
            });
        }
        data.forEach((items, rowIndex) => {
            let rows = {};
            dataFromHeader.forEach((element, colIndex) => {
                const isObject = typeof items[element] === 'object';
                rows[element] = isObject ? (items[element] as IDataWithStyle).value : items[element];
                allIndex.add({ element: items[element], colIndex: colIndex + 1, rowIndex: rowIndex });

                if (isObject) {
                    const currentElement = items[element] as IDataWithStyle;
                    fillTransformedStyles(currentElement.value, currentElement.style);
                }
            });
            const row = worksheet.addRow(rows);
            allRows[rowIndex] = row;
        });
        transformedData(transformedStyles);
        transformAllIndex(allIndex);
        let buffer: ExcelJS.Buffer;
        if (type === 'csv') {
            buffer = await workbook.csv.writeBuffer();
        } else {
            buffer = await workbook.xlsx.writeBuffer();
        }
        const blob = new Blob([buffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });
        saveAs(blob, `${fileName}.${type}`);
    } catch (error) {
        return error;
    }
};

export const xlsx = (data: DataType[], header?: ITableHeader[], documentName?: string) =>
    tableFormats(data, header, documentName);
export const csv = (data: DataType[], header?: ITableHeader[], documentName?: string) =>
    tableFormats(data, header, documentName, 'csv');
