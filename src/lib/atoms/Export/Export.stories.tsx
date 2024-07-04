import React, { useRef, useState } from 'react';

// Helpers
import { args } from '../../../../stories/assets/storybook.globals';
import * as ExportHelper from './exportHelper';
import Button from '../Button/Button';
import InteractiveWidget from '../../molecules/InteractiveWidget/InteractiveWidget';
import RichEditor from '../../organisms/RichEditor';
import toHtml from 'string-to-html'; // Components
import ColumnChart from '../../molecules/Charts/ColumnChart';
const meta = {
    title: 'Atoms/Export',
    argTypes: {},
    args: {}
};

export default meta;

export const ExelFormats = () => {
    const [currentFunction, setCurrentFunction] = useState<'xls' | 'csv' | 'xlsx'>('xlsx');
    const createExel: ExportHelper.DataType[] = [
        {
            test1: {
                value: 'TestWithStyle',
                style: {
                    bold: true,
                    color: '#7ad165',
                    fontSize: 18,
                    italic: true
                }
            },
            test2: 'test',
            test3: 'test'
        },
        {
            test1: 'test',
            test2: 'test',
            test3: {
                value: 'Styled value',
                style: {
                    background: '#e33832',
                    fontSize: 5
                }
            }
        }
    ];

    const exportHandler = () => {
        ExportHelper[currentFunction](createExel, [
            { header: 'test1', key: 'test1' },
            { header: 'test2', key: 'test2' },
            { header: 'test3', key: 'test3' }
        ]);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', width: 500, height: 500 }}>
            <div>
                <pre> {JSON.stringify(createExel, null, 2)} </pre>
            </div>{' '}
            <select
                style={{ border: '2px solid black', margin: 10 }}
                //@ts-ignore
                onChange={(e) => setCurrentFunction(e.target.value)}
            >
                <option defaultChecked>xlsx</option>
                <option>csv</option>
            </select>
            <Button onClick={exportHandler} flexibility={'default'}>
                trigger
            </Button>{' '}
        </div>
    );
};

export const ExportAsImage = () => {
    const ref = useRef<null | HTMLDivElement>(null);
    const [imageType, setImageType] = useState<ExportHelper.ImageFormats>('toJpeg');

    const exportHandler = () => {
        if (ref.current) {
            ExportHelper.exportImage(ref.current, imageType);
        }
    };

    return (
        <>
            <div ref={ref}>
                <div style={{ display: 'flex', maxWidth: '100%', justifyContent: 'space-between', gap: '1rem' }}>
                    <InteractiveWidget title="test   " description="test2" style={{ maxWidth: '50%' }} {...args} />
                    <InteractiveWidget title="test" style={{ maxWidth: '50%' }} {...args} />
                </div>
                <div style={{ display: 'flex', maxWidth: '100%', margin: '1rem 0' }}>
                    <InteractiveWidget
                        switcherProps={{}}
                        title="test"
                        description="test3"
                        withBorder={false}
                        {...args}
                        onClick={undefined}
                    />
                </div>
                <div
                    style={{
                        display: 'flex',
                        maxWidth: '100%',
                        justifyContent: 'space-between',
                        gap: '1rem',
                        margin: '10px'
                    }}
                >
                    <InteractiveWidget
                        style={{ maxWidth: '50%' }}
                        withBorder={false}
                        switcherProps={{}}
                        {...args}
                        title="test"
                        description="test4"
                        onClick={undefined}
                    />
                    <InteractiveWidget
                        style={{ maxWidth: '50%' }}
                        withBorder={false}
                        switcherProps={{}}
                        title="test"
                        description="test5"
                        onClick={undefined}
                    />
                </div>
                {/**@ts-ignore */}
                <ColumnChart
                    min={0}
                    max={250}
                    categories={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']}
                    data={[80, 1, 120, 220, 80, 130, 60]}
                />
            </div>
            <select
                style={{ border: '2px solid black', margin: 10 }}
                /**@ts-ignore */
                onChange={(e) => setImageType(e.target.value)}
            >
                <option defaultChecked>toJpeg</option>
                <option>toSvg</option>
                <option>toPng</option>
            </select>

            <Button onClick={exportHandler} flexibility={'default'}>
                Export
            </Button>
        </>
    );
};

export const ExportAsPdf = () => {
    const ref = useRef<HTMLDivElement | null>(null);

    const exportHandler = () => {
        if (ref.current) {
            ExportHelper.pdf(ref.current);
        }
    };
    const getData = (e) => {
        const div = document.createElement('div');
        div.style.width = '400px';
        div.style.margin = '5px';
        div.appendChild(toHtml(e));
        ref.current = div;
    };
    return (
        <div>
            {/**@ts-ignore */}
            <RichEditor
                value={`ipsum dolor sit amet consectetur, adipisicing elit. Quo debitis laboriosam ducimus odio earum, voluptatem natus dolor consequatur sint totam, neque incidunt enim nobis ab sequi praesentium quaerat nam saepe!
Sunt porro earum praesentium error provident quisquam qui exercitationem iusto modi impedit laudantium, minus eveniet commodi sit quae ratione accusantium excepturi amet deserunt. Provident veniam blanditiis nam, eligendi nostrum eum.
Quasi, repellendus? Pariatur incidunt, placeat dolores eligendi commodi neque quo quae mollitia eveniet temporibus impedit magnam culpa exercitationem adipisci suscipit illum voluptatum fuga dignissimos tempore maxime dicta libero. Adipisci, id?   `}
                onChange={getData}
            />
            {/**@ts-ignore */}
            <Button onClick={exportHandler}> Export </Button>
        </div>
    );
};
