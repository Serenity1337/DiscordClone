import React, { useState } from 'react'
import classes from './AddChannelModal.module.scss'
import { v4 as uuidv4 } from 'uuid'
export const AddChannelModal = (props) => {
  const [channelName, setchannelName] = useState('')
  const toggleModalOff = () => {
    props.setaddChannelModalToggle(false)
  }
  const channelNameHandler = (event) => {
    setchannelName(event.target.value)
  }
  const channelSubmitHandler = (event) => {
    event.preventDefault()
    const channel = {
      channelName: channelName,
      channelDescription: '',
      messages: [],
      nsfw: false,
      _id: uuidv4(),
    }
    const serversCopy = [...props.servers]
    const serverCopy = props.server
    serverCopy.channels = [...serverCopy.channels, channel]
    serversCopy[props.serverIndex] = serverCopy
    fetch(
      `http://localhost:8000/discord/discord/updateServer/${serverCopy._id}`,
      {
        method: 'POST',
        body: JSON.stringify(serverCopy),
        headers: {
          'Content-Type': 'application/json',
        },
      }
    ).then((header) => {
      if (header.ok) {
        props.setservers(serversCopy)
        props.setaddChannelModalToggle(false)
      }
    })
  }
  return (
    <div className={classes.modalBG}>
      <div className={classes.modalContainer}>
        <h1 className={classes.channelHeader}>Create a Channel</h1>
        <form
          action=''
          className={classes.createChannelForm}
          onSubmit={channelSubmitHandler}
        >
          <label htmlFor='channelName' className={classes.channelNameLabel}>
            Channel Name
          </label>
          <input
            type='text'
            name='channelName'
            id='channelName'
            className={classes.channelNameInput}
            onChange={channelNameHandler}
          />
          <div className={classes.btnContainer}>
            <button
              type='button'
              className={classes.channelCancelBtn}
              onClick={toggleModalOff}
            >
              Cancel
            </button>
            {channelName.length > 0 ? (
              <button className={classes.channelSubmitBtn} type='submit'>
                Create
              </button>
            ) : (
              <button
                className={classes.channelSubmitBtnDisabled}
                type='button'
              >
                Create
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
