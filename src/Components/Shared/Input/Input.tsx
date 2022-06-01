import React from 'react'
import classes from './Input.module.scss'
type InputTypes = {
  type: string,
  name: string,
  id: string,
  handler: React.ChangeEventHandler<HTMLInputElement>
}
type LabelTypes = {
  for: string,
  text: string
}
type props = {
  containerClass: string,
  label: LabelTypes,
  input: InputTypes
}

export const Input = ({ containerClass, label, input }:props) => {
  return (
    <div
      className={
        containerClass ? classes[containerClass] : classes.inputContainer
      }
    >
      <label htmlFor={label.for}>{label.text}</label>
      <input
        type={input.type}
        name={input.name}
        id={input.id}
        onChange={input.handler}
      />
    </div>
  )
}
