import React, { useMemo } from "react";
import type { IColorResult, IHsvaColor, IRgbaColor } from "../../../types/ColorTypes";
import type { InputElementProps } from "../InputElement";
import { hsvaToRgba, color as handleColor, rgbaToHsva } from "../../../lib/colorLib";
import InputElement from "../InputElement";

export interface InputRGBAElementProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  prefixClass?: string;
  hsva: IHsvaColor;
  placement?: 'top' | 'left' | 'bottom' | 'right';
  rProps?: InputElementProps;
  gProps?: InputElementProps;
  bProps?: InputElementProps;
  aProps?: false | InputElementProps;
  onChange?: (color: IColorResult) => void;
}

const InputRGBAElement = React.forwardRef<HTMLDivElement, InputRGBAElementProps>((props, ref) => {
  const {
    prefixClass = 'InputRGBAElement',
    hsva,
    placement = 'bottom',
    rProps = {},
    gProps = {},
    bProps = {},
    aProps = {},
    className = '',
    style,
    onChange,
    ...rest
  } = props;

  const rgba = useMemo<IRgbaColor>(() => {
    if(!hsva) {
      console.error(`InputRGBAElement props "hsva" not defined!`)
      return {r: 0, g: 0, b: 0, a: 0 } 
    }
    return hsvaToRgba(hsva)
  },[hsva]);
  function handleBlur(event: React.FocusEvent<HTMLInputElement>) {
    const value = Number(event.target.value);
    if (value && value > 255) {
      event.target.value = '255';
    }
    if (value && value < 0) {
      event.target.value = '0';
    }
  }
  const handleChange = (value: string | number, type: 'r' | 'g' | 'b' | 'a', evn: React.ChangeEvent<HTMLInputElement>) => {
    if (typeof value === 'number') {
      if (type === 'a') {
        if (value < 0) value = 0;
        if (value > 1) value = 1;
        onChange && onChange(handleColor(rgbaToHsva({ ...rgba, a: value })));
      }
      if (value > 255) {
        value = 255;
        evn.target.value = '255';
      }
      if (value < 0) {
        value = 0;
        evn.target.value = '0';
      }
      if (type === 'r') {
        onChange && onChange(handleColor(rgbaToHsva({ ...rgba, r: value })));
      }
      if (type === 'g') {
        onChange && onChange(handleColor(rgbaToHsva({ ...rgba, g: value })));
      }
      if (type === 'b') {
        onChange && onChange(handleColor(rgbaToHsva({ ...rgba, b: value })));
      }
    }
  };

  return (
    <div
      ref={ref}
      className={[prefixClass, className].filter(Boolean).join(' ')}
      {...rest}
      style={{
        fontSize: 11,
        display: 'flex',
        ...style,
      }}
    >
      <InputElement
        label="R"
        value={rgba.r || 0}
        onBlur={handleBlur}
        placement={placement}
        onChange={(evn, val) => handleChange(val, 'r', evn)}
        {...rProps}
        style={{ ...rProps.style }}
      />
      <InputElement
        label="G"
        value={rgba.g || 0}
        onBlur={handleBlur}
        placement={placement}
        onChange={(evn, val) => handleChange(val, 'g', evn)}
        {...gProps}
        style={{ marginLeft: 5, ...rProps.style }}
      />
      <InputElement
        label="B"
        value={rgba.b || 0}
        onBlur={handleBlur}
        placement={placement}
        onChange={(evn, val) => handleChange(val, 'b', evn)}
        {...bProps}
        style={{ marginLeft: 5, ...bProps.style }}
      />
      {aProps && (
        <InputElement
          label="A"
          value={rgba.a ? parseFloat(String(rgba.a)) : 0}
          onBlur={handleBlur}
          placement={placement}
          onChange={(evn, val) => handleChange(val, 'a', evn)}
          {...aProps}
          style={{ marginLeft: 5, ...aProps.style }}
        />
      )}
    </div>
  );
})

InputRGBAElement.displayName = 'InputRGBAElement'

export default InputRGBAElement