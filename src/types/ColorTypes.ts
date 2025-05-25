export type IColorHexValue = `#${string}`

export type IColorRGBValue = {
  r: number
  g: number
  b: number
  a?: number
}

export type IColorHSVValue = {
  h: number
  s: number
  v: number
}

export type IColor = IColorHexValue | IColorRGBValue | IColorHSVValue
