import React, { useState } from 'react'
import { ColorChangeHandler, ColorResult, SketchPicker } from 'react-color'
import { useHotkeys } from 'react-hotkeys-hook'
import { Key } from 'ts-key-enum'

export type ColorPickerProps = {
  color?: string
  className?: string
  onChange?: ColorChangeHandler
}

export const ColorPicker = React.memo(
  ({ color, className, onChange }: ColorPickerProps) => {
    const [isOpen, setIsOpen] = useState(false)

    useHotkeys([Key.Escape], (e) => {
      if (isOpen) {
        e.preventDefault()
        setIsOpen(false)
      }
    })

    function addOpacityToHex(colorResult: ColorResult) {
      const hex = colorResult.hex
      const opacity = Math.round((colorResult.rgb.a ?? 1) * 255)
      const opacityHex = opacity.toString(16).padStart(2, '0')
      colorResult.hex = `${hex}${opacityHex}`
      return colorResult
    }

    return (
      <div className={`color-picker ${className ?? ''}`}>
        {isOpen && (
          <div
            className="absolute top-0 bottom-0 left-0 right-0"
            onClick={() => setIsOpen(false)}
          />
        )}
        <div
          className={`py-1 px-1 cursor-pointer bg-white w-fit h-fit rounded-sm`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="w-7 h-3" style={{ backgroundColor: color }}></div>
        </div>
        {isOpen ? (
          <div className="absolute z-[2] pr-5 pb-5">
            <SketchPicker
              disableAlpha={false}
              color={color ?? '#000000'}
              onChange={(colorResult, ev) => {
                if (onChange) onChange(addOpacityToHex(colorResult), ev)
              }}
            />
          </div>
        ) : null}
      </div>
    )
  },
)

export default ColorPicker
