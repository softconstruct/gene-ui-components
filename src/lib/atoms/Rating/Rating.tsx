import React, {
    FC,
    HTMLAttributes,
    MouseEvent,
    ReactNode,
    cloneElement,
    isValidElement,
    useEffect,
    useLayoutEffect,
    useState,
    JSX
} from 'react';
import classNames from 'classnames';

// Components
import SvgSquareIcon from './DefaultSvg';
// Styles
import './Rating.scss';

const sizes = { small: 32, medium: 36, big: 42 };

export interface IRatingProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
    /**
     * The default rating value is selected when the component is first rendered.
     */
    defaultValue?: number;

    /**
     * The currently selected rating value. Use this to control the component from the outside.<br>
     * If this prop is used the component will lose default behavior related to rating state.
     */
    value?: number;

    /**
     * The number of rating elements to render.
     */
    count?: number;

    /**
     * The icon or character used to represent each rating element.<br>
     * It can be a `React functional component`, `string`, `number`, or a `function` that returns a React node.<br>
     * Possible values: `FC | string | number | ((i: number) => ReactNode)`
     */
    character?: FC | string | number | ((i: number) => ReactNode);

    /**
     * The color is used for the rating elements when hovered over or selected.
     */
    color?: string;

    /**
     * The background color of the rating elements.
     */
    bgColor?: string;

    /**
     * Allows users to select half values in the rating component, enabling finer granularity.<br>
     * For example, if `count` is 5, users can select 1, 1.5, 2, 2.5, and so on up to 5.
     */
    halfAllow?: boolean;

    /**
     * When set to `true`, the rating component becomes read-only, preventing any interaction.
     */
    readonly?: boolean;

    /**
     * The size of the rating elements.<br>
     * Possible values: `small | medium | big`
     */
    size?: 'small' | 'medium' | 'big';

    /**
     * Callback function that is called when the rating value changes.<br>
     * Receives the new rating value as an argument.
     */
    onChange?: (rating: number) => void;
}

const Element = ({ isIcon = false, Element, compareElement = false, color, bgColor, size }) => {
    const currentColor = compareElement ? color : bgColor;

    const className = classNames('rating__icon', `s-${size}`);

    const currentSizes = {
        width: sizes[size],
        height: sizes[size]
    };

    const elementProps = { fill: currentColor, ...currentSizes, style: { color: currentColor, ...currentSizes } };

    return isIcon ? (
        cloneElement(Element, {
            ...elementProps,
            className
        })
    ) : (
        <div {...elementProps} className={className}>
            {Element}
        </div>
    );
};

