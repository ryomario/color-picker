import React, { useMemo } from "react";
import type { IHsvaColor } from "../../types/ColorTypes";
import { PointerElement, type PointerElementProps } from "./PointerElement";
import type { JSX } from "react";
import InteractiveElement from "../Interactive/InteractiveElement";
import type { Interaction } from "../../types/GeometyTypes";
import type { InteractionEvent } from "../../types/EventTypes";

export interface SaturationValueBoxElementProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  prefixClass?: string
  hsva: IHsvaColor
  hue?: number
  radius?: React.CSSProperties['borderRadius']
  // custom pointer component
  pointer?: ({ prefixClass, left, top, color }: PointerElementProps) => JSX.Element
  onChange: (newColor: IHsvaColor) => void
}

const SaturationValueBoxElement = React.forwardRef<HTMLDivElement, SaturationValueBoxElementProps>((props, ref) => {
  const {
    prefixClass = 'SaturationValueBoxElement',
    radius = 0,
    pointer,
    className = '',
    hue = 0,
    style,
    hsva,
    onChange,
    ...rest
  } = props

  const containerStyle: React.CSSProperties = {
    width: 200,
    height: 200,
    borderRadius: radius,
    ...style,
    position: 'relative',
  }

  const handleChange = (interaction: Interaction, _event: InteractionEvent) => {
    onChange &&
      hsva &&
      onChange({
        h: hsva.h,
        s: interaction.left * 100,
        v: (1 - interaction.top) * 100,
        a: hsva.a,
      });
  };

  const pointerElement = useMemo(() => {
    if (!hsva) return null;
    const comProps = {
      top: `${100 - hsva.v}%`,
      left: `${hsva.s}%`,
      hsva: hsva,
    };
    if (pointer && typeof pointer === 'function') {
      return pointer({ prefixClass, ...comProps });
    }
    return <PointerElement prefixClass={prefixClass} {...comProps} />;
  }, [hsva, pointer, prefixClass]);

  return (
    <InteractiveElement
      {...rest}
      className={[prefixClass, className].filter(Boolean).join(' ')}
      style={{
        position: 'absolute',
        inset: 0,
        cursor: 'crosshair',
        backgroundImage: `linear-gradient(0deg, #000, transparent), linear-gradient(90deg, #fff, hsl(${
          hsva?.h ?? hue
        }, 100%, 50%))`,
        ...containerStyle,
      }}
      ref={ref}
      onStart={handleChange}
      onMove={handleChange}
    >
      {pointerElement}
    </InteractiveElement>
  )
})

SaturationValueBoxElement.displayName = "SaturationValueBoxElement"

export default SaturationValueBoxElement