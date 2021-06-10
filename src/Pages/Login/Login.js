import classes from './Login.module.scss'
import React, { useState } from 'react'
import { Link, Redirect } from 'react-router-dom'

export const Login = () => {
  const [profile, setprofile] = useState({})
  const [error, seterror] = useState('')
  const [redirected, setredirected] = useState(false)

  const profileHandler = (event) => {
    let profileCopy = { ...profile }
    profileCopy[event.target.name] = event.target.value
    setprofile(profileCopy)
  }
  const profileSubmitHandler = (event) => {
    event.preventDefault()
    let profileCopy = { ...profile }
    console.log(profileCopy, 'asd')
    fetch('http://localhost:8000/discord/discord/login', {
      method: 'POST',
      body: JSON.stringify(profileCopy),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((header) => {
        console.log(header)
        return header.json()
      })
      .then((response) => {
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
          <div className={classes.inputContainer}>
            <label htmlFor='email'>EMAIL</label>
            <input
              type='email'
              name='email'
              id='email'
              onInput={profileHandler}
            />
          </div>
          <div className={classes.inputContainer}>
            <label htmlFor='password'>PASSWORD</label>
            <input
              type='password'
              name='password'
              id='password'
              onInput={profileHandler}
            />
          </div>
          <button type='submit' className={classes.submitBtn}>
            Login
          </button>
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
