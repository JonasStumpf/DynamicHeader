/** 
 * @abstract Component
 * 
 * Abstract class for Dynamic Header Components
 * don't override mount(), mount() needs to be called to set DH instance and options
 * use init() for setting things up
 */
export class Component {
    #name;

    /*
     * Create a Component
     * sets Component Name, prevents direct instantiation of Component Class
     */
    constructor() {
        if (new.target === Component) {
            throw new TypeError("Cannot construct Component instances directly.");
        }
        this.#name = new.target.name;
    }


    /**
     * Mount the Component, set DH instance and options, don't override this method
     * @param {DynamicHeader} dh - DH instance 
     * @param {Object} options - Options for the Component
     */
    mount(dh, options) {
        this.dh = dh;
        this.options = {...this.options, ...options};
    }
    
    /**
     * called by DH on Component initialization
     * can be used for setting things up in components
     */
    init(){};

    /**
     * called by DH on destroy
     * can be used for removing stuff setup by the component
     */
    destroy(){};

    /**
     * Get Component Name
     * @returns {string} Component Name
     */
    getName() {
        return this.#name;
    }

}