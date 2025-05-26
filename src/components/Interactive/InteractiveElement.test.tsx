import { render, screen } from "@testing-library/react";
import InteractiveElement from "./InteractiveElement";

describe('InteractiveElement Component', () => {
  it('renders with default prefix class name',() => {
    render(<InteractiveElement/>);

    const el = screen.getByTestId('InteractiveElement')
    expect(el).toHaveClass('color-picker-interactive-element')
  })
  it('renders with custom prefix class name',() => {
    render(<InteractiveElement prefixClass="InteractiveElement-custom-prefix"/>);

    const el = screen.getByTestId('InteractiveElement')
    expect(el).toHaveClass('InteractiveElement-custom-prefix')
  })
})