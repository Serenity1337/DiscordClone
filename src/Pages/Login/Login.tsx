import classes from './Login.module.scss'
import React, { useState, useEffect } from 'react'
import { Link, Redirect } from 'react-router-dom'
import Input from '../../Components/Shared/Input'
import Button from '../../Components/Shared/Button'
import { postRequest } from '../../utils/Api'
import { UpdateUserAction } from '../../Redux/Action-creators/UserActions'
import { FetchUsersAction, Users, User } from '../../Redux/Action-creators/UsersActions'
import { useDispatch, useSelector } from 'react-redux'
import {RootState} from '../../Redux/Reducers'

export const Login = () => {
  const dispatch = useDispatch()
  const users: Users = useSelector((state: RootState) => state.users)
  const [profile, setprofile] = useState({email: '', password: ''})
  const [error, seterror] = useState('')
  const [redirected, setredirected] = useState(false)

  type ProfileCopy = {
    [key: string]: string,
    email: string,
    password: string,
  }

  useEffect(() => {
    dispatch(FetchUsersAction())
  }, [])

  const profileHandler = (event:React.ChangeEvent<HTMLInputElement>): void => {
    const key:string = event.target.name
    let profileCopy: ProfileCopy = { ...profile }
      profileCopy[key] = event.target.value 
    
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
  const profileSubmitHandler = (event:React.SyntheticEvent): void => {
    event.preventDefault()
    let profileCopy = { ...profile }
    const res = postRequest(
      `http://localhost:8000/discord/discord/login`,
      profileCopy
    )
    res.then((response: {id: string, token: string}) => {
      if (response) {
        localStorage.setItem(
          'cordCopyToken',
          JSON.stringify({ id: response.id, token: response.token })
        )
        const user:User = users.filter((currUser) => currUser._id === response.id)[0]
        dispatch(UpdateUserAction(user))
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
                key={inputElement.label.text}
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
