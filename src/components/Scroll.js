
import ScrollObserver from "https://cdn.jsdelivr.net/gh/JonasStumpf/js_helpers_utils@main/helpers/ScrollObserver.js";
import {Component} from "./Component.js";

/**
 * 
 * @class Scroll Class, Component for DynamicHeader
 * @extends Component
 * @description changes header class based on scroll direction
 * dispatches 'scroll' event
 */
export class Scroll extends Component {

    options = {
        root: window,
        delay: 250,
        classUp: "scroll-up",
        classDown: "scroll-down",
        modes: ["scroll"] //start, end, mid, scroll (scroll = always, start+mid+end)
    }

    #Observer;

    /**
     * inits ScrollObserver
     */
    init() {
        this.options.classes = {
            "1": this.options.classDown,
            "-1": this.options.classUp
        };
        this.#Observer = new ScrollObserver({
            root: this.options.root,
            delay: this.options.delay
        });
        for (const mode of this.options.modes) {
            this.#Observer.on(mode, (e)=>this.#scrollHandler(e));
        }
    }

    /**
     * dispatches scroll event, sets class
     * @param {Object} e scroll event
     * @param {Number} e.position scroll position
     * @param {Number} e.direction -1 => up / 1 => down
     * @param {String} e.state scroll state: start, mid, end
     */
    #scrollHandler(e) {
        this.dh.dispatch("scroll", e);
        this.dh.removeClass(this.options.classes[e.direction * -1]);
        this.dh.addClass(this.options.classes[e.direction]);
    }

    /**
     * destroys ScrollObserver
     */
    destroy() {
        this.#Observer.destroy();
    }

    /**
     * returns the ScrollObserver
     * @returns {ScrollObserver} ScrollObserver
     */
    getObserver() {
        return this.#Observer;
    }
}