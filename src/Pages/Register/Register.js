import classes from './Register.module.scss'
import React, { useState, useContext } from 'react'
import Dates from '../../Components/Dates'
import { Link, Redirect } from 'react-router-dom'
import { discordTag } from '../../utils/Functions'
import { CreateUserAction } from '../../Redux/Action-creators/UsersActions'
import Button from '../../Components/Shared/Button'
import Input from '../../Components/Shared/Input'
import { postRequest } from '../../utils/Api'
import { useSelector, useDispatch } from 'react-redux'

export const Register = () => {
  const dispatch = useDispatch()
  const users = useSelector((state) => state.users)

  const [profile, setprofile] = useState({ birthday: {} })
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
      label: { for: 'username', text: 'USERNAME' },
      input: {
        type: 'text',
        name: 'username',
        id: 'username',
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
    {
      containerClass: '',
      label: { for: 'rpassword', text: 'REPEAT PASSWORD' },
      input: {
        type: 'password',
        name: 'rpassword',
        id: 'rpassword',
        handler: profileHandler,
      },
    },
  ]

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
        profileCopy.friends = { pending: [], accepted: [], blocked: [] }
        profileCopy.status = 'online'
        delete profileCopy.rpassword
        profileCopy.tag = discordTag()
        profileCopy.DMS = []
        const usersCopy = [...users, profileCopy]
        seterror('')
        const res = postRequest(
          'http://localhost:8000/discord/discord/register',
          profileCopy
        )
        res.then((res) => {
          if (res.errmsg) {
            seterror('Email is already taken, please choose a different one')
          } else {
            // setusers(usersCopy)
            dispatch(CreateUserAction(profileCopy))
            console.log(users)
            setredirected(true)
          }
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
          <Dates profile={profile} setprofile={setprofile} />

          <Button styles={['registerSubmitBtn']} type='submit'>
            Continue
          </Button>
        </form>

        <Link to='/login' className={classes.redirectToLogin}>
          Already have an account?
        </Link>
        {error ? <div className={classes.error}> {error} </div> : null}
        {redirected ? <Redirect to='/login' /> : null}
      </div>
    </div>
  )
}
