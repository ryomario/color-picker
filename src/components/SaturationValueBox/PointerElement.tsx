import React, { type CSSProperties, type JSX } from 'react';
import { useMemo } from 'react';
import { getContrastingColor, hsvaToHex } from '../../lib/colorLib';
import type { IHsvaColor } from '../../types/ColorTypes';

export interface PointerElementProps extends React.HTMLAttributes<HTMLDivElement> {
  prefixClass?: string;
  top?: string;
  left: string;
  hsva: IHsvaColor;
  size?: number;
  cursor?: React.CSSProperties['cursor'];
}

export const PointerElement = ({ className, hsva, left, top, prefixClass = 'PointerElement', size = 16, cursor = 'move' }: PointerElementProps): JSX.Element => {
  const style: CSSProperties = {
    position: 'absolute',
    top,
    left,
    width: 0,
    height: 0,
  };

  const stylePointer = {
    width: size,
    height: size,
    transform: 'translate(-50%, -50%)',
    border: `2px solid ${getContrastingColor(hsva)}`,
    boxShadow: `${Math.ceil(size/20)}px ${Math.ceil(size/20)}px ${Math.ceil(size/5)}px rgba(0 0 0 / 50%)`,
    borderRadius: '50%',
    backgroundColor: hsvaToHex(hsva),
    cursor,
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