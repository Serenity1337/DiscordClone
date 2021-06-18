import React, { useState } from 'react'
import classes from './AddServerModal.module.scss'
import catto from '../../utils/imgs/catto.png'
import { v4 as uuidv4 } from 'uuid'
export const AddServerModal = (props) => {
  const [serverName, setserverName] = useState('')
  const toggleModalOff = () => {
    props.setaddServerModalToggle(false)
  }
  const serverNameHandler = (event) => {
    setserverName(event.target.value)
  }
  const serverSubmitHandler = (event) => {
    event.preventDefault()
    const server = {
      serverName: serverName,
      avatar: '../../utils/imgs/catto.png',
      owner: `${props.user.username}`,
      members: [],
      channels: [
        {
          channelName: 'general',
          channelDescription: '',
          messages: [],
          nsfw: 'false',
          _id: uuidv4(),
        },
      ],
    }
    const serversCopy = [server, ...props.servers]
    fetch('http://localhost:8000/discord/discord/createServer', {
      method: 'POST',
      body: JSON.stringify(server),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((header) => {
      if (header.ok) {
        props.setservers(serversCopy)
        props.setaddServerModalToggle(false)
      }
    })
  }
  return (
    <div className={classes.modalBG}>
      <div className={classes.modalContainer}>
        <h1 className={classes.serverHeader}>Customize your server</h1>
        <p className={classes.serverSubHeading}>
          Give your new server a personality with a name and icon.
          <br />
          You can always change it later.
        </p>
        <img src={catto} alt='' className={classes.serverLogo} />
        <form
          action=''
          className={classes.createServerForm}
          onSubmit={serverSubmitHandler}
        >
          <label htmlFor='serverName' className={classes.serverNameLabel}>
            Server Name
          </label>
          <input
            type='text'
            name='serverName'
            id='serverName'
            className={classes.serverNameInput}
            onChange={serverNameHandler}
          />
          <div className={classes.btnContainer}>
            <button
              type='button'
              className={classes.serverCancelBtn}
              onClick={toggleModalOff}
            >
              Cancel
            </button>
            {serverName.length > 0 ? (
              <button className={classes.serverSubmitBtn} type='submit'>
                Create
              </button>
            ) : (
              <button className={classes.serverSubmitBtnDisabled} type='button'>
                Create
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
