
/** EventManager Class
 * Manages Events:
 * - Add Events
 * - Remove Events
 * - Dispatch Events (EventListener and added Events)
 */
export default class EventManager {
    #events = {};

    /**
     * adds event callback
     * @param {String} name event name
     * @param {Function} callback event callback
     */
    on(name, callback) {
        if (!this.#events[name]) this.#events[name] = [];
        this.remove(name, callback);
        this.#events[name].push(callback);
    }

    /**
     * removes event callback
     * @param {String} name event name
     * @param {Function} callback event callback
     * @returns event was removed
     */
    remove(name, callback) {
        if (!this.#events[name]) return false;
        const index = this.#events[name].indexOf(callback);
        if (index > -1) this.#events[name].splice(index, 1);
        return true;
    }


    /**
     * dispatches an event: calls added callbacks, dispatches event on a given target
     * @param {String} name event name
     * @param {*} data event data
     * @param {Array[HTMLElement]} targets targets to dispatch event on
     * @param {Object} options options for dispatchEvent
     */
    dispatch(name, data = {}, targets = [], options = {}) {
        this.#dispatchTargets(name, data, targets, options);
        this.#dispatchList(name, data);
    }
    #dispatchTargets(name, data, targets, options) {
        if (!targets) return;
        const event = new CustomEvent(name, {cancelable: true, ...options, detail: data});
        for (const target of targets) {
            target.dispatchEvent(event);
        }
    }
    #dispatchList(name, data) {
        if (!this.#events[name]) return;
        for (const callback of this.#events[name]) {
            callback.apply(this, [data]);
        }
    }

    
}