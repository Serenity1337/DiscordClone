import classes from './Register.module.scss'
import React, { useState, useEffect } from 'react'
import Dates from '../../Components/Dates'
import { Link, Redirect } from 'react-router-dom'

export const Register = () => {
  const [profile, setprofile] = useState({ birthday: {} })
  const [error, seterror] = useState('')
  const profileHandler = (event) => {
    let profileCopy = { ...profile }
    profileCopy[event.target.name] = event.target.value
    setprofile(profileCopy)
  }
  const profileSubmitHandler = (event) => {
    event.preventDefault()
    if (
      !profile.email ||
      !profile.username ||
      !profile.password ||
      !profile.rpassword ||
      !profile.birthday.day ||
      !profile.birthday.month ||
      !profile.birthday.year
    ) {
      seterror('Please fill empty fields')
    } else {
      if (profile.password === profile.rpassword) {
        let profileCopy = { ...profile }
        profileCopy.friends = []
        delete profileCopy.rpassword
        seterror('')
        fetch('http://localhost:4000/users', {
          method: 'POST',
          body: JSON.stringify(profileCopy),
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then((header) => {
            return header.json()
          })
          .then((response) => {
            if (response.error) {
              seterror(response.msg)
            }
            ;<Redirect to='/login' />
          })
      } else {
        seterror('Please make sure you repeat password correctly')
      }
    }
  }
  return (
    <div className={classes.mainContainer}>
      <div className={classes.formContainer}>
        <h1 className={classes.formTitle}>Create an account</h1>
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
            <label htmlFor='username'>USERNAME</label>
            <input
              type='text'
              name='username'
              id='username'
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
          <div className={classes.inputContainer}>
            <label htmlFor='rpassword'>REPEAT PASSWORD</label>
            <input
              type='password'
              name='rpassword'
              id='rpassword'
              onInput={profileHandler}
            />
          </div>
          <Dates profile={profile} setprofile={setprofile} />
          <button type='submit' className={classes.submitBtn}>
            Continue
          </button>
        </form>

        <Link to='/login' className={classes.redirectToLogin}>
          Already have an account?
        </Link>
        {error ? <div className={classes.error}> {error} </div> : null}
      </div>
    </div>
  )
}
