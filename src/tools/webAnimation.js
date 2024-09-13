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

/**
 * @param {HTMLElement} element 
 * @param {HTMLElement} container 
 * @param {{onstart:(e:Event)=>void,onmove:(e:Event)=>boolean,onend:(e:Event)=>void,ondefault:(e:Event)=>boolean}} callbacks 
 */
export function handleDragElement(element,container,callbacks) {
  /**
   * @param {MouseEvent|TouchEvent} event 
   */
  const Handler = rAFThrottle(function(event) {
    if(event.type === 'mousedown' || event.type === 'touchstart'){
      callbacks.onstart?.(event);
      document.addEventListener('mousemove',Handler);
      document.addEventListener('mouseup', Handler);
      if(event.type === 'touchstart' && event.targetTouches.length == 1){
        document.addEventListener('touchmove',Handler, {passive: false});
        document.addEventListener('touchend', Handler);
        document.addEventListener('touchcancel', Handler);
      }
    }
    if(event.type === 'mouseup' || event.type === 'touchend' || event.type === 'touchcancel'){
      callbacks.onend?.(event);
      document.removeEventListener('mousemove',Handler);
      document.removeEventListener('mouseup', Handler);
      document.removeEventListener('touchmove',Handler, {passive: true});
      document.removeEventListener('touchend', Handler);
      document.removeEventListener('touchcancel', Handler);
    }
    if((event.type === 'mousemove' || event.type === 'touchmove')){
      if(callbacks.onmove && !callbacks.onmove(event))return;
    }
    if(callbacks.ondefault && !callbacks.ondefault(event))return;
  });
  container.addEventListener('mousedown',Handler);
  element.addEventListener('touchstart',Handler,{ passive: true });
}