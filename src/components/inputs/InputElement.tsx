import React from "react";
import { useEffect, useRef, useState } from "react";
import { getNumberValue } from "../../lib/numberLib";
import styles from "./InputElement.module.css";

const validHexInput = (hex: string): boolean => /^#?([A-Fa-f0-9]{3,4}){1,2}$/.test(hex);

export interface InputElementProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  prefixClass?: string;
  value?: string | number;
  label?: React.ReactNode;
  labelStyle?: React.CSSProperties;
  placement?: 'top' | 'left' | 'bottom' | 'right';
  inputStyle?: React.CSSProperties;
  labelClass?: string;
  inputClass?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>, value: string | number) => void;
  renderInput?: (props: React.InputHTMLAttributes<HTMLInputElement>, ref: React.Ref<HTMLInputElement>) => React.ReactNode;
}

const InputElement = React.forwardRef<HTMLInputElement, InputElementProps>((props, ref) => {
  const {
    prefixClass = 'InputElement',
    placement = 'bottom',
    label,
    value: initValue,
    className = '',
    style,
    labelStyle,
    inputStyle,
    inputClass,
    labelClass,
    onChange,
    onBlur,
    renderInput,
    ...rest
  } = props;

  const [value, setValue] = useState<string | number | undefined>(initValue);
  const isFocus = useRef(false);

  useEffect(() => {
    if (props.value !== value) {
      if (!isFocus.current) {
        setValue(props.value);
      }
    }
  }, [props.value]);

  function handleChange(event: React.FocusEvent<HTMLInputElement>, valInit?: string) {
    const value = (valInit || event.target.value).trim().replace(/^#/, '');
    event.target.value = value;
    if (validHexInput(value)) {
      onChange && onChange(event, value);
    }
    const val = getNumberValue(value);
    if (!isNaN(val)) {
      onChange && onChange(event, val);
    }

    setValue(event.target.value);
  }
  function handleBlur(evn: React.FocusEvent<HTMLInputElement>) {
    isFocus.current = false;
    setValue(props.value);
    onBlur && onBlur(evn);
  }
  const placementStyle: React.CSSProperties = {};
  if (placement === 'bottom') {
    placementStyle['flexDirection'] = 'column';
  }
  if (placement === 'top') {
    placementStyle['flexDirection'] = 'column-reverse';
  }
  if (placement === 'left') {
    placementStyle['flexDirection'] = 'row-reverse';
  }
  const wrapperStyle = {
    ...placementStyle,
    ...style,
  } as React.CSSProperties;
  const inputProps: React.InputHTMLAttributes<HTMLInputElement> = {
    value,
    onChange: handleChange,
    onBlur: handleBlur,
    autoComplete: 'off',
    onFocus: () => (isFocus.current = true),
    ...rest,
    className: [styles["input-editable"], inputClass].filter(Boolean).join(' '),
    style: inputStyle,
  };
  return (
    <div className={[prefixClass, styles["input-wrapper"], className].filter(Boolean).join(' ')} style={wrapperStyle}>
      {renderInput ? renderInput(inputProps, ref) : <input ref={ref} {...inputProps} />}
      {label && (
        <span
          style={{
            color: 'var(--input-label-color)',
            ...labelStyle,
          }}
          children={label}
          className={labelClass}
        />
      )}
    </div>
  );
})

InputElement.displayName = 'InputElement'

export default InputElement