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
import SvgStarIcon from './DefaultSvg';
// Styles
import './Rating.scss';

export const positions = ['top', 'right', 'bottom', 'left'] as const;

export interface IRatingProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
    /**
     Default selected rating 
     */
    defaultValue?: number;

    /**
     * Selected rating
     */
    value?: number;

    /**
     Number how many elements need to be redrawn
      */
    count?: number;
    /**
     Function with which you can take a rating
     */
    onChange?: (rating: number) => void;
    /**
     Icon which we want to drawing
     */
    character?: FC | string | number | ((i: number) => ReactNode);
    /**
     * Hover and selection color
     */
    color?: string;
    /**
     * Background color
     */
    backgroundColor?: string;
    /**Whether to allow semi selection */
    halfAllow?: boolean;
    /**
     * Will make switcher readonly when set to "true"
     */
    readonly?: boolean;
    /**
     * Rating size <br/>
     * Possible values: `small | medium | big`
     */
    size?: 'small' | 'medium' | 'big';
}

const Rating: FC<IRatingProps> = (props) => {
    const {
        defaultValue,
        count = 5,
        onChange,
        character = SvgStarIcon,
        color = '#1267cf',
        backgroundColor = '#fff',
        halfAllow = true,
        readonly = false,
        size = 'small',
        value,
        ...restProps
    } = props;

    const isControlled = 'value' in props;
    const [rating, setRating] = useState(value || defaultValue || 0);
    const [hoveredValue, setHoveredValue] = useState(0);
    const [regardingPosition, setRegardingPosition] = useState<null | number>(null);
    const [residue, setResidue] = useState(0);
    const [temporaryRatingValue, setTemporaryRatingValue] = useState(0);
    const [iconsWidth, setIconsWidth] = useState(0);

    const handleMouseMoveForElement = (e: MouseEvent<HTMLDivElement>, rating: number) => {
        if (readonly) return;
        e.preventDefault();
        e.stopPropagation();

        setHoveredValue(rating);
        const rect = e.currentTarget.getBoundingClientRect();
        const getClientPosition = e.clientX - rect.left;
        const getRelativeWidth = Math.abs((getClientPosition / e.currentTarget.offsetWidth) * 100);

        if (halfAllow) {
            setRegardingPosition(getRelativeWidth <= 50 ? 50 : 100);
        } else {
            setRegardingPosition(100);
        }

        setRating(0);
    };

    useLayoutEffect(() => {
        if (defaultValue && !value) {
            setRating(defaultValue);
        }
    }, [defaultValue]);

    useLayoutEffect(() => {
        const ratingDecimalParts = String(rating).split('.');
        if (ratingDecimalParts.length > 1) {
            const getDecimalNumber = ratingDecimalParts[1];
            setResidue(getDecimalNumber.length > 1 ? +getDecimalNumber : +`${getDecimalNumber}0`);
        }
    }, [value, rating]);

    useEffect(() => {
        if (value && value !== rating) {
            setRating(value);
        }
    }, [value]);

    useEffect(() => {
        calculateIconWidth();
    }, [count, size]);

    const mouseLeaveHandler = () => {
        setHoveredValue(0);
        setRegardingPosition(0);
        setRating(temporaryRatingValue);
    };

    const mouseLeaveHandlerForEveryElement = () => {
        calculateIconWidth();
    };

    const getRating = (currentRating: number) => {
        if (readonly) return;

        const state = regardingPosition === 50 ? +`${currentRating - 1}.${regardingPosition}` : currentRating;
        calculateIconWidth();
        const getCurrentRateValue = (prev: number) => {
            if (state !== prev) return state;
            setIconsWidth(0);
            setRegardingPosition(0);
            setHoveredValue(0);
            return 0;
        };

        if (isControlled) {
            onChange?.(state);
            return;
        }
        setTemporaryRatingValue(getCurrentRateValue);
        setRating(getCurrentRateValue);
    };

    const mouseEnterHandler = () => {
        setTemporaryRatingValue(rating);
    };

    const iconsToRender = count > 0 ? new Array(count).fill(undefined) : [];

    const currentSize = size === 'small' ? 32 : size === 'big' ? 42 : 36;

    const calculateIconWidth = () => {
        setIconsWidth(currentSize);
    };

    const Element = ({ isIcon = false, Element, compareElement = false }) => {
        const currentColor = compareElement ? color : backgroundColor;

        const className = classNames('rating__icon', `s-${size}`);

        const sizes = {
            width: '100%',
            height: currentSize
        };

        const element = isIcon ? { fill: currentColor, ...sizes } : { style: { color: currentColor, ...sizes } };

        return isIcon ? (
            cloneElement(Element, {
                ...element,
                className
            })
        ) : (
            <div {...element} className={className}>
                {Element}
            </div>
        );
    };
    const PrimitiveValue = (typeof character === 'string' || typeof character === 'number') && character;

    return (
        <div {...restProps} className="rating" onMouseLeave={mouseLeaveHandler} onMouseEnter={mouseEnterHandler}>
            {iconsToRender.map((_, i) => {
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
                        ? `${residue}%`
                        : 0;

                return (
                    <div
                        className={classNames('rating__wrapper', `s-${size}`)}
                        onMouseMove={(e) => handleMouseMoveForElement(e, currentRating)}
                        onClick={() => getRating(currentRating)}
                        onMouseLeave={mouseLeaveHandlerForEveryElement}
                        key={i}
                    >
                        <div className={classNames('rating__content', { 'rating__content-readonly': readonly })}>
                            {Icon && <Element Element={Icon} isIcon />}
                            {PrimitiveValue && <Element Element={PrimitiveValue} />}
                            <div
                                className="rating__element"
                                style={{
                                    width: calculateWidth
                                }}
                            >
                                <div style={{ width: `${iconsWidth}px`, height: '100%' }}>
                                    {Icon && <Element Element={Icon} isIcon compareElement />}
                                    {PrimitiveValue && <Element Element={PrimitiveValue} compareElement />}
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
