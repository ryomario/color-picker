import React from 'react'
import type { IColor, IColorHexValue, IColorRGBValue, IHsvaColor } from '../../types/ColorTypes'
import styles from './ChromeColorPicker.module.css'
import type { Position } from '../../types/GeometyTypes'
import { colorToHex, hex2rgb, hsv2rgb, isLightColor, isValidHexColor, rgb2hex, rgb2hsv } from '../../lib/colorLib'
import { handleDragElement, rAFThrottle } from '../../lib/webAnimationLib'
import SaturationValueBoxElement from '../../components/SaturationValueBox/SaturationValueBoxElement'

type ChromeColorPickerProps = {
  size?: number
  defaultColor?: IColor
}

type ChromeColorPickerState = {
  hsva: IHsvaColor;

  colorPos: Position;
  huePos: number;
  alphaPos: number;
  currentColor: IColorHexValue;
}

export class ChromeColorPicker extends React.Component<ChromeColorPickerProps, ChromeColorPickerState> {
  private rootRef: React.RefObject<HTMLDivElement|null> = React.createRef();
  private colorBoxRef: React.RefObject<HTMLDivElement|null> = React.createRef();
  private colorBoxPointerRef: React.RefObject<HTMLDivElement|null> = React.createRef();
  private hueSliderTrackRef: React.RefObject<HTMLDivElement|null> = React.createRef();
  private hueSliderThumbRef: React.RefObject<HTMLDivElement|null> = React.createRef();
  private alphaSliderTrackRef: React.RefObject<HTMLDivElement|null> = React.createRef();
  private alphaSliderThumbRef: React.RefObject<HTMLDivElement|null> = React.createRef();
  private colorPreviewRef: React.RefObject<HTMLDivElement|null> = React.createRef();
  private hexInputRef: React.RefObject<HTMLInputElement|null> = React.createRef();
  
  private dragging: boolean = false;
  private handleCursorThrottled: (event: MouseEvent) => void;

  get safeProps(): Required<ChromeColorPickerProps> {
    return {
      size: 300,
      defaultColor: '#0000ff',
      ...this.props,
    }
  }
  
  constructor(props: ChromeColorPickerProps) {
    super(props)

    this.state = {
      hsva: { h: 0, s: 75, v: 80, a: 1 },
      colorPos: { x: 0, y: 0, },
      huePos: 1,
      alphaPos: 1,
      currentColor: colorToHex(this.safeProps.defaultColor),
    }

    this.handleCursorThrottled = rAFThrottle(this.handleCursor.bind(this))
  }

  componentDidMount() {
    this.initDragHandlers();
    document.addEventListener('mousemove', this.handleCursorThrottled);
    this.setColor(this.safeProps.defaultColor);
  }

  componentWillUnmount() {
    document.removeEventListener('mousemove', this.handleCursorThrottled);
  }

  private handleCursor(event: MouseEvent) {
    if (!this.colorBoxRef.current || !this.hueSliderTrackRef.current || !this.alphaSliderTrackRef.current) return;

    if (this.dragging) {
      if (this.colorBoxRef.current) this.colorBoxRef.current.style.cursor = '';
      if (this.hueSliderTrackRef.current) this.hueSliderTrackRef.current.style.cursor = '';
      if (this.alphaSliderTrackRef.current) this.alphaSliderTrackRef.current.style.cursor = '';
      return;
    }

    // Check color box pointer
    const boxRect = this.colorBoxRef.current.getBoundingClientRect();
    let x = event.clientX - boxRect.left;
    let y = event.clientY - boxRect.top;

    if (this.isOnColorBoxPointerPos(x, y)) {
      this.colorBoxRef.current.style.cursor = 'move';
    } else {
      this.colorBoxRef.current.style.cursor = 'crosshair';
    }

    // Check hue slider thumb
    const hueRect = this.hueSliderTrackRef.current.getBoundingClientRect();
    x = event.clientX - hueRect.left;
    y = event.clientY - hueRect.top;
    if (this.isOnHueSliderThumbPos(x, y)) {
      this.hueSliderTrackRef.current.style.cursor = 'ew-resize';
    } else {
      this.hueSliderTrackRef.current.style.cursor = 'crosshair';
    }

    // Check alpha slider thumb
    const alphaRect = this.alphaSliderTrackRef.current.getBoundingClientRect();
    x = event.clientX - alphaRect.left;
    y = event.clientY - alphaRect.top;
    if (this.isOnAlphaSliderThumbPos(x, y)) {
      this.alphaSliderTrackRef.current.style.cursor = 'ew-resize';
    } else {
      this.alphaSliderTrackRef.current.style.cursor = 'crosshair';
    }
  }

