"use strict";



export function isObject(item) {
    return (item && typeof item === 'object' && !Array.isArray(item));
}

export function mergeDeep(target, source) {
    let output = Object.assign({}, target);
    if (isObject(target) && isObject(source)) {
        Object.keys(source).forEach(key => {
        if (isObject(source[key])) {
            if (!(key in target)) Object.assign(output, { [key]: source[key] });
            else output[key] = mergeDeep(target[key], source[key]);
        } else {
            Object.assign(output, { [key]: source[key] });
        }
        });
    }
    return output;
}


export function getDOMElement(el) {
    if (el instanceof Element) return el;
    try {
        const domEl = document.querySelector(el);
        if (domEl instanceof Element) return domEl;
        else return false;
    } catch (error) {
        return false;
    }
}

export function getDOMElements(els, unique = true) {
    if (!els.forEach) {
        if (els instanceof Element) return [domEl];
        return document.querySelectorAll(els);
    }
    let domEls = [];
    for (const el of els) {
        if (!(el instanceof Element)) domEls = (unique) ? domEls.concat([...document.querySelectorAll(el)].filter((item)=>domEls.indexOf(item) === -1)) : domEls.concat([...document.querySelectorAll(el)]);
        else if (unique && domEls.indexOf(el) === -1) domEls.push(el);
    }
    return domEls;
}


export function debounce(func, delay) {
    let timeout;
    return () => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {func.apply(this, arguments)}, delay);
    }
}


export function throttle(func, delay) {
    let waiting = false;
    return () => {
        if (waiting) return;
        waiting = true;
        func.apply(this, arguments);
        setTimeout(() => {waiting = false}, delay);
    }
}

export function flatten(func, delay) {
    let timeout;
    let waiting = false;
    const funcs = {
        start: func.start || func,
        mid: func.mid || func,
        end: func.end || func
    }
    return () => {
        if (!waiting) {
            if (!timeout) funcs.start.apply(this, arguments);
            else funcs.mid.apply(this, arguments);
            waiting = true;
            setTimeout(() => {waiting = false}, delay);
        }
        clearTimeout(timeout)
        timeout = setTimeout(() => {
            timeout = null;
            funcs.end.apply(this, arguments);
        }, delay);
    }
}

