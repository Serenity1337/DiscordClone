import React, { useEffect, useState } from 'react'
import classes from './ServersSideBar.module.scss'
import catto from '../../utils/imgs/catto.png'
import { FaPlus } from 'react-icons/fa'

export const ServersSideBar = (props) => {
  const [displayState, setdisplayState] = useState({})
  const [positionState, setpositionState] = useState(0)
  const displayName = (event, server, index) => {
    setdisplayState({ [index]: true })
    setpositionState(event.currentTarget.getBoundingClientRect().top + 10)
  }
  const removeName = (event, server, index) => {
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
        {props.servers.map((server, index) => (
          <div
            className={classes.server}
            onMouseOut={(event) => removeName(event, server, index)}
            onMouseOver={(event) => displayName(event, server, index)}
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
                {server.servername}
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  )
}
