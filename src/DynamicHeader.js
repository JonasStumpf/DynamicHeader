
import EventManager from "https://cdn.jsdelivr.net/gh/JonasStumpf/js_helpers_utils@main/helpers/EventManager.js";
import { throttle } from "https://cdn.jsdelivr.net/gh/JonasStumpf/js_helpers_utils@main/utils/functions.js";
import { getDOMElement } from "https://cdn.jsdelivr.net/gh/JonasStumpf/js_helpers_utils@main/utils/dom.js";

/**
 * @class DynamicHeader
 * @description dynamic header
 * DynamicHeader Class, manages header, components and events
 */
export class DynamicHeader {
    #header;
    #headerClasses = [];
    #eventManager = new EventManager();
    #options = {
        header: "header",
        prefix: "dh",
        resizeDelay: 500,
        targetEvents: false
    };

    
    Components = {};

    /**
     * @constructor
     * @param {Object} options options, DH and component options: options.componentName.componentOption
     * @param {Array[Component]} components array with components to use
     */
    constructor(options, components = []) {
        this.#options = {...this.#options, ...options};
        this.#header = getDOMElement(this.#options.header);

        this.dispatch = (this.#options.targetEvents) ? this.#dispatchTargets : this.#dispatchNoTargets;

        this.mount(components);
    }

    /**
     * mounts components, is called when DH is constructed
     * initializes component and calls mount() and init()
     * @param {Array[Component]} components array of DH components
     */
    mount(components) {
        for (const component of components) {
            const c = new component();
            if (this.Components[c.getName()]) continue;
            c.mount(this, this.#options[c.getName()]);
            c.init();
            this.Components[c.getName()] = c;
        }
    }

    /**
     * creates ResizeObserver (if not already created): dispatch "resize" event on header resize
     * @returns null
     */
    detectResize() {
        if (this.resizeObs) return;
        this.sectionResizeObs = new ResizeObserver(
            throttle(()=>this.dispatch("resize", this.#header, [this.#header]), this.#options.resizeDelay, this.#options.resizeDelay)
        );
        this.sectionResizeObs.observe(this.#header);
    }


    /**
     * destroy DH and components (calls destroy() of components)
     */
    destroy() {
        this.addClass = ()=>{};
        for (const name of this.#headerClasses) {
            this.#header.classList.remove(name);
        }
        this.#headerClasses = [];
        for (const component of Object.values(this.Components)) {
            component.destroy();
        }
        this.#eventManager = null;
        this.dispatch = ()=>{};
    }

    /**
     * adds class to header, keeps track of added classes so they can be removed on destroy
     * @param {String} name class name
     */
    addClass(name) {
        this.#header.classList.add(name);
        this.#headerClasses.push(name);
    }
    /**
     * removes class from header
     * @param {String} name class name
     */
    removeClass(name) {
        this.#header.classList.remove(name);
        const index = this.#headerClasses.indexOf(name);
        if (index > -1) this.#headerClasses.splice(index, 1);
    }

    /**
     * @returns header element
     */
    getHeader() {
        return this.#header;
    }
    /**
     * @returns DH prefix string, default: dh-
     */
    getPrefix() {
        return this.#options.prefix+"-";
    }
    /**
     * @param {String} name string to prefix 
     * @returns prefixed string, default: dh-name
     */
    getPrefixed(name) {
        return this.getPrefix()+name;
    }

    /**
     * adds an event callback
     * @param {String} name event name
     * @param {Function} callback callback function
     */
    on(name, callback) {this.#eventManager.on(this.getPrefixed(name), callback)}
    /**
     * removes an event callback
     * @param {String} name event name
     * @param {Function} callback callback function
     */
    remove(name, callback) {this.#eventManager.remove(this.getPrefixed(name), callback)}
    #dispatch(name, data = {}, targets = [], options = {}) {
        this.#eventManager.dispatch(this.getPrefixed(name), data, targets, options);
    }
    #dispatchNoTargets(name, data = {}) {
        this.#dispatch(name, data);
    }
    #dispatchTargets(name, data = {}, targets = [], options = {}) {
        this.#dispatch(name, data, [this.#header, ...targets], options);
    }
    /**
     * dispatch function, set in constructor
     * @param {String} name Event name
     * @param {*} data Event data
     * @param {Array[HTMLElement]} targets targets to dispatch event on
     * @param {Object} options options for dispatchEvent
     */
    /* dispatch(name, data = {}, targets = [], options = {}) {} */
}

