import React, { Fragment, useCallback, useMemo, useState, type CSSProperties } from 'react'
import type { IColorResult, IHsvaColor } from '../../types/ColorTypes'
import styles from './ChromeColorPicker.module.css'
import { Placement } from '../../types/GeometyTypes'
import { color as converColor, hexToHsva, isValidHexColor, hsvaToHex, hsvaToHexa, getContrastingColor, hsvaToHslaString, HUE_MAX } from '../../lib/colorLib'
import SaturationValueBoxElement from '../../components/SaturationValueBox/SaturationValueBoxElement'
import type { SwatchElementProps, SwatchPresetColor, SwatchRectRenderProps } from '../../components/Swatch/SwatchElement'
import { getPlacementStyle } from '../../lib/geometyLib'
import SwatchElement from '../../components/Swatch/SwatchElement'
import RectElement from '../../components/Swatch/RectElement'
import { getIsEyeDropperSupported } from '../../lib/eventLib'
import { EyeDropper } from '../../components/EyeDropper/EyeDropper'
import { AlphaElement } from '../../components/Alpha/AlphaELement'
import { CopyTextButton } from '../../components/CopyTextButton'
import SliderElement from '../../components/Slider/SliderElement'
import Arrow from '../../components/Arrow/Arrow'
import InputElement from '../../components/inputs/InputElement'
import InputRGBAElement from '../../components/inputs/InputRGBA/InputRGBAElement'
import InputHSLAElement from '../../components/inputs/InputHSLA/InputHSLAElement'

export enum ChromeColorPickerInputType {
  HEX = 'hex',
  RGBA = 'rgba',
  HSLA = 'hsla'
}

const PRESET_COLORS = [
  '#f44336',
  '#e91e63',
  '#9c27b0',
  '#4527a0',
  '#3f51b5',
  '#2196f3',
  '#03a9f4',
  '#00bcd4',
  '#009688',
  '#4caf50',
  '#8bc34a',
  '#cddc39',
  '#ffeb3b',
  '#ffc107',
  '#ff9800',
  '#ff5722',
  '#795548',
  '#9e9e9e',
  '#607d8b',
  '#ffffff',
];

export interface ChromeRectRenderProps extends SwatchRectRenderProps {
  arrow?: React.JSX.Element;
}
export interface ChromeColorPickerProps extends Omit<SwatchElementProps, 'onChange' | 'color' | 'colors'> {
  prefixClass?: string
  inputType?: ChromeColorPickerInputType
  showEditableInput?: boolean
  showEyeDropper?: boolean
  showColorPreview?: boolean
  showHue?: boolean
  showAlpha?: boolean
  size?: number
  placement?: Placement
  showTriangle?: boolean
  color?: string | IHsvaColor
  presetColors?: false | SwatchPresetColor[]
  defaultColor?: string | IHsvaColor
  onChange?: (color: IColorResult) => void
}

