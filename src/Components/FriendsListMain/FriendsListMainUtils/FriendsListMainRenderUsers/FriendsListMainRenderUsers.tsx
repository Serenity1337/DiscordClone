import React, { useState, MouseEvent } from 'react'
import classes from './FriendsListMainRenderUsers.module.scss'
import catto from '../../../../utils/imgs/catto.png'
import { IoEllipsisVerticalSharp } from 'react-icons/io5'
import { FiMessageSquare, FiUserX } from 'react-icons/fi'
import { TiTick } from 'react-icons/ti'
import { BsX } from 'react-icons/bs'
import { v4 as uuidv4 } from 'uuid'
import { FaUserTimes } from 'react-icons/fa'
import { Link, useLocation } from 'react-router-dom'
import {
  addFriendHandler,
  acceptFriendRequest,
  unblockUserHandler,
  declineFriendRequest,
} from '../FriendsListMainHandlers'
import { User, Users } from '../../../../Redux/Action-creators/UserActions'
import { RootState } from '../../../../Redux/Reducers'
import { FriendsListMainRenderProfileModal } from '../FriendsListMainRenderProfileModal/FriendsListMainRenderProfileModal'
import { FriendListMainRenderStatus } from '../FriendListMainRenderStatus/FriendListMainRenderStatus'
import { io } from 'socket.io-client'
import { useDispatch, useSelector } from 'react-redux'
import { ThunkDispatch } from 'redux-thunk'

type OpenModalProfileType = {
  [key: string]: boolean
}

type FriendStatusStateType = {
  [key: string]: boolean,
  online: boolean,
  all: boolean,
  pending: boolean,
  blocked: boolean

}

type PropType = {
  friendStatusState: FriendStatusStateType,
  filteredFriendsArr: User[],
  openModalProfile: OpenModalProfileType,
  errorState: string,
  seterrorState: Function,
  setopenModalProfile: Function,
  setmodalProfileIndex: Function

}

