
import {Component} from "./Component.js";
import { getDOMElements } from "https://cdn.jsdelivr.net/gh/JonasStumpf/js_helpers_utils@main/utils/dom.js";

/**
 * 
 * @class Sections Class, Component for DynamicHeader
 * @extends Component
 * @description changes header class based on section in vp
 * dispatches 'section' event on section change
 */
export class Sections extends Component {
    options = {
        sections: "section",
        obsRoot: null,
        dataName: "section",
        eventName: "section",
    }
    #Observer;

    /**
     * get sections
     * create Observer
     * detect resize
     */
    init() {
        this.sections = [...getDOMElements(this.options.sections)];
        this.#setClass(this.sections[0]);
        this.#createSectionObserver();
        this.dh.detectResize();
        this.dh.on("resize", ()=>this.#handleResize());
    }

    /**
     * create observer and observe sections
     */
    #createSectionObserver() {
        this.#setHeaderHeight();
        this.#Observer?.disconnect();
        this.#Observer = new IntersectionObserver((entries)=>this.#obsHandler(entries), {
            root: this.options.obsRoot,
            rootMargin: `${this.#getHeaderHeight() / -2}px 0px 0px 0px`,
            threshold: 0,
        });
        for (const section of this.sections) {
            this.#Observer.observe(section);
        }  
    }

    /**
     * observer callback
     * @param {Array[Element]} entries observer entries
     */
    #obsHandler(entries) {
        let section;
        for (let i = 0; i < entries.length; i++) {
            const entry = entries[i];
            if (!this.#isElementAboveObsView(entry.target)) continue; //only handle sections entering/leaving from bottom
            if (entry.isIntersecting) {
                section = entry.target;
            } else { //sections leaves, set next section
                let nextSection = this.sections.indexOf(entry.target);
                section = this.sections[++nextSection];
            }
        }
        this.#setClass(section);
    }

    /**
     * changes header class, dispatches event
     * @param {HTMLElement} section target section
     */
    #setClass(section) {
        if (!section) return;
        const evtData = {
            section: section,
            removed: this.currClass
        }
        this.dh.removeClass(this.currClass);
        this.currClass = section.getAttribute(this.dh.getPrefixed(this.options.dataName));
        if (this.currClass) this.dh.addClass(this.currClass);
        evtData.added = this.currClass;
        this.dh.dispatch("section", evtData, [section]);
    }

    /**
     * destroy component
     * disconnect observer
     */
    destroy() {
        this.#Observer?.disconnect();
    }

    /**
     * returns the IntersectionObserver currently in use
     * @returns {IntersectionObserver} IntersectionObserver
     */
    getObserver() {
        return this.#Observer;
    }

    /**
     * checks if element (section) is above header
     * @param {Element} el DOMElement
     * @returns boolean, element is above observer view
     */
    #isElementAboveObsView(el) {
        return (el.getBoundingClientRect().top + this.#getHeaderHeight()) < 0;
    }

    /**
     * (re)create observer on resize
     * @returns boolean, observer is created
     */
    #handleResize() {
        if (this.dh.getHeader().offsetHeight == this.#getHeaderHeight()) return false;
        this.#createSectionObserver();
        return true;
    }
    /**
     * set header height
     */
    #setHeaderHeight() {
        this.headerHeight = this.dh.getHeader().offsetHeight;
    }
    /**
     * @returns Number/null, header height
     */
    #getHeaderHeight() {
        return this.headerHeight;
    }
    

}