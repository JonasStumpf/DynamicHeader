
import { getDOMElement } from "https://cdn.jsdelivr.net/gh/JonasStumpf/js_helpers_utils@main/utils/dom.js";
import {Component} from "./Component.js";

/**
 * 
 * @class Checkpoint Class, Component for DynamicHeader
 * @extends Component
 * @description changes header class based on checkpoints
 * dispatches 'checkpoint' event
 */
export class Checkpoint extends Component {

    options = {
        obsRoot: null,
        obsMargin: "0px",
        obsThreshold: 0,
        checkpoints: [],
        cpClass: "checkpoint",
        dataName: "checkpoint",
        
    }
    #cpPresets = {
        top: {
            pos: "top:20px",
            class: "dh-top",
            id: "dh-checkpoint-top"
        },
        bot: {
            pos: "bottom:20px",
            class: "dh-bot",
            id: "dh-checkpoint-bot"
        },
        mid: {
            pos: "top:50%",
            class: "dh-mid",
            id: "dh-checkpoint-mid"
        }
    }
    #checkpoints = [];
    #Observer;

    /**
     * create SectionObserver
     * create and observe checkpoints
     */
    init() {
        this.#createObserver();
        this.#initCheckpoints();
    }

    /**
     * add checkpoints specified in options
     */
    #initCheckpoints() {
        for (const checkpoint of this.options.checkpoints) {
            this.addCheckPoint(checkpoint)
        }
    }

    /**
     * create section observer
     */
    #createObserver() {
        this.#Observer?.disconnect();
        this.#Observer = new IntersectionObserver((entries)=>this.#obsHandler(entries), {
            root: this.options.obsRoot,
            rootMargin: this.options.obsMargin,
            threshold: this.options.obsThreshold,
        });
    }

    /**
     * dispatch checkpoint event, set checkpoint class
     * @param {Array[Element]} entries observer entries
     */
    #obsHandler(entries) {
        for (const cp of entries) {
            const cpClass = cp.target.getAttribute(this.dh.getPrefixed(this.options.dataName));
            
            const evtData = {
                checkpoint: cp.target,
                intersecting: cp.isIntersecting,
                class: cpClass
            }
            this.dh.dispatch("checkpoint", evtData, [cp.target]);

            if (!cpClass) continue;
            if (cp.isIntersecting) this.dh.addClass(cpClass);
            else this.dh.removeClass(cpClass);

        }
    }

    /**
     * create checkpoint dom element
     * @param {Object} data checkpoint data
     * @param {String} data.pos checkpoint position in css format, e.g. top:100vh;
     * @param {String} data.id checkpoint id
     * @param {String} data.class class to set on header when checkpoint is in observer view
     * @returns checkpoint DOMElement
     */
    createCheckPoint(data) {
        const cp = document.createElement("div");
        cp.style.cssText = `position:absolute;visibility:hidden;${data.pos}`;
        cp.setAttribute(this.dh.getPrefixed(this.options.dataName), (data.class || ""));
        if (data.id) cp.id = data.id;
        document.querySelector("body").append(cp);
        return cp;
    }

    /**
     * Adds a checkoint
     * @param {HTMLElement, String} checkpoint element or y position in css format 
     * @returns checkpoint element
     */
    addCheckPoint(cp) {
        cp = (this.#cpPresets[cp] ? this.createCheckPoint(this.#cpPresets[cp]) : false) || getDOMElement(cp) || this.createCheckPoint(cp);
        cp.classList.add(this.dh.getPrefixed(this.options.cpClass));
        this.#checkpoints.push(cp);
        this.#Observer?.observe(cp);
        return cp;
    }

    /**
     * removes checkpoint from array and unobserves checkpoint
     * @param {Element} el checkpoint element
     * @returns boolean, checkpoint was removed (false if not in checkpoint array)
     */
    removeCheckpoint(el) {
        this.#Observer?.unobserve(el);
        const index = this.#checkpoints.indexOf(el);
        if (index <= -1) return false;
        this.#checkpoints.splice(index, 1);
        return true;
    }
    /**
     * remove checkpoint, and delete from dom
     * @param {Element} el checkpoint element
     * @returns boolean, checkpoint was removed
     */
    deleteCheckpoint(el) {
        if (!this.removeCheckpoint(el)) return false;
        el.remove();
        return true;
    }
    
    /**
     * @returns array with checkpoints
     */
    getCheckpoints() {
        return this.#checkpoints;
    }

    /**
     * deletes checkpoints and disconnects observer
     */
    destroy() {
        for (let i = this.#checkpoints.length - 1; i >= 0; i--) {
            this.deleteCheckpoint(this.#checkpoints[i]);
        }
        this.#Observer?.disconnect();
    }

}