import type React from "react";
import { Placement } from "../types/GeometyTypes";

export function getPlacementStyle(placement: Placement) {
  const rStyle: React.CSSProperties = {
    borderStyle: 'solid',
    position: 'absolute',
  };
  let arrBrStyl: React.CSSProperties = { ...rStyle };
  let arrStyl: React.CSSProperties = { ...rStyle };
  if (/^T/.test(placement)) {
    arrBrStyl.borderWidth = '0 8px 8px';
    arrBrStyl.borderColor = 'transparent transparent var(--github-arrow-border-color)';
    arrStyl.borderWidth = '0 7px 7px';
    arrStyl.borderColor = 'transparent transparent var(--github-background-color)';
  }
  if (placement === Placement.TopRight) {
    arrBrStyl.top = -8;
    arrStyl.top = -7;
  }
  if (placement === Placement.Top) {
    arrBrStyl.top = -8;
    arrStyl.top = -7;
  }
  if (placement === Placement.TopLeft) {
    arrBrStyl.top = -8;
    arrStyl.top = -7;
  }
  if (/^B/.test(placement)) {
    arrBrStyl.borderWidth = '8px 8px 0';
    arrBrStyl.borderColor = 'var(--github-arrow-border-color) transparent transparent';
    arrStyl.borderWidth = '7px 7px 0';
    arrStyl.borderColor = 'var(--github-background-color) transparent transparent';
    if (placement === Placement.BottomRight) {
      arrBrStyl.top = '100%';
      arrStyl.top = '100%';
    }
    if (placement === Placement.Bottom) {
      arrBrStyl.top = '100%';
      arrStyl.top = '100%';
    }
    if (placement === Placement.BottomLeft) {
      arrBrStyl.top = '100%';
      arrStyl.top = '100%';
    }
  }
  if (/^(B|T)/.test(placement)) {
    if (placement === Placement.Top || placement === Placement.Bottom) {
      arrBrStyl.left = '50%';
      arrBrStyl.marginLeft = -8;
      arrStyl.left = '50%';
      arrStyl.marginLeft = -7;
    }
    if (placement === Placement.TopRight || placement === Placement.BottomRight) {
      arrBrStyl.right = 10;
      arrStyl.right = 11;
    }
    if (placement === Placement.TopLeft || placement === Placement.BottomLeft) {
      arrBrStyl.left = 7;
      arrStyl.left = 8;
    }
  }
  if (/^L/.test(placement)) {
    arrBrStyl.borderWidth = '8px 8px 8px 0';
    arrBrStyl.borderColor = 'transparent var(--github-arrow-border-color) transparent transparent';
    arrStyl.borderWidth = '7px 7px 7px 0';
    arrStyl.borderColor = 'transparent var(--github-background-color) transparent transparent';
    arrBrStyl.left = -8;
    arrStyl.left = -7;
  }
  if (/^R/.test(placement)) {
    arrBrStyl.borderWidth = '8px 0 8px 8px';
    arrBrStyl.borderColor = 'transparent transparent transparent var(--github-arrow-border-color)';
    arrStyl.borderWidth = '7px 0 7px 7px';
    arrStyl.borderColor = 'transparent transparent transparent var(--github-background-color)';
    arrBrStyl.right = -8;
    arrStyl.right = -7;
  }
  if (/^(L|R)/.test(placement)) {
    if (placement === Placement.RightTop || placement === Placement.LeftTop) {
      arrBrStyl.top = 5;
      arrStyl.top = 6;
    }
    if (placement === Placement.Left || placement === Placement.Right) {
      arrBrStyl.top = '50%';
      arrStyl.top = '50%';
      arrBrStyl.marginTop = -8;
      arrStyl.marginTop = -7;
    }
    if (placement === Placement.LeftBottom || placement === Placement.RightBottom) {
      arrBrStyl.top = '100%';
      arrStyl.top = '100%';
      arrBrStyl.marginTop = -21;
      arrStyl.marginTop = -20;
    }
  }

  return {
    arrBrStyl,
    arrStyl,
  }
}