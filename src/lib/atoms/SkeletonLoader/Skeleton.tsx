import React, { CSSProperties, FC, PropsWithChildren } from 'react';
import Loader, { SkeletonProps, SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import classNames from 'classnames';

// Styles
import './index.scss';

type Enumerate<N extends number, Acc extends number[] = []> = Acc['length'] extends N
    ? Acc[number]
    : Enumerate<N, [...Acc, Acc['length']]>;

type IntRange<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>>;

export interface IData extends SkeletonProps {
    col?: IntRange<1, 13>;
    styles?: CSSProperties;
    children?: IData[];
    gap?: boolean;
    row?: boolean;
    className?: string;
    circleSize?: number;
}

export interface ISkeletonProps extends Partial<PropsWithChildren> {
    /**
     * Specify how many shapes need to be displayed
     */
    isBusy: boolean;
    /**
     * This is the main pattern for cutting skeletons. This is an array of Objects with properties.
     * <br>
     *<code> {row:true}</code> means that the block will be on one line (if there is no row, it automatically becomes col).
     *He also get prop style it's  standard css  property's.<br>
     *Col are the columns in which the element is located.<br>
     *They can be from 1 to 12 where 12 will be the entire width of the block
     * (depending on the width of the parent․ If the parent has 10 then the children, when setting the value 12, will have a maximum of 10 relative to the parent).<br>
     * The children property takes the same parameters it is drawn in the parent component and is resolved using recursion in the parent block.
     */
    data?: IData[];
    /**
     * Displaying shaped can be specified by duration(in seconds)
     */
    duration?: number;
}

const defaultData: IData[] = [
    {
        row: true,
        style: {
            width: '100%'
        },
        children: [
            {
                col: 12,
                circle: false
            }
        ]
    }
];

const Skeleton: FC<ISkeletonProps> = ({ children, isBusy = false, data = defaultData, duration }) =>
    isBusy ? (
        <>
            {data?.map((el, i) => {
                const { className, ...props } = el;

                const circleSize = props.circleSize ? { width: props.circleSize, height: props.circleSize } : {};

                return (
                    <div
                        className={classNames(props.row ? 'row' : props.col ? `col-${props.col}` : 'col', className)}
                        style={{
                            ...props?.style
                        }}
                        key={i}
                    >
                        <SkeletonTheme>
                            {el.children ? (
                                <Skeleton duration={duration} data={el.children} isBusy={isBusy} children={children} />
                            ) : (
                                !el.gap && (
                                    <Loader
                                        {...props}
                                        containerClassName={'wrapper-container'}
                                        circle={Boolean(props.circleSize) || el.circle}
                                        style={{ ...props?.style, ...circleSize }}
                                        inline
                                        duration={duration}
                                    />
                                )
                            )}
                        </SkeletonTheme>
                    </div>
                );
            })}
        </>
    ) : (
        children
    );

export default Skeleton;
