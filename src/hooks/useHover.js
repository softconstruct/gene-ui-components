import { useState, useEffect } from 'react';

const useHover = (ref) => {
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    useEffect(() => {
        const node = ref.current;
        if (node) {
            node.addEventListener('mouseenter', handleMouseEnter);
            node.addEventListener('mouseleave', handleMouseLeave);
            return () => {
                node.removeEventListener('mouseenter', handleMouseEnter);
                node.removeEventListener('mouseleave', handleMouseLeave);
            };
        }
    }, [ref]);

    return isHovered;
};

export default useHover;
