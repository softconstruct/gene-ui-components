import React from 'react';
import jsPDF from 'jspdf';
import * as ImageExporter from 'html-to-image';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

//TODO: change file location after tests

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

export type DataType = Record<string, IDataWithStyle | string>;

export type ImageFormats = Exclude<
    keyof typeof ImageExporter,
    'toPixelData' | 'toBlob' | 'toCanvas' | 'toBlob' | 'getFontEmbedCSS'
>;

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

export const pdf = (HTMLelement: HTMLElement, fileName: string = 'document') => {
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
};

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
        alert((error as Error).message);
    }
};

const tableFormats = async (
    data: DataType[],
    header?: Partial<ExcelJS.Column>[],
    fileName: string = 'document',
    type: 'xlsx' | 'csv' = 'xlsx'
) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');

    if (!header) {
        const getHeaderKeys = data.reduce((aggr: string[], val) => {
            aggr = [...Object.keys(val), ...aggr];
            return aggr;
        }, []);
        const createHeder = [...new Set(getHeaderKeys)].reduce((aggr: Record<string, unknown>[], val) => {
            aggr.push({ header: val, key: val });
            return aggr;
        }, []);
        worksheet.columns = createHeder;
    } else {
        worksheet.columns = header;
    }

    const allIndex: Set<Record<string, string | number | IDataWithStyle>> = new Set();
    let transformedStyles = {};
    let allRow: Record<number, ExcelJS.Row> = {};
    data.forEach((items, rowIndex) => {
        let rows = {};
        Object.keys(items).forEach((element, colIndex) => {
            const isObject = typeof items[element] === 'object';
            rows[element] = isObject ? (items[element] as IDataWithStyle).value : items[element];
            allIndex.add({ element: items[element], colIndex: colIndex, rowIndex: rowIndex });
            if (isObject) {
                const currentElement = items[element] as IDataWithStyle;
                transformedStyles = {
                    ...transformedStyles,
                    [currentElement.value]: {
                        ...transformedStyles[currentElement.value],
                        style: currentElement.style
                    }
                };
            }
        });
        const row = worksheet.addRow(rows);
        allRow[rowIndex] = row;
    });

    Object.keys(transformedStyles).forEach((el) => {
        let styles = transformedStyles[el].style;
        transformData.font = {};
        Object.keys(styles).forEach((key) => {
            transformedStyles[el].style = { ...transformedStyles[el].style, ...transformData[key](styles[key]) };
            delete transformedStyles[el].style[key];
        });
    });

    allIndex.forEach((el) => {
        if (typeof el.element === 'object') {
            allRow[el.rowIndex as number].getCell((el.colIndex as number) + 1).style =
                transformedStyles[el.element.value].style;
        }
    });

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
};

export const xlsx = (data: DataType[], header?: Partial<ExcelJS.Column>[], documentName?: string) =>
    tableFormats(data, header, documentName);

export const csv = (data: DataType[], header?: Partial<ExcelJS.Column>[], documentName?: string) =>
    tableFormats(data, header, documentName, 'csv');
