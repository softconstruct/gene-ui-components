// this file existance is
// related with rc-slider package issue

export default function (arr, obj) {
    if (arr.indexOf) return arr.indexOf(obj);
    for (let i = 0; i < arr.length; ++i) {
        if (arr[i] === obj) return i;
    }
    return -1;
}
