export default class ClassWithListener {
    constructor() {
        const $this = this;
        /**
         * Internal use only (not accessable)
         * @type {Object.<string,Array<Function>>}
         */
        const listeners = {}
        /**
         * 
         * @param {string} name 
         * @param {Function} callback 
         */
        function addEventListener(name,callback) {
            if(!listeners[name])listeners[name] = [];
            if(typeof callback !== 'function')return;
            if(!listeners[name].includes(callback)) {
                listeners[name].push(callback);
            }
        }
        this.addEventListener = addEventListener;
        /**
         * 
         * @param {string} name 
         * @param {Function} callback 
         */
        function removeEventListener(name,callback) {
            if(!listeners[name])return;
            if(typeof callback !== 'function')return;
            let idx = listeners[name].findIndex(l => l === callback);
            if(idx != -1) {
                listeners[name].splice(idx, 1);
            }
        }
        this.removeEventListener = removeEventListener;
        /**
         * 
         * @param {string} name 
         * @param {any} args 
         */
        function dispatchEvent(name,...args) {
            if(!listeners[name])return;
            for (const callback of listeners[name]) {
                callback.apply($this, args);
            }
        }
        this.dispatchEvent = dispatchEvent;
    }
}