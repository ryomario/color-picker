import type { InteractionEvent } from "../types/EventTypes";
import type { Interaction } from "../types/GeometyTypes";
import { clamp } from "./numberLib";

// Check if an event was triggered by touch
export const isTouch = (event: InteractionEvent): event is TouchEvent => 'touches' in event;

// Browsers introduced an intervention, making touch events passive by default.
// This workaround removes `preventDefault` call from the touch handlers.
// https://github.com/facebook/react/issues/19651
export const preventDefaultMove = (event: InteractionEvent): void => {
  !isTouch(event) && event.preventDefault && event.preventDefault();
};

// Returns a relative position of the pointer inside the node's bounding box
export const getRelativePosition = (node: HTMLDivElement, event: MouseEvent | TouchEvent): Interaction => {
  const rect = node.getBoundingClientRect();

  // Get user's pointer position from `touches` array if it's a `TouchEvent`
  const pointer = isTouch(event) ? event.touches[0] : (event as MouseEvent);

  return {
    left: clamp((pointer.pageX - (rect.left + window.pageXOffset)) / rect.width),
    top: clamp((pointer.pageY - (rect.top + window.pageYOffset)) / rect.height),
    width: rect.width,
    height: rect.height,
    x: pointer.pageX - (rect.left + window.pageXOffset),
    y: pointer.pageY - (rect.top + window.pageYOffset),
  };
};