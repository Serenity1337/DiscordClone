import React, { useState } from 'react'
import classes from './ServersSideBar.module.scss'
import catto from '../../utils/imgs/catto.png'
import { FaPlus } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '../../Redux/Reducers'
import { Servers, Server } from '../../Redux/Action-creators/ServersActions'

type DisplayStateType = {
  [key: string]: any
}

export const ServersSideBar = (props: {setaddServerModalToggle: Function}) => {
  const servers = useSelector((state:RootState) => state.servers) as Servers
  console.log(servers, '???')
  const [displayState, setdisplayState] = useState<DisplayStateType>({})
  const [positionState, setpositionState] = useState(0)
  const displayName = (event:React.MouseEvent<HTMLAnchorElement>, server:Server, index:number) => {
    setdisplayState({ [index]: true })
    setpositionState(event.currentTarget.getBoundingClientRect().top + 10)
    console.log(servers, 'testasd')
  }
  const removeName = (event:React.MouseEvent<HTMLAnchorElement>, server:Server, index:number) => {
    setdisplayState({ [index]: false })
    setpositionState(0)
  }
  const toggleModalOn = () => {
    props.setaddServerModalToggle(true)
  }
  return (
    <div className={classes.serverSideContainer}>
      <div className={classes.serversListContainer}>
        <div className={classes.addBtnContainer} onClick={toggleModalOn}>
          <FaPlus className={classes.addBtn} />
        </div>
        {servers.map((server, index) => (
          <Link
            className={classes.server}
            onMouseOut={(event) => removeName(event, server, index)}
            onMouseOver={(event) => displayName(event, server, index)}
            to={`/channels/${server._id}`}
            key={server._id}
          >
            <img src={catto} alt='' />
            {displayState[index] ? (
              <div
                className={classes.serverDisplayName}
                style={{
                  position: 'absolute',
                  top: `${positionState}px`,
                  left: '75px',
                }}
              >
                {server.serverName}
              </div>
            ) : null}
          </Link>
        ))}
      </div>
    </div>
  )
}
