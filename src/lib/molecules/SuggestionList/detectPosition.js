export const getCaretPos = (e, textarea, index, key) => {
    textarea.insertAdjacentHTML('afterend', `<div id='dummy'></div>`);
    const dummy = document.getElementById('dummy');
    const style = getComputedStyle(textarea);
    [
        'fontFamily',
        'fontSize',
        'fontWeight',
        'lineHeight',
        'wordWrap',
        'whiteSpace',
        'borderLeftWidth',
        'paddingRight',
        'borderTopWidth',
        'borderRightWidth',
        'borderBottomWidth'
    ].forEach((key) => {
        dummy.style[key] = style[key];
    });
    dummy.style.overflow = 'auto';
    dummy.style.paddingLeft = '6px';
    dummy.style.width = `${textarea.offsetWidth}px`;
    dummy.style.height = `${textarea.offsetHeight - 20}px`;
    dummy.style.position = 'absolute';
    dummy.style.left = `${textarea.offsetLeft}px`;
    dummy.style.top = `${textarea.offsetTop}px`;

    const val = textarea.value.replaceAll(/\n/g, '<br/>');
    let newVal = '';
    let ind = 0;

    val.split('').forEach((i) => {
        if (ind !== null && i === key) {
            ind++;
        }
        if (ind === index) {
            newVal += `<span id='lastId'>${i}</span>`;
            ind = null;
        } else {
            newVal += i === ' ' ? '&nbsp;' : i;
        }
    });
    dummy.innerHTML = newVal;
    dummy.scrollTo(0, textarea.scrollTop);
    const lastId = document.getElementById('lastId');
    const returnData = {
        top: lastId.getBoundingClientRect().top,
        left: lastId.getBoundingClientRect().left
    };
    dummy.remove();

    return returnData;
};
export const getCursorPos = (input) => {
    if ('selectionStart' in input && document.activeElement === input) {
        return {
            start: input.selectionStart,
            end: input.selectionEnd
        };
    }
    if (input.createTextRange) {
        const sel = document.selection.createRange();
        if (sel.parentElement() === input) {
            const rng = input.createTextRange();
            rng.moveToBookmark(sel.getBookmark());
            let len;
            for (len = 0; rng.compareEndPoints('EndToStart', rng) > 0; rng.moveEnd('character', -1)) {
                len++;
            }
            rng.setEndPoint('StartToStart', input.createTextRange());
            let pos;
            for (
                pos = { start: 0, end: len };
                rng.compareEndPoints('EndToStart', rng) > 0;
                rng.moveEnd('character', -1)
            ) {
                pos.start++;
                pos.end++;
            }
            return pos;
        }
    }
    return -1;
};
