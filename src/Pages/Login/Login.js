import classes from './Login.module.scss'
import React, { useState } from 'react'
import { Link, Redirect } from 'react-router-dom'
import Input from '../../Components/Shared/Input'
import Button from '../../Components/Shared/Button'
import { postRequest } from '../../utils/Api'
export const Login = () => {
  const [profile, setprofile] = useState({})
  const [error, seterror] = useState('')
  const [redirected, setredirected] = useState(false)

  const profileHandler = (event) => {
    let profileCopy = { ...profile }
    profileCopy[event.target.name] = event.target.value
    setprofile(profileCopy)
  }
  const inputElements = [
    {
      containerClass: '',
      label: { for: 'email', text: 'EMAIL' },
      input: {
        type: 'email',
        name: 'email',
        id: 'email',
        handler: profileHandler,
      },
    },
    {
      containerClass: '',
      label: { for: 'password', text: 'PASSWORD' },
      input: {
        type: 'password',
        name: 'password',
        id: 'password',
        handler: profileHandler,
      },
    },
  ]
  const profileSubmitHandler = (event) => {
    event.preventDefault()
    let profileCopy = { ...profile }
    const res = postRequest(
      `http://localhost:8000/discord/discord/login`,
      profileCopy
    )
    res.then((response) => {
      if (response.token) {
        localStorage.setItem(
          'cordCopyToken',
          JSON.stringify({ id: response.id, token: response.token })
        )
        setredirected(true)
      } else {
        seterror('Please make sure the credentials are correct')
      }
    })
  }
  return (
    <div className={classes.mainContainer}>
      <div className={classes.formContainer}>
        <h1 className={classes.formTitle}>Welcome back!</h1>
        <h5 className={classes.formSubTitle}>
          We're excited to see you again!
        </h5>
        <form action='' onSubmit={profileSubmitHandler}>
          {inputElements.map((inputElement) => {
            return (
              <Input
                containerClass={inputElement.containerClass}
                label={{
                  for: inputElement.label.for,
                  text: inputElement.label.text,
                }}
                input={{
                  type: inputElement.input.type,
                  name: inputElement.input.name,
                  id: inputElement.input.id,
                  handler: inputElement.input.handler,
                }}
              />
            )
          })}
          <Button styles={['loginSubmitBtn']} type='submit'>
            Login
          </Button>
        </form>

        <Link to='/register' className={classes.redirectToLogin}>
          Need an account? Register
        </Link>
        {error ? <div className={classes.error}> {error} </div> : null}
        {redirected ? <Redirect to='/channels/@me' /> : null}
      </div>
    </div>
  )
}
