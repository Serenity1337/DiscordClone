import React, { useEffect, useState, useContext } from 'react'
import { ChannelListSidebar } from '../../Components/ChannelListSideBar/ChannelListSidebar'
import { ChannelMain } from '../../Components/ChannelMain/ChannelMain'
import ServersSideBar from '../../Components/ServersSideBar'
import AddChannelModal from '../../Modals/AddChannelModal'
import AddServerModal from '../../Modals/AddServerModal'
import classes from './ChannelPage.module.scss'
export const ChannelPage = (props) => {
  const [server, setserver] = useState({})
  const [addServerModalToggle, setaddServerModalToggle] = useState(false)
  const [addChannelModalToggle, setaddChannelModalToggle] = useState(false)

  useEffect(() => {
    setserver(props.server)
    console.log('test')
  }, [])
  return (
    <div className={classes.appContainer}>
      <ServersSideBar setaddServerModalToggle={setaddServerModalToggle} />
      <ChannelListSidebar
        server={props.server}
        serverIndex={props.serverIndex}
        setaddChannelModalToggle={setaddChannelModalToggle}
      />
      {addServerModalToggle ? (
        <AddServerModal setaddServerModalToggle={setaddServerModalToggle} />
      ) : null}
      {addChannelModalToggle ? (
        <AddChannelModal
          setaddChannelModalToggle={setaddChannelModalToggle}
          server={server}
          serverIndex={props.serverIndex}
        />
      ) : null}
      <ChannelMain
        server={props.server}
        setserver={setserver}
        channel={props.channel}
        serverIndex={props.serverIndex}
        channelIndex={props.channelIndex}
      />
    </div>
  )
}
