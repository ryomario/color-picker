export function rAFThrottle(callback: Function) {
  let requestID: number;
  
  return function (this: any,...args: any[]) {
    cancelAnimationFrame(requestID);

    requestID = requestAnimationFrame(() => {
      callback.call(this, ...args);
    });
  };
}
export function handleDragElement(element: HTMLElement,container: HTMLElement,callbacks: {
  onstart?: (e:MouseEvent|TouchEvent) => void
  onmove?: (e:MouseEvent|TouchEvent) => boolean
  onend?: (e:MouseEvent|TouchEvent) => void
  ondefault?: (e:MouseEvent|TouchEvent) => boolean
}) {
  /**
   * @param {MouseEvent|TouchEvent} event 
   */
  const Handler = rAFThrottle(function(event: MouseEvent|TouchEvent) {
    if(event.type === 'mousedown' || event.type === 'touchstart'){
      callbacks.onstart?.(event);
      document.addEventListener('mousemove',Handler);
      document.addEventListener('mouseup', Handler);
      if(event.type === 'touchstart' && (event instanceof TouchEvent && event.targetTouches.length == 1)){
        document.addEventListener('touchmove',Handler, {passive: false});
        document.addEventListener('touchend', Handler);
        document.addEventListener('touchcancel', Handler);
      }
    }
    if(event.type === 'mouseup' || event.type === 'touchend' || event.type === 'touchcancel'){
      callbacks.onend?.(event);
      document.removeEventListener('mousemove',Handler);
      document.removeEventListener('mouseup', Handler);
      document.removeEventListener('touchmove',Handler);
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