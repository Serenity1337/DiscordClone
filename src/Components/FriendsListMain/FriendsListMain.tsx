import React, { useState, useEffect } from 'react'
import classes from './FriendsListMain.module.scss'
import { FaUserFriends } from 'react-icons/fa'
import { CgInbox } from 'react-icons/cg'
import { IoIosHelpCircleOutline } from 'react-icons/io'
import {RootState} from '../../Redux/Reducers'
// import { discordTag } from '../../utils/Functions'
import NewDm from '../../utils/imgs/NewDm'

import { FriendsListMainRenderUsers } from './FriendsListMainUtils/FriendsListMainRenderUsers/FriendsListMainRenderUsers'
import { useSelector } from 'react-redux'
import { User } from '../../Redux/Action-creators/UserActions'

export const FriendsListMain = () => {

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
  // State to filter out online,all,pending or blocked users
  const user = useSelector((state:RootState) => state.user) as User
  const [friendStatusState, setfriendStatusState] = useState({
    online: false,
    all: true,
    pending: false,
    blocked: false,
  })
  const [filteredFriendsArr, setfilteredFriendsArr] = useState<User[]>([])
  const [openModalProfile, setopenModalProfile] = useState<OpenModalProfileType>({})

  const [modalProfileIndex, setmodalProfileIndex] = useState(0)
  const [errorState, seterrorState] = useState('')
  // This useEffect filters online/blocked/all/pending users based on filter
  useEffect(() => {
    if (user.friends) {
      if (friendStatusState.online === true ) {
        let arrCopy = [...user.friends.accepted]
        let filteredArr = arrCopy.filter(
          (user, index) => user.status !== 'offline'
        )
        setfilteredFriendsArr(filteredArr)
      }
      if (friendStatusState.all === true) {
        let arrCopy = [...user.friends.accepted]
        setfilteredFriendsArr(arrCopy)
      }
      if (friendStatusState.pending === true) {
        let arrCopy = [...user.friends.pending]
        setfilteredFriendsArr(arrCopy)
      }
      if (friendStatusState.blocked === true) {
        let arrCopy = [...user.friends.blocked]
        setfilteredFriendsArr(arrCopy)
      }
    }
  }, [friendStatusState, user])
  useEffect(() => {
    if (openModalProfile[modalProfileIndex] === true) {
      document.addEventListener('click', closeModalProfileHandler)
    } 
    return () => {
      document.removeEventListener('click', closeModalProfileHandler)
    }
  }, [openModalProfile])
  // username input handler

  //--------------------------------------------------------------
  // opens the profile modal

  const closeModalProfileHandler = () => {

    let obj:OpenModalProfileType = {[`${modalProfileIndex}`]: false}
    setopenModalProfile(obj)
  }

  //------------------------------------------------------------
  // Filter handler to filter the users based on this filter
  const filterHandler = (event:React.MouseEvent<HTMLElement>) => {
    seterrorState('')
    const eventTarget = event.target as HTMLButtonElement;
    if (eventTarget.textContent === 'Add Friend') {
      let obj:FriendStatusStateType = {} as FriendStatusStateType
      let key = 'addFriend'
      obj[key] = true
      setfriendStatusState(obj)
    } else {
      if (eventTarget.textContent) {
        let obj:FriendStatusStateType = {} as FriendStatusStateType
        let key = eventTarget.textContent.toLowerCase()
        obj[key] = true
        setfriendStatusState(obj)
      }
      
    }
  }
  //-------------------------------------------------------------
  // function to return status icons based on the conditions

  //--------------------------------------------------------------
  // renders the online/all/blocked/pending users based on filters

  // renders the header text for example "pending -- x" based on condition
  const renderHeading = () => {
    if (friendStatusState.online === true) {
      return (
        <div className={classes.friendsHeading}>
          online <div className={classes.horizontalLine}></div>
          {filteredFriendsArr.length}
        </div>
      )
    }
    if (friendStatusState.all === true) {
      return (
        <div className={classes.friendsHeading}>
          all friends <div className={classes.horizontalLine}></div>
          {filteredFriendsArr.length}
        </div>
      )
    }
    if (friendStatusState.pending === true) {
      return (
        <div className={classes.friendsHeading}>
          pending <div className={classes.horizontalLine}></div>
          {filteredFriendsArr.length}
        </div>
      )
    }
    if (friendStatusState.blocked === true) {
      return (
        <div className={classes.friendsHeading}>
          blocked <div className={classes.horizontalLine}></div>
          {filteredFriendsArr.length}
        </div>
      )
    }
  }
  // -------------------------------------------------------------
  return (
    <div className={classes.friendsListMainContainer}>
      <div className={classes.friendsListMainNavContainer}>
        <ul className={classes.friendsListMainNavigation}>
          <h1 className={classes.friendsListMainHeading}>
            <FaUserFriends
              style={{
                width: '24px',
                height: '24px',
                margin: '0px 10px 0px 25px',
                fill: '#72767d',
              }}
            />
            Friends
            <div className={classes.verticalLine}></div>
          </h1>
          <li onClick={(event) => filterHandler(event)}>Online</li>
          <li onClick={(event) => filterHandler(event)}>All</li>
          <li onClick={(event) => filterHandler(event)}>Pending</li>
          <li onClick={(event) => filterHandler(event)}>Blocked</li>
          <li
            onClick={(event) => filterHandler(event)}
            className={classes.addAFriendBtn}
          >
            Add Friend
          </li>
        </ul>
        <div className={classes.friendsListMainSecondaryNavigation}>
          <NewDm  />
          <div className={classes.verticalLine}></div>
          <CgInbox className={classes.navIcon} />
          <IoIosHelpCircleOutline className={classes.navIcon} />
        </div>
      </div>
      <div
        className={classes.verticalLine}
        style={{
          width: '100%',
          height: '1.5px',
          backgroundColor: 'rgb(32, 34, 37)',
        }}
      ></div>

      {renderHeading()}
      <FriendsListMainRenderUsers
        friendStatusState={friendStatusState}
        filteredFriendsArr={filteredFriendsArr}
        openModalProfile={openModalProfile}
        errorState={errorState}
        seterrorState={seterrorState}
        setopenModalProfile={setopenModalProfile}
        setmodalProfileIndex={setmodalProfileIndex}
      />
    </div>
  )
}
