import React, {
    FC,
    HTMLAttributes,
    MouseEvent,
    ReactElement,
    ReactNode,
    SVGProps,
    cloneElement,
    isValidElement,
    useEffect,
    useLayoutEffect,
    useRef,
    useState
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
    defaultValue: number;
    /**
     Number how many elements need to be redrawn
      */
    count: number;
    /**
     Function with which you can take a rating
     */
    onChange?: (rating: number) => void;
    /**
     Icon who we wont to drawing
     */
    character?: FC | string | number | ((i: number) => ReactNode);
    /**
     * Hover and selection colorr
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

const Rating: FC<IRatingProps> = ({
    defaultValue = 4.5,
    count = 5,
    onChange,
    character = SvgStarIcon,
    color = 'white',
    backgroundColor = 'red',
    halfAllow,
    readonly = false,
    size = 'small',
    ...restProps
}) => {
    const [rating, setRating] = useState(defaultValue);
    const [hoveredValue, setHoveredValue] = useState(0);
    const [regardingPosition, setRegardingPosition] = useState<null | number>(null);
    const [residue, setResidue] = useState(0);
    const [temporaryRatingValue, setTemporaryRatingValue] = useState(0);
    const [iconsWidth, setIconsWidth] = useState(0);

    const iconRef = useRef<SVGSVGElement | null>(null);
    const handleMouseMoveForElement = (e: MouseEvent<HTMLDivElement>, rating: number) => {
        if (readonly) return;

        setHoveredValue(rating);
        const rect = e.currentTarget.getBoundingClientRect();
        const getClientPosition = e.clientX - rect.left;
        const getRelativeWidth = Math.abs((+getClientPosition / e.currentTarget.offsetWidth) * 100);
        if (halfAllow) {
            setRegardingPosition(getRelativeWidth <= 50 ? 50 : 100);
        } else {
            setRegardingPosition(100);
        }
        setRating(0);
    };

    useLayoutEffect(() => {
        const isNumberDecimal = String(rating).split('.');
        if (isNumberDecimal.length > 1) {
            const getDecimalNumber = isNumberDecimal[1];
            setResidue(getDecimalNumber.length > 1 ? +getDecimalNumber : +`${getDecimalNumber}0`);
        }
    }, [defaultValue, rating]);

    useEffect(() => {
        if (defaultValue !== rating) {
            setRating(defaultValue);
        }
    }, [defaultValue]);

    useEffect(() => {
        const getIconsWidth = iconRef.current?.getBoundingClientRect()?.width;

        if (getIconsWidth) {
            setIconsWidth(getIconsWidth);
        }
    }, [iconRef.current, count, size]);

    const mouseLeave = () => {
        setHoveredValue(0);
        setRegardingPosition(0);
        setRating(temporaryRatingValue);
    };

    const getRating = (currentRating: number) => {
        if (readonly) return;

        const state = regardingPosition === 50 ? +`${currentRating - 1}.${regardingPosition}` : currentRating;

        const getCurrentRateValue = (prev: number) => {
            if (state !== prev) return state;
            return 0;
        };

        if (onChange) {
            onChange(state);
        }
        setTemporaryRatingValue(getCurrentRateValue);
        setRating(getCurrentRateValue);
    };

    const getRef = (el) => {
        if (el) {
            iconRef.current = el;
            return;
        }
    };

    const mouseEnterHandler = () => {
        setTemporaryRatingValue(rating);
    };

    const iconsToRender = count > 0 ? new Array(count).fill(undefined) : [];
    const currentSize = size === 'small' ? '32px' : size === 'big' ? '42px' : '36px';
    const generalPropsForIcons = {
        width: '100%',
        height: currentSize
    };

    const DefaultElement = ({ isIcon = false, Element }) =>
        isIcon ? (
            <Element
                fill={color}
                stroke={'0'}
                strokeWidth={0}
                ref={getRef}
                {...generalPropsForIcons}
                className={classNames('rating__icon', `s-${size}`)}
            />
        ) : (
            <div
                style={{
                    color
                }}
                ref={getRef}
                {...generalPropsForIcons}
                className={classNames('rating__icon', `s-${size}`)}
            >
                {Element}
            </div>
        );

    const CompareElement = ({ isIcon = false, Element }: { isIcon?: boolean; Element: ReactNode | FC<any> }) => {
        const Icon = isIcon && !isValidElement(Element) ? (Element as FC<SVGProps<'classNames'>>) : null;
        return Icon ? (
            <Icon
                {...generalPropsForIcons}
                fill={backgroundColor}
                className={classNames('rating__icon', `s-${size}`)}
                stroke={'0'}
                strokeWidth={'0'}
            />
        ) : (
            <div
                style={{
                    color: backgroundColor
                }}
                {...generalPropsForIcons}
                className={classNames('rating__icon', `s-${size}`)}
            >
                {Element as ReactNode}
            </div>
        );
    };

    return (
        <div {...restProps} className="rating" onMouseLeave={mouseLeave} onMouseEnter={mouseEnterHandler}>
            {iconsToRender.map((_, i) => {
                const currentRating = i + 1;

                const Callback =
                    typeof character === 'function' &&
                    isValidElement(character(i)) &&
                    (character(i) as JSX.Element).type
                        ? cloneElement(character(i) as ReactElement, { ...generalPropsForIcons })
                        : null;

                const Icon = (typeof character === 'object' ? character : null) as React.FC<
                    SVGProps<'classNames'>
                > | null;

                const PrimitiveValue = (typeof character === 'string' || typeof character === 'number') && character;

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
                        key={i}
                    >
                        <div className={classNames('rating__content', { 'rating__content-readonly': readonly })}>
                            {Callback && <DefaultElement Element={Callback} />}

                            {Icon && <DefaultElement Element={Icon} isIcon />}

                            {PrimitiveValue && <DefaultElement Element={PrimitiveValue} />}
                            <div
                                className="rating__element"
                                style={{
                                    width: calculateWidth
                                }}
                            >
                                <div style={{ width: `${iconsWidth}px`, height: '100%' }}>
                                    {Callback && <CompareElement Element={Callback} />}
                                    {Icon && <CompareElement Element={Icon} isIcon />}
                                    {PrimitiveValue && <CompareElement Element={PrimitiveValue} />}
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
