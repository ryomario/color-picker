import React from "react";
import { SliderPointer, type SliderPointerProps } from "./SliderPointer";
import type { Interaction } from "../../types/GeometyTypes";
import InteractiveElement from "../Interactive/InteractiveElement";
import { AlphaElement, type AlphaElementProps } from "../Alpha/AlphaELement";

export interface SliderElementProps extends Omit<AlphaElementProps,'onChange'> {
  prefixClass?: string
  /** String, Pixel value for picker width. Default `316px` */
  width?: React.CSSProperties['width'];
  /** String, Pixel value for picker height. Default `16px` */
  height?: React.CSSProperties['height'];
  value: number;
  /** React Component, Custom pointer component */
  pointer?: (props: SliderPointerProps) => React.JSX.Element;
  /** Set rounded corners. */
  radius?: React.CSSProperties['borderRadius'];
  /** Set the background color. */
  background?: string;
  /** Set the background element props. */
  bgProps?: React.HTMLAttributes<HTMLDivElement>;
  pointerProps?: SliderPointerProps;
  /** String Enum, horizontal or vertical. Default `horizontal` */
  direction?: 'vertical' | 'horizontal';
  onChange?: (newValue: number, offset: Interaction) => void;

  enableAlphaBg?: boolean
}

const SliderElement = React.forwardRef<HTMLDivElement, SliderElementProps>((props, _ref) => {
  const {
    prefixClass = 'SliderElement',
    className = '',
    value,
    background,
    bgProps = {},
    pointerProps = {},
    radius = 0,
    width,
    height = 16,
    direction = 'horizontal',
    style,
    onChange,
    pointer,
    enableAlphaBg = false,
    ...rest
  } = props

  const handleChange = (offset: Interaction) => {
    onChange && onChange(direction == 'horizontal' ? offset.left : offset.top, offset)
  }

  const comProps: { left?: string; top?: string } = {};
  if (direction === 'horizontal') {
    comProps.left = `${value * 100}%`;
  } else {
    comProps.top = `${value * 100}%`;
  }
  const styleWrapper = {
    '--slide-bg-props': background || '#ffffff',
    borderRadius: radius,
    ...{ width, height },
    ...style,
    position: 'relative',
  } as React.CSSProperties;
  
  const pointerElement =
    pointer && typeof pointer === 'function' ? (
      pointer({ prefixClass, ...pointerProps, ...comProps })
    ) : (
      <SliderPointer {...pointerProps} cursor={direction == 'horizontal' ? "w-resize" : 'n-resize'} prefixClass={prefixClass} {...comProps} />
    );

  return (
    <AlphaElement
      {...rest}
      className={[prefixClass, `${prefixClass}-${direction}`, className].filter(Boolean).join(' ')}
      style={styleWrapper}
      width={width}
      height={height}
    >
      <div
        {...bgProps}
        style={{
          inset: 0,
          position: 'absolute',
          background: 'var(--slide-bg-props)',
          backgroundColor: enableAlphaBg ? 'transparent' : '#ffffff',
          borderRadius: radius,
          ...bgProps.style,
        }}
      />
      <InteractiveElement
        style={{
          inset: 0,
          zIndex: 1,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onMove={handleChange}
        onStart={handleChange}
        cursorOnDrag={direction == 'horizontal' ? 'w-resize' : 'n-resize'}
      >
        {pointerElement}
      </InteractiveElement>
    </AlphaElement>
  );
})

SliderElement.displayName = 'SliderElement'

export default SliderElement