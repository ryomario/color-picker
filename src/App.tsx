import { ChromeColorPicker } from './colorPickers/ChromeColorPicker/ChromeColorPicker'
import { Placement } from './types/GeometyTypes'

function App() {

  return (
    <>
      <ChromeColorPicker
        defaultColor="#56baed"
        // placement={Placement.Bottom}
        // onChange={(color) => console.log(color.hex)}
      />
    </>
  )
}

export default App 