  private isOnHueSliderThumbPos(x: number, y: number): boolean {
    if (!this.hueSliderThumbRef.current) return false;
    const radius = this.hueSliderThumbRef.current.offsetWidth / 2;
    return (x >= (this.hueSliderThumbRef.current.offsetLeft - radius) && 
           x <= (this.hueSliderThumbRef.current.offsetLeft + radius));
  }

  private isOnAlphaSliderThumbPos(x: number, y: number): boolean {
    if (!this.alphaSliderThumbRef.current) return false;
    const radius = this.alphaSliderThumbRef.current.offsetWidth / 2;
    return (x >= (this.alphaSliderThumbRef.current.offsetLeft - radius) && 
           x <= (this.alphaSliderThumbRef.current.offsetLeft + radius));
  }

  private isOnColorBoxPointerPos(x: number, y: number): boolean {
    if (!this.colorBoxPointerRef.current) return false;
    const radius = this.colorBoxPointerRef.current.offsetWidth / 2;
    const viewX = this.state.colorPos.x * (this.colorBoxRef.current?.offsetWidth || 0);
    const viewY = this.state.colorPos.y * (this.colorBoxRef.current?.offsetHeight || 0);
    return (x >= (viewX - radius) && x <= (viewX + radius)) && 
           (y >= (viewY - radius) && y <= (viewY + radius));
  }
  private handleCopyResult = () => {
    if (!this.colorPreviewRef.current || this.colorPreviewRef.current.classList.contains('copied')) return;

    const rgb = this.getColorFromSelectedPointer();
    const { alphaPos } = this.state;
    const color = rgb2hex({ ...rgb, a: alphaPos });

    this.copyText(color, (copied) => {
      if (!copied) {
        alert('Failed to copy!');
        return;
      }

      if (this.colorPreviewRef.current) {
        this.colorPreviewRef.current.classList.add('copied');
        setTimeout(() => {
          if (this.colorPreviewRef.current) {
            this.colorPreviewRef.current.classList.remove('copied');
          }
        }, 1500);
      }
    });
  };


  private updateColorBoxPointerPosition() {
    const { colorPos } = this.state;
    if (!this.colorBoxRef.current || !this.colorBoxPointerRef.current) return;

    const x = this.colorBoxRef.current.offsetWidth * colorPos.x;
    const y = this.colorBoxRef.current.offsetHeight * colorPos.y;
    this.colorBoxPointerRef.current.style.left = `${x}px`;
    this.colorBoxPointerRef.current.style.top = `${y}px`;
  }

  private updateHueSliderPointerPosition() {
    const { huePos } = this.state;
    if (!this.hueSliderTrackRef.current || !this.hueSliderThumbRef.current) return;

    const x = this.hueSliderTrackRef.current.offsetWidth * huePos;
    this.hueSliderThumbRef.current.style.left = `${x}px`;
  }

  private updateAlphaSliderPointerPosition() {
    const { alphaPos } = this.state;
    if (!this.alphaSliderTrackRef.current || !this.alphaSliderThumbRef.current) return;

    const x = this.alphaSliderTrackRef.current.offsetWidth * alphaPos;
    this.alphaSliderThumbRef.current.style.left = `${x}px`;
  }

  private updateColorHue() {
    const rgb = this.getColorFromSelectedHue();
    if (this.rootRef.current) {
      this.rootRef.current.style.setProperty('--colorhue', rgb2hex(rgb));
    }
  }

