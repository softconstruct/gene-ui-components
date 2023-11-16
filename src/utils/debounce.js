export default function debounce(callback, wait, immediate) {
    let timeout;

    return function func() {
        const context = this;
        const args = arguments;

        const later = function () {
            timeout = null;
            if (!immediate) callback.apply(context, args);
        };

        const callNow = immediate && !timeout;

        clearTimeout(timeout);

        timeout = setTimeout(later, wait);

        if (callNow) callback.apply(context, args);
    };
}
