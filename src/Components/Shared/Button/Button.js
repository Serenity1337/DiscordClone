import React from 'react'
import classes from './Button.module.scss'

export const Button = ({ children, styles, type, handler }) => {
  const newStyles = []
  styles.map((style) => {
    newStyles.push(classes[style])
  })
  return (
    <button className={newStyles.join(' ')} type={type} onClick={handler}>
      {children}
    </button>
  )
}
