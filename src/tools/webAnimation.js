/**
 * 
 * @param {Function} callback 
 */
export function rAFThrottle(callback) {
    let requestID;
  
    return function (...args) {
      const context = this;
  
      cancelAnimationFrame(requestID);
  
      requestID = requestAnimationFrame(() => {
        callback.call(context, ...args);
      });
    };
}