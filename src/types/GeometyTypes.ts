export type Position = {
  x: number
  y: number
}

export type Interaction = {
  left: number
  top: number
  width: number
  height: number
  x: number
  y: number
}

export enum Placement {
  Left = 'L',
  LeftTop = 'LT',
  LeftBottom = 'LB',
  Right = 'R',
  RightTop = 'RT',
  RightBottom = 'RB',
  Top = 'T',
  TopRight = 'TR',
  TopLeft = 'TL',
  Bottom = 'B',
  BottomLeft = 'BL',
  BottomRight = 'BR',
}