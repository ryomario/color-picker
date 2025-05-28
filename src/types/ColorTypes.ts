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

export type IObjectColor = IHsvColor | IHsvaColor

export interface IHsvColor {
  h: number
  s: number
  v: number
}
export interface IHslColor {
  h: number
  s: number
  l: number
}
export interface IRgbColor {
  r: number
  g: number
  b: number
}

export interface IHsvaColor extends IHsvColor {
  a: number
}
export interface IHslaColor extends IHslColor {
  a: number
}
export interface IRgbaColor extends IRgbColor {
  a: number
}

export type IColorResult = {
  rgb: IRgbColor;
  hsl: IHslColor;
  hsv: IHsvColor;
  rgba: IRgbaColor;
  hsla: IHslaColor;
  hsva: IHsvaColor;
  hex: string;
  hexa: string;
}