import React, { useMemo } from "react";
import type { IHslaColor } from "../../../types/ColorTypes";
import type { InputElementProps } from "../InputElement";
import { color as handleColor, hsvaToHsla, hslaToHsva } from "../../../lib/colorLib";
import InputElement from "../InputElement";
import type { InputRGBAElementProps } from "../InputRGBA/InputRGBAElement";

export interface InputHSLAElementProps extends Omit<InputRGBAElementProps, 'rProps' | 'gProps' | 'bProps'> {
  hProps?: InputElementProps;
  sProps?: InputElementProps;
  lProps?: InputElementProps;
}

const InputHSLAElement = React.forwardRef<HTMLDivElement, InputHSLAElementProps>((props, ref) => {
  const {
    prefixClass = 'InputHSLAElement',
    hsva,
    placement = 'bottom',
    hProps = {},
    sProps = {},
    lProps = {},
    aProps = {},
    className = '',
    style,
    onChange,
    ...rest
  } = props;

  const hsla = useMemo<IHslaColor>(() => {
    if(!hsva) {
      console.error(`InputHSLAElement props "hsva" not defined!`)
      return {h: 0, s: 0, l: 0, a: 0 } 
    }
    return hsvaToHsla(hsva)
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
  const handleChange = (value: string | number, type: 'h' | 's' | 'l' | 'a', evn: React.ChangeEvent<HTMLInputElement>) => {
    if (typeof value === 'number') {
      if (type === 'a') {
        if (value < 0) value = 0;
        if (value > 1) value = 1;
        onChange && onChange(handleColor(hslaToHsva({ ...hsla, a: value })));
      }
      if (type === 'h') {
        if (value < 0) {
          value = 0;
          evn.target.value = '0';
        }
        if (value > 360) {
          value = 360;
          evn.target.value = '360';
        }
        onChange && onChange(handleColor(hslaToHsva({ ...hsla, h: value })));
      }

      if (type === 's') {
        if (value < 0) {
          value = 0;
          evn.target.value = '0%';
        }
        if (value > 100) {
          value = 100;
          evn.target.value = '100%';
        }
        onChange && onChange(handleColor(hslaToHsva({ ...hsla, s: value })));
      }
      if (type === 'l') {
        if (value < 0) {
          value = 0;
          evn.target.value = '0%';
        }
        if (value > 100) {
          value = 100;
          evn.target.value = '100%';
        }
        onChange && onChange(handleColor(hslaToHsva({ ...hsla, l: value })));
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
        label="H"
        value={Math.round(hsla.h || 0)}
        onBlur={handleBlur}
        placement={placement}
        onChange={(evn, val) => handleChange(val, 'h', evn)}
        {...hProps}
        style={{ ...hProps.style }}
      />
      <InputElement
        label="S"
        value={`${Math.round(hsla.s || 0)}%`}
        onBlur={handleBlur}
        placement={placement}
        onChange={(evn, val) => handleChange(val, 's', evn)}
        {...sProps}
        style={{ marginLeft: 5, ...sProps.style }}
      />
      <InputElement
        label="L"
        value={`${Math.round(hsla.l || 0)}%`}
        onBlur={handleBlur}
        placement={placement}
        onChange={(evn, val) => handleChange(val, 'l', evn)}
        {...lProps}
        style={{ marginLeft: 5, ...lProps.style }}
      />
      {aProps && (
        <InputElement
          label="A"
          value={hsla.a ? parseFloat(String(hsla.a)) : 0}
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

InputHSLAElement.displayName = 'InputHSLAElement'

export default InputHSLAElement