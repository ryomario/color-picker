import type React from "react";

export interface SliderPointerProps extends React.HTMLAttributes<HTMLDivElement> {
  prefixClass?: string;
  left?: string;
  top?: string;
  fillProps?: React.HTMLAttributes<HTMLDivElement>;
  cursor?: React.CSSProperties['cursor'];
  size?: number;
}

export const SliderPointer = ({ className, prefixClass = 'SliderPointer', left, top, style, fillProps, cursor = 'w-resize', size = 18, ...rest }: SliderPointerProps): React.JSX.Element => {
  const styleWrapper: React.CSSProperties = {
    ...style,
    position: 'absolute',
    left,
    top,
    width: 0,
    height: 0,
  };

  const stylePointer = {
    width: size,
    height: size,
    boxShadow: 'rgb(0 0 0 / 25%) 0 0 5px 2px',
    borderRadius: '50%',
    backgroundColor: '#ffffff',
    ...fillProps?.style,
    transform: left ? 'translate(-50%, -50%)' : 'translate(-50%, -50%)',
    cursor,
  } as React.CSSProperties;

  return (
    <div className={`${prefixClass}-pointer ${className || ''}`} style={styleWrapper} {...rest}>
      <div className={`${prefixClass}-fill`} {...fillProps} style={stylePointer} />
    </div>
  );
};