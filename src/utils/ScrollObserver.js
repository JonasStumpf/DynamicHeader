
import {flatten} from "./utils.js";

export default class ScrollObserver {
    defaultOptions = {
        root: window,
        delay: 250
    }

    #handlers = {
        "start": ()=>this.scrollHandler("start"),
        "mid": ()=>this.scrollHandler("mid"),
        "end": ()=>this.scrollHandler("end")
    }
    events = {
        "start": [],
        "mid": [],
        "end": [],
        "scroll": []
    }

    constructor(options) {
        this.options = {...this.defaultOptions, ...options};
        this.eventHandler = flatten(this.#handlers, this.options.delay);
        this.setScrollPos();
        this.options.root.addEventListener("scroll", this.eventHandler);
        this.scrolling = false;
    }

    destroy() {
        this.options.root.removeEventListener("scroll", this.eventHandler);
    }

    scrollHandler(e) {
        const scrollPos = this.getScrollPos();
        const eData = {
            position: scrollPos,
            direction: (scrollPos <= this.scrollPos) ? -1 : 1,
            state: e
        };
        for (const func of [...this.events[e], ...this.events.scroll]) {
            func(eData);
        }
        this.setScrollPos();
    }

    setScrollPos() {
        this.scrollPos = this.getScrollPos();
    }
    getScrollPos() {
        return this.options.root.scrollY;
    }

    on(eventName, func) {
        this.events[eventName].push(func);
    }
    remove(eventName, func) {
        const index = this.events[eventName].indexOf(func);
        if (index > -1) this.events[eventName].splice(index, 1);
    }

}