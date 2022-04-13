import React, { useState, useContext } from 'react'
import DMMain from '../../Components/DMMain'
import FriendsListSideBar from '../../Components/FriendsListSideBar'
import ServersSideBar from '../../Components/ServersSideBar'
import AddServerModal from '../../Modals/AddServerModal'
import classes from './DirectMessaging.module.scss'

export const DirectMessaging = (props) => {
  const [addServerModalToggle, setaddServerModalToggle] = useState(false)
  return (
    <div className={classes.appContainer}>
      <ServersSideBar setaddServerModalToggle={setaddServerModalToggle} />
      <FriendsListSideBar />
      {addServerModalToggle ? (
        <AddServerModal setaddServerModalToggle={setaddServerModalToggle} />
      ) : null}
      <DMMain dm={props.dm} dmIndex={props.dmIndex} />
    </div>
  )
}
