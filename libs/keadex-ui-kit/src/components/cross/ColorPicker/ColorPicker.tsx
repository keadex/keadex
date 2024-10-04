import React, { useState } from 'react'
import { ChromePicker, ColorChangeHandler } from 'react-color'
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
            <ChromePicker
              disableAlpha
              color={color ?? '#000000'}
              onChange={(colorResult, ev) => {
                if (onChange) onChange(colorResult, ev)
              }}
            />
          </div>
        ) : null}
      </div>
    )
  },
)

export default ColorPicker