export const FriendsListMainRenderUsers = (props:PropType) => {
  const dispatch = useDispatch()
  const user = useSelector((state:RootState) => state.user) as User
  const users = useSelector((state:RootState) => state.users) as Users
  // const { user, users } = reduxState
  const socket = io('ws://localhost:8080')
  let location = useLocation()

  const [usernameState, setusernameState] = useState('')
  const [mouseCoordX, setmouseCoordX] = useState(0)
  const [mouseCoordY, setmouseCoordY] = useState(0)
  const usernameInputHandler = (event:React.ChangeEvent<HTMLInputElement>):void => {
    setusernameState(event.target.value)
  }

  const openModalProfileHandler = (event:MouseEvent<HTMLDivElement>, user:User, index:number) => {
    event.preventDefault()
    if (event.button === 2) {
      const modalProfile = { [index]: true }
      props.setopenModalProfile(modalProfile)
      props.setmodalProfileIndex(index)
      setmouseCoordX(event.clientX)
      setmouseCoordY(event.clientY)

      return false
    }
    return false
  }

  const renderUsers:Function = () => {
    if (user.username && props.filteredFriendsArr) {
      // renders all friends regardless of the status
      if ((props.friendStatusState.all || props.friendStatusState.online) && props.filteredFriendsArr.length > 0) {
        return props.filteredFriendsArr.map((friend, index) => {
          if (friend.username) (
            <Link to={`${location.pathname}`} key={friend._id}>
            <div
              className={classes.userContainer}
              onContextMenu={(event:MouseEvent<HTMLDivElement>) =>
                openModalProfileHandler(event, friend, index)
              }
            >
              {props.openModalProfile && props.openModalProfile[index] ? (
                <FriendsListMainRenderProfileModal
                  mouseCoordY={mouseCoordY}
                  mouseCoordX={mouseCoordX}
                  friend={friend}
                  index={index}
                  seterrorState={props.seterrorState}
                  setopenModalProfile={props.setopenModalProfile}
                  socket={socket}
                />
              ) : null}
              <div className={classes.userProfile}>
                <div className={classes.friendListUserAvatar}>
                  <img src={catto} alt='' />
                  {<FriendListMainRenderStatus user={friend} />}
                </div>
                <div className={classes.friendUsername}>{friend.username} </div>
              </div>
              <div className={classes.btnContainer}>
                <div className={classes.msgButton}>
                  <FiMessageSquare
                    style={{
                      width: '20px',
                      height: '20px',
                      fill: '#b9bbbe',
                      stroke: 'none',
                    }}
                  />
                </div>
                <div className={classes.optionsBtn}>
                  <IoEllipsisVerticalSharp
                    style={{
                      width: '20px',
                      height: '20px',
                      fill: '#b9bbbe',
                      stroke: 'none',
                    }}
                  />
                </div>
              </div>
            </div>
          </Link>
          )
        } 
          
          
        )
      }

      if (props.friendStatusState.blocked) {
        return props.filteredFriendsArr.map((friend, index) => (
          <Link to={`${location.pathname}`} key={friend._id}>
            <div className={classes.userContainer}>
              <div className={classes.userProfile}>
                <div className={classes.friendListUserAvatar}>
                  <img src={catto} alt='' />
                  {<FriendListMainRenderStatus user={friend} />}
                </div>
                <div className={classes.friendUsername}>
                  {friend.username}
                  <div className={classes.blockedStatus}>{friend.status}</div>
                </div>
              </div>
              <div className={classes.btnContainer}>
                <div
                  className={classes.optionsBtn}
                  onClick={(event) =>
                    unblockUserHandler(
                      event,
                      friend,
                      index,
                      users,
                      dispatch,
                      props.seterrorState,
                      user
                    )
                  }
                >
                  <FaUserTimes
                    style={{
                      width: '20px',
                      height: '20px',
                      fill: '#b9bbbe',
                      stroke: 'none',
                    }}
                  />
                </div>
              </div>
            </div>
          </Link>
        ))
      }
      // -------------------------------------------------------
      // renders all pending user requests
      if (
        props.friendStatusState.pending &&
        props.filteredFriendsArr.length > 0
      ) {
        return props.filteredFriendsArr.map((friend, index) => (
          <Link to={`${location.pathname}`} key={friend._id}>
            <div className={classes.userContainer}>
              <div className={classes.userProfile}>
                <div className={classes.friendListUserAvatar}>
                  <img src={catto} alt='' />
                  {<FriendListMainRenderStatus user={friend} />}
                </div>
                <div className={classes.friendUsername}>{friend.username} </div>
              </div>
              {friend.status === 'incoming friend request' ? (
                <div className={classes.btnContainer}>
                  <div
                    className={classes.msgButton}
                    onClick={(event) =>
                      acceptFriendRequest(
                        event,
                        friend,
                        index,
                        users,
                        dispatch,
                        props.seterrorState,
                        user,
                        socket
                      )
                    }
                  >
                    <TiTick
                      className={classes.pendingAcceptBtn}
                      style={{
                        width: '20px',
                        height: '20px',
                        stroke: 'none',
                      }}
                    />
                  </div>
                  <div
                    className={classes.optionsBtn}
                    onClick={(event) =>
                      declineFriendRequest(
                        event,
                        friend,
                        index,
                        user,
                        users,
                        dispatch,
                        props.seterrorState,
                        socket
                      )
                    }
                  >
                    <BsX
                      className={classes.pendingCancelBtn}
                      style={{
                        width: '20px',
                        height: '20px',
                        stroke: 'none',
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div className={classes.btnContainer}>
                  <div
                    className={classes.optionsBtn}
                    onClick={(event) =>
                      declineFriendRequest(
                        event,
                        friend,
                        index,
                        user,
                        users,
                        dispatch,
                        props.seterrorState,
                        socket
                      )
                    }
                  >
                    <BsX
                      className={classes.pendingCancelBtn}
                      style={{
                        width: '20px',
                        height: '20px',
                        stroke: 'none',
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </Link>
        ))
      } else {
      }
      //---------------------------------------------------------
      // renders add friend UI
      if (props.friendStatusState.addFriend) {
        return (
          <div className={classes.addFriendContainer}>
            <div className={classes.addFriendHeading}>add friend</div>
            {!props.errorState ? (
              <div className={classes.addFriendSubHeading}>
                You can add a friend with their Discord Tag. It is cAsE
                sEnSiTiVe
              </div>
            ) : (
              <div className={classes.addFriendError}>{props.errorState}</div>
            )}
            <form
              action=''
              className={classes.submitAddFriend}
              onSubmit={(event) =>
                addFriendHandler(
                  event,
                  user,
                  usernameState,
                  users,
                  props.seterrorState,
                  dispatch,
                  uuidv4,
                  socket
                )
              }
            >
              <input
                type='text'
                name='username'
                id='username'
                className={classes.username}
                placeholder='Enter a username#0000'
                onChange={usernameInputHandler}
              />

              <button
                type='submit'
                disabled={usernameState.length > 0 ? false : true}
                className={
                  usernameState.length > 0
                    ? classes.addFriendSubmitBtn
                    : classes.addFriendSubmitBtnDisabled
                }
              >
                Send Friend Request
              </button>
            </form>
            <div className={classes.horizontalLine}></div>
          </div>
        )
      }
      //---------------------------------------------------------
    }
  }
  return <div className={classes.friendsList}>{renderUsers()}</div>
}
