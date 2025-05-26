import React, { type CSSProperties, type JSX } from 'react';
import { useMemo } from 'react';
import { getContrastingColor, hsvaToHex } from '../../lib/colorLib';
import type { IHsvaColor } from '../../types/ColorTypes';

export interface PointerElementProps extends React.HTMLAttributes<HTMLDivElement> {
  prefixClass?: string;
  top?: string;
  left: string;
  hsva: IHsvaColor;
  size?: number
}

export const PointerElement = ({ className, hsva, left, top, prefixClass = 'PointerElement', size = 16, }: PointerElementProps): JSX.Element => {
  const style: CSSProperties = {
    position: 'absolute',
    top,
    left,
  };

  const stylePointer = {
    width: size,
    height: size,
    transform: 'translate(-50%, -50%)',
    boxShadow: `${getContrastingColor(hsva)} 0px 0px 0px 1.5px, rgb(0 0 0 / 30%) 0px 0px 1px 1px inset, rgb(0 0 0 / 40%) 0px 0px 1px 2px`,
    borderRadius: '50%',
    backgroundColor: hsvaToHex(hsva),
    cursor: 'move'
  } as CSSProperties;

  return useMemo(
    () => (
      <div className={`${prefixClass}-pointer ${className || ''}`} style={style}>
        <div className={`${prefixClass}-fill`} style={stylePointer} />
      </div>
    ),
    [top, left, hsva, className, prefixClass],
  );
};