const isStickyActive = (targetInfo, rootBoundsInfo, position) =>
    position === 'left'
        ? Math.floor(targetInfo.right) <= rootBoundsInfo.left
        : position === 'right'
        ? Math.ceil(targetInfo.left) >= rootBoundsInfo.right
        : position === 'top'
        ? targetInfo.bottom >= rootBoundsInfo.top
        : position === 'bottom'
        ? targetInfo.bottom <= rootBoundsInfo.bottom
        : null;

const createStickyObserver = (container, stickyTarget, eventName, position, additionalInfo) => {
    const { offset } = additionalInfo;

    const observer = new IntersectionObserver(
        (records) => {
            for (const record of records) {
                const targetInfo = record.boundingClientRect;
                const rootBoundsInfo = record.rootBounds;

                const isSticky = isStickyActive(targetInfo, rootBoundsInfo, position);
                fireEvent(eventName, { isSticky, position, additionalInfo });
            }
        },
        {
            threshold: 1,
            root: container,
            rootMargin: `0px -${offset.right}px 0px -${offset.left}px`
        }
    );

    observer.observe(stickyTarget);
    return () => observer.unobserve(stickyTarget);
};

const fireEvent = (eventName, detail) => document.dispatchEvent(new CustomEvent(eventName, { detail }));

const observeStickyInfo = (container, targets, eventName, additionalInfo) =>
    Object.keys(targets).map((key) => createStickyObserver(container, targets[key], eventName, key, additionalInfo));

export default observeStickyInfo;
