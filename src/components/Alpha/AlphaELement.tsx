import type React from "react";

export interface AlphaElementProps extends React.HTMLAttributes<HTMLDivElement>, React.PropsWithChildren {
  width?: React.CSSProperties['width']
  height?: React.CSSProperties['height']

  checkerColor?: string
  checkerSize?: number
}

export function AlphaElement({
  width = 50,
  height = 50,
  checkerColor = '#dddddd',
  checkerSize = 10,
  style: propStyle,
  children,
  ...rest
}: AlphaElementProps) {
  const style: React.CSSProperties = {
    position: 'relative',
    width,
    height,

    ...propStyle,

    backgroundColor: '#ffffff',
    backgroundImage: `${
      `linear-gradient(45deg, ${checkerColor} 25%, transparent 25%)`
    }, ${
      `linear-gradient(-45deg, ${checkerColor} 25%, transparent 25%)`
    }, ${
      `linear-gradient(45deg, transparent 75%, ${checkerColor} 75%)`
    }, ${
      `linear-gradient(-45deg, transparent 75%, ${checkerColor} 75%)`
    }`,
    backgroundSize: `${checkerSize*2}px ${checkerSize*2}px`,
    backgroundPosition: `0 0, 0 ${checkerSize}px, ${checkerSize}px ${-checkerSize}px, ${-checkerSize}px 0px`,
  }

  return (
    <div {...rest} style={style}>
      {children}
    </div>
  )
}