export const ChromeColorPicker = React.forwardRef<HTMLDivElement, ChromeColorPickerProps>((props, ref) => {
  const {
    size = 300,
    prefixClass = 'ChromeColorPicker',
    className = '',
    style,
    placement = Placement.TopLeft,
    showTriangle = true,
    showEditableInput = true,
    showEyeDropper = true,
    showColorPreview = true,
    showHue = true,
    showAlpha = true,
    inputType = ChromeColorPickerInputType.RGBA,
    color,
    defaultColor = { h: 0, s: 0, v: 0, a: 1 },
    presetColors = PRESET_COLORS,
    onChange,
    rectRender,
    rectProps,
    ...rest
  } = props

  const isControlled = useMemo(() => {
    if(color && !onChange) console.error(Error('ChromeColorPicker Missing "onChange" property for controlled component'))
    return !!color && !!onChange
  }, [color,onChange])

  const [stateColor, setStateColor] = useState<string|IHsvaColor>(() => {
    if(isControlled) return color!
    return defaultColor
  })

  const hsva = useMemo<IHsvaColor>(
    () => typeof stateColor === 'string'
      ? (isValidHexColor(stateColor) ? hexToHsva(stateColor) : { h: 0, s: 0, v: 0, a: 1 })
      : stateColor,
    [stateColor]
  )

  const [hex, hexa] = useMemo(() => [hsvaToHex(hsva), hsvaToHexa(hsva)],[hsva])

  const handleChange = useCallback(
    (hsv: IHsvaColor) => {
      setStateColor(hsv)
      onChange?.(converColor(hsv))
    },
    [setStateColor, onChange]
  )
  
  const styleWrapper = {
    '--github-border': '1px solid rgba(0, 0, 0, 0.2)',
    '--github-background-color': '#fff',
    '--github-box-shadow': 'rgb(0 0 0 / 15%) 0px 3px 12px',
    '--github-arrow-border-color': 'rgba(0, 0, 0, 0.15)',
    width: size,
    borderRadius: 5,
    background: 'var(--github-background-color)',
    boxShadow: 'var(--github-box-shadow)',
    border: 'var(--github-border)',
    position: 'relative',
    padding: 0,
    ...style,
  } as CSSProperties

  const {
    arrBrStyl,
    arrStyl,
  } = getPlacementStyle(placement)
  
  const renderPresetRect = ({ ...props }: SwatchRectRenderProps) => {
    const handle = rectRender && rectRender({ ...props });
    if (handle) return handle;
    return <RectElement {...props} rectProps={{ style: props.style }}/>;
  };

  const [type, setType] = useState(inputType)

  const labelStyle: React.CSSProperties = { paddingTop: 6 };


  const handleClickArrow = useCallback(
    () => setType(oldType => {
      if (oldType === ChromeColorPickerInputType.RGBA) {
        return ChromeColorPickerInputType.HSLA
      }
      if (oldType === ChromeColorPickerInputType.HSLA) {
        return ChromeColorPickerInputType.HEX
      }
      if (oldType === ChromeColorPickerInputType.HEX) {
        return ChromeColorPickerInputType.RGBA
      }
      return ChromeColorPickerInputType.RGBA
    }),
    [setType]
  )

  const handleClickColor = (hex: string) => {
    let result = hexToHsva(hex);
    handleChange({ ...result });
  }
  return (
    <SwatchElement
      ref={ref}
      className={[prefixClass, className].filter(Boolean).join(' ')}
      colors={!presetColors ? undefined : presetColors}
      color={hex}
      rectRender={renderPresetRect}
      {...rest}
      onChange={handleChange}
      style={styleWrapper}
      rectProps={{
        style: {
          margin: 5,
          borderRadius: 5,
          height: (size - 5 * 10 * 2) / 10,
          width: (size - 5 * 10 * 2) / 10,
          border: '1px solid rgb(220,220,220)',
        },
      }}
      addonBefore={
        <Fragment>
          {showTriangle && (
            <Fragment>
              <div style={arrBrStyl} />
              <div style={arrStyl} />
            </Fragment>
          )}
        </Fragment>
      }
    >
      <Fragment>
        <SaturationValueBoxElement
          hsva={hsva}
          onChange={(newColor) => {
            handleChange({ ...hsva, ...newColor, a: hsva.a })
          }}
          style={{
            width: '100%',
            height: size*2/3,
            borderTopLeftRadius: styleWrapper.borderRadius,
            borderTopRightRadius: styleWrapper.borderRadius,
          }}
        />
        <div style={{ padding: 15, display: 'flex', alignItems: 'center', gap: 10, width: '100%' }}>
          {getIsEyeDropperSupported() && showEyeDropper && <EyeDropper onPickColor={handleClickColor}/>}
          {showColorPreview && (
            <AlphaElement
              className={styles.colorpreview}
              width={36}
              height={36}
              checkerSize={6}
              style={{ border: '1px solid #aaa', borderRadius: '50%', overflow: 'hidden', color: getContrastingColor(hsva) }}
            >
              <div className={styles['colorpreview-overlay']} style={{ backgroundColor: hsvaToHslaString(hsva)} }/>
              <CopyTextButton className={styles['colorpreview-button-copy']} textToCopy={hexa}/>
            </AlphaElement>
          )}
          <div style={{ flex: 1, marginLeft: 10 }}>
            {showHue && (
              <SliderElement
                value={hsva.h / HUE_MAX}
                onChange={(a_h) => {
                  handleChange({ ...hsva, h: a_h * HUE_MAX })
                }}
                direction='horizontal'
                background={`linear-gradient(to right, rgb(255, 0, 0) 0%, rgb(255, 255, 0) 17%, rgb(0, 255, 0) 33%, rgb(0, 255, 255) 50%, rgb(0, 0, 255) 67%, rgb(255, 0, 255) 83%, rgb(255, 0, 0) 100%)`}
                width="100%"
                checkerSize={6}
                height={12}
                radius={3}
                pointerProps={{
                  size: 15,
                }}
              />
            )}
            {showAlpha && (
              <SliderElement
                value={hsva.a}
                onChange={(a) => {
                  handleChange({ ...hsva, a })
                }}
                direction='horizontal'
                background={`linear-gradient(to right, rgba(0,0,0,0) 0%, ${hex} 100%)`}
                width="100%"
                checkerSize={6}
                height={12}
                style={{ marginTop: 10 }}
                radius={3}
                pointerProps={{
                  size: 15,
                }}
                enableAlphaBg
              />
            )}
          </div>
        </div>
        {showEditableInput && (
          <div style={{ display: 'flex', alignItems: 'center', padding: '0 15px 15px 15px', userSelect: 'none', width: '100%' }}>
            <div style={{ flex: 1, marginRight: 10 }}>
              {type === ChromeColorPickerInputType.HEX && (
                <InputElement
                  label="HEX"
                  labelStyle={labelStyle}
                  value={hsva.a >= 0 && hsva.a < 1 ? hsvaToHexa(hsva).toLocaleUpperCase() : hsvaToHex(hsva).toLocaleUpperCase()}
                  onChange={(_, value) => {
                    if (typeof value === 'string') {
                      handleChange(hexToHsva(/^#/.test(value) ? value : `#${value}`));
                    }
                  }}
                />
              )}
              {type === ChromeColorPickerInputType.RGBA && (
                <InputRGBAElement
                  hsva={hsva}
                  onChange={(reColor) => handleChange(reColor.hsva)}
                  rProps={{ labelStyle }}
                  gProps={{ labelStyle }}
                  bProps={{ labelStyle }}
                  aProps={!showAlpha ? false : { labelStyle }}
                />
              )}
              {type === ChromeColorPickerInputType.HSLA && (
                <InputHSLAElement
                  hsva={hsva}
                  onChange={(reColor) => handleChange(reColor.hsva)}
                  hProps={{ labelStyle }}
                  sProps={{ labelStyle }}
                  lProps={{ labelStyle }}
                  aProps={!showAlpha ? false : { labelStyle }}
                />
              )}
            </div>
            <Arrow onClick={handleClickArrow}/>
          </div>
        )}
        {!!presetColors && presetColors.length > 0 && (
          <div style={{ width: '100%', borderTop: '1px solid rgb(238, 238, 238)', marginBottom: 10}}/>
        )}
      </Fragment>
    </SwatchElement>
  );
})

ChromeColorPicker.displayName = 'ChromeColorPicker'