const Rating: FC<IRatingProps> = (props) => {
    const {
        defaultValue,
        count = 5,
        onChange,
        character = SvgSquareIcon,
        color = 'var(--hero)',
        bgColor = 'rgba(var(--hero-rgb), 0.3)',
        halfAllow = false,
        readonly = false,
        size = 'small',
        value,
        ...restProps
    } = props;

    const isControlled = 'value' in props;
    const isDefaultValueExist = 'defaultValue' in props;
    const isRTLMode = document.dir === 'rtl';

    const [rating, setRating] = useState(value || defaultValue || 0);
    const [hoveredValue, setHoveredValue] = useState(0);
    const [regardingPosition, setRegardingPosition] = useState(0);
    const [remainingRating, setRemainingRating] = useState(0);
    const [temporaryRating, setTemporaryRating] = useState(0);
    const [iconWidth, setIconWidth] = useState(0);

    const handleMouseMoveForElement = (e: MouseEvent<HTMLDivElement>, rating: number) => {
        if (readonly) return;
        setHoveredValue(rating);
        const getClientPosition =
            e.clientX -
            (isRTLMode ? e.currentTarget.offsetLeft + e.currentTarget.clientWidth : e.currentTarget.offsetLeft);
        const getRelativeWidth = Math.abs((getClientPosition / e.currentTarget.offsetWidth) * 100);
        setRegardingPosition(halfAllow ? (getRelativeWidth <= 50 ? 50 : 100) : 100);
        setRating(0);
    };

    useLayoutEffect(() => {
        if (isDefaultValueExist && !isControlled) {
            setRating(defaultValue!);
        }
    }, [isDefaultValueExist, defaultValue]);

    useLayoutEffect(() => {
        const ratingDecimalParts = Math.round((rating % Math.floor(rating)) * 100);
        if (ratingDecimalParts !== 0) {
            setRemainingRating(ratingDecimalParts);
        }
    }, [value, rating]);

    useEffect(() => {
        if (isControlled) {
            setRating(value!);
            setTemporaryRating(value!);
        }
    }, [value]);

    useEffect(() => {
        setIconWidth(sizes[size]);
    }, [count, size]);

    const mouseLeaveHandler = () => {
        setHoveredValue(0);
        setRegardingPosition(0);
        setRating(temporaryRating);
    };

    const mouseLeaveHandlerForEveryElement = () => {
        setIconWidth(sizes[size]);
    };

    const ratingController = (currentRating: number, state: number) => {
        setIconWidth(sizes[size]);
        setHoveredValue(currentRating);

        const getCurrentRateValue = (prev: number) => {
            if (state !== prev) return state;
            setHoveredValue(0);
            setIconWidth(0);
            return 0;
        };

        setTemporaryRating(getCurrentRateValue);
    };

    const getRating = (currentRating: number) => {
        if (readonly) return;

        const state = regardingPosition === 50 ? +`${currentRating - 1}.${regardingPosition}` : currentRating;

        if (isControlled) {
            onChange?.(state);
            return;
        }

        ratingController(currentRating, state);
    };

    const mouseEnterHandler = () => {
        setTemporaryRating(rating);
    };

    const elementsList = count > 0 ? new Array(count).fill(undefined) : [];

    const PrimitiveValue = (typeof character === 'string' || typeof character === 'number') && character;

    const keyDownHandler = (e: React.KeyboardEvent<HTMLDivElement>, currentRating: number) => {
        if (readonly) return;

        if (e.key === 'Enter') {
            const state = regardingPosition === 50 ? +`${currentRating - 1}.${regardingPosition}` : currentRating;

            if (isControlled) {
                setHoveredValue(currentRating + 1);
                onChange?.(state);
                return;
            }

            setRating(state);
            ratingController(currentRating, state);
            setHoveredValue(currentRating + 1);
        }
    };

    return (
        <div
            {...restProps}
            className="rating"
            onMouseLeave={mouseLeaveHandler}
            onMouseEnter={mouseEnterHandler}
            onBlur={() => setHoveredValue(0)}
        >
            {elementsList.map((_, i) => {
                const currentRating = i + 1;
                const Icon =
                    typeof character === 'function' &&
                    isValidElement(character(i)) &&
                    (character(i) as JSX.Element).type
                        ? character(i)
                        : null;

                const calculateWidth =
                    currentRating < hoveredValue
                        ? '100%'
                        : hoveredValue === currentRating
                        ? `${regardingPosition}%`
                        : currentRating <= rating
                        ? '100%'
                        : currentRating === Math.ceil(rating)
                        ? `${remainingRating}%`
                        : 0;

                return (
                    <div
                        className={classNames('rating__wrapper', `s-${size}`)}
                        onMouseMove={(e) => handleMouseMoveForElement(e, currentRating)}
                        onMouseLeave={mouseLeaveHandlerForEveryElement}
                        onKeyDown={(e) => keyDownHandler(e, currentRating)}
                        key={i}
                    >
                        <div
                            tabIndex={0}
                            className={classNames('rating__content', { 'rating__content-readonly': readonly })}
                            onClick={() => getRating(currentRating)}
                        >
                            {Icon && <Element color={color} bgColor={bgColor} size={size} Element={Icon} isIcon />}
                            {PrimitiveValue && (
                                <Element color={color} bgColor={bgColor} size={size} Element={PrimitiveValue} />
                            )}
                            <div
                                className="rating__element"
                                style={{
                                    width: calculateWidth
                                }}
                            >
                                <div style={{ width: `${iconWidth}px`, height: '100%' }}>
                                    {Icon && (
                                        <Element
                                            Element={Icon}
                                            isIcon
                                            compareElement
                                            color={color}
                                            bgColor={bgColor}
                                            size={size}
                                        />
                                    )}
                                    {PrimitiveValue && (
                                        <Element
                                            Element={PrimitiveValue}
                                            color={color}
                                            bgColor={bgColor}
                                            size={size}
                                            compareElement
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default Rating;
