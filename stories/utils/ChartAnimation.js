const easeOutBounce = (pos) => {
    if (pos < 1 / 2.75) {
        return 7.5625 * pos * pos;
    }
    if (pos < 2 / 2.75) {
        return 7.5625 * (pos -= 1.5 / 2.75) * pos + 0.75;
    }
    if (pos < 2.5 / 2.75) {
        return 7.5625 * (pos -= 2.25 / 2.75) * pos + 0.9375;
    }
    return 7.5625 * (pos -= 2.625 / 2.75) * pos + 0.984375;
};

Math.easeOutBounce = easeOutBounce;
