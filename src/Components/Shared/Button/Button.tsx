import React from 'react'
import classes from './Button.module.scss'

type props = {
  children: string,
  styles: string[],
  type: 'button' | 'submit' | 'reset',
  handler?: React.MouseEventHandler<HTMLButtonElement>
}

export const Button = ({ children, styles, type, handler }:props) => {
  const newStyles: String[] = []
  styles.map((style: string): void => {
    newStyles.push(classes[style])
  })
  return (
    <button className={newStyles.join(' ')} type={type} onClick={handler}>
      {children}
    </button>
  )
}
