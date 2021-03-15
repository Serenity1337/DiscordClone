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
    fetch('http://localhost:4000/users', {
      method: 'GET',
      headers: {
        'Content-Type': 'json/application',
      },
    })
      .then((header) => {
        return header.json()
      })
      .then((response) => {
        if (response) {
          const user = response.filter(
            (responseUser) => responseUser.email === profile.email
          )
          if (user[0] && user[0].password === profile.password) {
            localStorage.setItem(
              'cordCopyToken',
              JSON.stringify({ id: user[0].id })
            )
            setredirected(true)
          } else {
            seterror('Please make sure the credentials are correct')
          }
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
        {redirected ? <Redirect to='/app' /> : null}
      </div>
    </div>
  )
}
