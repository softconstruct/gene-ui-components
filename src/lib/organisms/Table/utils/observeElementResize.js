import ResizeObserver from 'resize-observer-polyfill';

const observeElementResize = (element, callback) => {
    const resizeObserver = new ResizeObserver(callback);

    if (element) {
        resizeObserver.observe(element);
        return {
            unobserve: () => resizeObserver.unobserve(element)
        };
    }
};

export default observeElementResize;
