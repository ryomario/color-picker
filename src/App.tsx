import { ChromeColorPicker } from './colorPickers/ChromeColorPicker/ChromeColorPicker'
import { Placement } from './types/GeometyTypes'

function App() {

  return (
    <>
      <ChromeColorPicker
        // placement={Placement.Bottom}
        // onChange={(color) => console.log(color.hex)}
      />
    </>
  )
}

export default App 