  private updateColor() {
    const rgb = this.getColorFromSelectedPointer();
    const { alphaPos } = this.state;
    const color = rgb2hex(rgb);
    const colorWithAlpha = rgb2hex({ ...rgb, a: alphaPos });

    if (this.colorBoxPointerRef.current) {
      if (isLightColor(rgb)) {
        this.colorBoxPointerRef.current.classList.remove('white');
      } else {
        this.colorBoxPointerRef.current.classList.add('white');
      }
    }

    if (this.rootRef.current) {
      this.rootRef.current.style.setProperty('--color', color);
      this.rootRef.current.style.setProperty('--color-with-alpha', colorWithAlpha);
    }

    this.setState({ currentColor: colorWithAlpha });

    // Update hex input value
    if (this.hexInputRef.current) {
      this.hexInputRef.current.value = rgb2hex({ ...rgb, a: alphaPos });
    }
  }

  private handleHexInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let hexValue = e.target.value.trim();
    if (!isValidHexColor(hexValue)) return;

    this.setColor(hexValue as IColorHexValue);
  };

  private initDragHandlers() {
    if (!this.colorBoxRef.current || !this.colorBoxPointerRef.current) return;
    if (!this.hueSliderTrackRef.current || !this.hueSliderThumbRef.current) return;
    if (!this.alphaSliderTrackRef.current || !this.alphaSliderThumbRef.current) return;

    // Color box drag handler
    handleDragElement(this.colorBoxPointerRef.current, this.colorBoxRef.current, {
      onstart: (event) => {
        this.setDragging(true);
        document.documentElement.style.setProperty('cursor', 'move', 'important');
        if (event instanceof TouchEvent) document.documentElement.style.setProperty('overflow', 'hidden');
      },
      onend: () => {
        this.setDragging(false);
        document.documentElement.style.setProperty('overflow', 'auto');
        document.documentElement.style.cursor = '';
      },
      ondefault: (event) => {
        if (!this.dragging) return false;
        const clientX = event instanceof TouchEvent ? event.targetTouches[0].clientX : event.clientX;
        const clientY = event instanceof TouchEvent ? event.targetTouches[0].clientY : event.clientY;
        
        const rect = this.colorBoxRef.current?.getBoundingClientRect();
        if (!rect) return false;

        let x = (clientX - rect.left) / rect.width;
        let y = (clientY - rect.top) / rect.height;
        this.updateColorBoxPointer({ x, y });
        return true;
      }
    });

    // Hue slider drag handler
    handleDragElement(this.hueSliderThumbRef.current, this.hueSliderTrackRef.current, {
      onstart: (event) => {
        this.setDragging(true);
        document.documentElement.style.setProperty('cursor', 'ew-resize', 'important');
        if (event instanceof TouchEvent) document.documentElement.style.setProperty('overflow', 'hidden');
      },
      onend: () => {
        this.setDragging(false);
        document.documentElement.style.setProperty('overflow', 'auto');
        document.documentElement.style.cursor = '';
      },
      ondefault: (event) => {
        if (!this.dragging) return false;
        const clientX = event instanceof TouchEvent ? event.targetTouches[0].clientX : event.clientX;
        
        const rect = this.hueSliderTrackRef.current?.getBoundingClientRect();
        if (!rect) return false;

        let x = (clientX - rect.left) / rect.width;
        this.updateHueSliderPointer(x);
        return true;
      }
    });

    // Alpha slider drag handler
    handleDragElement(this.alphaSliderThumbRef.current, this.alphaSliderTrackRef.current, {
      onstart: (event) => {
        this.setDragging(true);
        document.documentElement.style.setProperty('cursor', 'ew-resize', 'important');
        if (event instanceof TouchEvent) document.documentElement.style.setProperty('overflow', 'hidden');
      },
      onend: () => {
        this.setDragging(false);
        document.documentElement.style.setProperty('overflow', 'auto');
        document.documentElement.style.cursor = '';
      },
      ondefault: (event) => {
        if (!this.dragging) return false;
        const clientX = event instanceof TouchEvent ? event.targetTouches[0].clientX : event.clientX;
        
        const rect = this.alphaSliderTrackRef.current?.getBoundingClientRect();
        if (!rect) return false;

        let x = (clientX - rect.left) / rect.width;
        this.updateAlphaSliderPointer(x);
        return true;
      }
    });
  }

  private setDragging(val: boolean) {
    this.dragging = val;
    if (this.rootRef.current) {
      if (val) {
        this.rootRef.current.classList.add('dragging');
      } else {
        this.rootRef.current.classList.remove('dragging');
      }
    }
  }

  private updateColorBoxPointer(pos: Position) {
    this.setState({ colorPos: pos }, () => {
      this.updateView();
    });
  }

  private updateHueSliderPointer(x: number) {
    this.setState({ huePos: x }, () => {
      this.updateView();
    });
  }

  private updateAlphaSliderPointer(x: number) {
    this.setState({ alphaPos: x }, () => {
      this.updateView();
    });
  }

  private updateView() {
    this.updateColorBoxPointerPosition();
    this.updateHueSliderPointerPosition();
    this.updateAlphaSliderPointerPosition();
    this.updateColorHue();
    this.updateColor();
  }

  private async copyText(text: string, callback: (copied: boolean) => void) {
    try {
      const result = await navigator.permissions.query({ name: 'clipboard-write' as any });
      if (result.state !== 'prompt' && result.state !== 'granted') throw new Error('No Permission');
      await navigator.clipboard.writeText(text);
      callback(true);
    } catch (error) {
      callback(false);
    }
  }
  getColorFromSelectedHue(): IColorRGBValue {
    const { huePos } = this.state;
    return hsv2rgb({ h: huePos, s: 1, v: 1 });
  }

  getColorFromSelectedPointer(): IColorRGBValue {
    const { colorPos, huePos } = this.state;
    const { x, y } = colorPos;
    const h = huePos;
    const s = x;
    const v = 1 - y;
    return hsv2rgb({ h, s, v });
  }

  setColor(color: IColor) {
    const hexColor = colorToHex(color)
    const rgb = hex2rgb(hexColor);
    const { h, s, v } = rgb2hsv(rgb);
    const a = rgb.a || 1;
    
    this.setState({
      colorPos: {
        x: s,
        y: 1 - v
      },
      huePos: h,
      alphaPos: a,
      currentColor: hexColor
    }, () => {
      this.updateView();
    });
  }

  render(): React.ReactNode {
    const { size } = this.safeProps
    const {
      hsva,
      currentColor,
    } = this.state
    
    return (
      <div
        ref={this.rootRef}
        className={styles.container}
        style={{ '--size': `${size}px` } as React.CSSProperties}
        data-testid="ChromeColorPicker-container"
      >
        <div className={styles.box}>
          <SaturationValueBoxElement
            style={{
              width: '100%',
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
            }}
            hsva={hsva}
            onChange={(hsva) => this.setState({hsva})}
          />
          
          <div className={styles.toolbox}>
            <div className={styles['toolbox-top']}>
              <div className={styles['colorpreview-container']}>
                <div 
                  ref={this.colorPreviewRef} 
                  className={styles.colorpreview}
                  onClick={this.handleCopyResult}
                  style={{ backgroundColor: currentColor }}
                ></div>
              </div>
              <div className={styles['sliders-container']}>
                <div ref={this.hueSliderTrackRef} className={styles['hueslider-track']}>
                  <div ref={this.hueSliderThumbRef} className={styles.boxpointer}></div>
                </div>
                <div ref={this.alphaSliderTrackRef} className={styles['alphaslider-track']}>
                  <div ref={this.alphaSliderThumbRef} className={styles.boxpointer}></div>
                </div>
              </div>
            </div>
            
            <div className={styles['toolbox-bot']}>
              <div className={styles['result-container']}>
                <div className={styles.inputfield} data-label="HEX">
                  <input 
                    ref={this.hexInputRef}
                    type="text" 
                    spellCheck="false" 
                    defaultValue={currentColor}
                    onChange={this.handleHexInputChange}
                  />
                </div>
              </div>
              <div className={styles['result-changeformat']}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}