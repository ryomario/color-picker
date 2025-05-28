import React, { useCallback, useEffect, useState } from "react";
import type { Interaction } from "../../types/GeometyTypes";
import type { InteractionEvent } from "../../types/EventTypes";
import { useRef } from "react";
import { useEventCallback } from "../../hooks/eventsHooks";
import { getRelativePosition, isTouch, preventDefaultMove } from "../../lib/eventLib";

export interface InteractiveElementProps extends React.HTMLAttributes<HTMLDivElement> {
  prefixClass?: string
  onStart?: (offset: Interaction, event: InteractionEvent) => void
  onMove?: (interaction: Interaction, event: InteractionEvent) => void
  onEnd?: (offset: Interaction, event: InteractionEvent) => void
  cursorOnDrag?: React.CSSProperties['cursor']
}

const InteractiveElement = React.forwardRef<HTMLDivElement, InteractiveElementProps>((props, _ref) => {
  const {
    prefixClass = 'color-picker-interactive-element',
    className = '',
    onStart,
    onMove,
    onEnd,
    style,
    cursorOnDrag = 'move',
    ...rest
  } = props

  const container = useRef<HTMLDivElement>(null)
  const [isDragging, setDragging] = useState(false)
  const hasTouched = useRef(false)

  const onStartCallback = useEventCallback(onStart)
  const onMoveCallback = useEventCallback(onMove)

  // Prevent mobile browsers from handling mouse events (conflicting with touch ones).
  // If we detected a touch interaction before, we prefer reacting to touch events only.
  const isValid = (event: MouseEvent | TouchEvent): boolean => {
    if (hasTouched.current && !isTouch(event)) return false;
    hasTouched.current = isTouch(event);
    return true;
  };

  const handleMove = useCallback(
    (event: MouseEvent | TouchEvent) => {
      preventDefaultMove(event)
      if (!container.current) return;

      const isDown = isTouch(event) ? event.touches.length > 0 : event.buttons > 0
      if (!isDown) {
        setDragging(false)
        return
      }

      onMoveCallback?.(getRelativePosition(container.current, event), event)
    },
    [onMoveCallback],
  );

  const handleMoveEnd = useCallback(() => setDragging(false), [])

  const toggleDocumentEvents = useCallback(
    (state: boolean) => {
      if (state) {
        window.document.documentElement.style.setProperty('cursor', cursorOnDrag, 'important');
        window.document.documentElement.classList.add('force-inherit-cursor');
        window.document.documentElement.classList.add('disable-pointer-events');
        window.addEventListener(hasTouched.current ? 'touchmove' : 'mousemove', handleMove);
        window.addEventListener(hasTouched.current ? 'touchend' : 'mouseup', handleMoveEnd);
      } else {
        window.document.documentElement.style.cursor = '';
        window.document.documentElement.classList.remove('force-inherit-cursor');
        window.document.documentElement.classList.remove('disable-pointer-events');
        window.removeEventListener('mousemove', handleMove);
        window.removeEventListener('mouseup', handleMoveEnd);
        window.removeEventListener('touchmove', handleMove);
        window.removeEventListener('touchend', handleMoveEnd);
      }
    },
    [handleMove, handleMoveEnd],
  );

  useEffect(() => {
    toggleDocumentEvents(isDragging);
    return () => {
      toggleDocumentEvents(false);
    };
  }, [isDragging, handleMove, handleMoveEnd, toggleDocumentEvents]);

  const handleStart = useCallback(
    (event: React.MouseEvent | React.TouchEvent) => {
      preventDefaultMove(event.nativeEvent)
      if(!isValid(event.nativeEvent)) return;
      if(!container.current) return;
      onStartCallback?.(getRelativePosition(container.current, event.nativeEvent), event.nativeEvent)
      setDragging(true)
    },
    [onStartCallback],
  )

  return (
    <div
      {...rest}
      data-testid="InteractiveElement"
      className={[prefixClass, className].filter(Boolean).join(' ')}
      style={{
        ...style,
        touchAction: 'none',
      }}
      ref={container}
      tabIndex={0}
      onMouseDown={handleStart}
      onTouchStart={handleStart}
    />
  )
})

InteractiveElement.displayName = 'InteractiveElement'

export default InteractiveElement