import { render, screen } from '@testing-library/react';
import { ChromeColorPicker } from './ChromeColorPicker';

// Mock CSS Modules
jest.mock('./ChromeColorPicker.module.css', () => ({
  __esModule: true,
  default: {
    container: 'container',
  }
}));

describe('ChromeColorPicker Component', () => {
  it('renders with class name',() => {
    render(<ChromeColorPicker/>);
    expect(true).toBeTruthy()

    const colorPicker = screen.getByTestId('ChromeColorPicker-container')
    expect(colorPicker).toHaveClass('container')
  })
})