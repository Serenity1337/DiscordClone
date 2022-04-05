import React from 'react'
import classes from './Input.module.scss'

export const Input = ({ containerClass, label, input }) => {
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
