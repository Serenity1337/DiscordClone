import React, { useState } from 'react'
import classes from './AddChannelModal.module.scss'
import { v4 as uuidv4 } from 'uuid'
import Input from '../../Components/Shared/Input'
import Button from '../../Components/Shared/Button'
import { postRequest } from '../../utils/Api'
import { useSelector, useDispatch } from 'react-redux'
import { CreateServerAction, Server, Servers } from '../../Redux/Action-creators/ServersActions'
import { RootState } from '../../Redux/Reducers'

type PropsTypes = {
  setaddChannelModalToggle: Function,
  server: Server | null,
  serverIndex: number
}

export const AddChannelModal = (props:PropsTypes) => {
  const dispatch = useDispatch()
  const servers = useSelector((state:RootState) => state.servers) as Servers
  const [channelName, setchannelName] = useState('')
  const toggleModalOff = () => {
    props.setaddChannelModalToggle(false)
  }
  const channelNameHandler = (event: React.SyntheticEvent) => {
    const element = event.target as HTMLInputElement
    setchannelName(element.value)
  }
  const channelSubmitHandler = (event: React.SyntheticEvent) => {
    event.preventDefault()
    const channel = {
      channelName: channelName,
      channelDescription: '',
      messages: [],
      nsfw: false,
      _id: uuidv4(),
    }
    const serversCopy = [...servers]
    const serverCopy = props.server
    if (serverCopy && serverCopy.channels) {
      serverCopy.channels = [...serverCopy.channels, channel]
      serversCopy[props.serverIndex] = serverCopy
      const res = postRequest(
        `http://localhost:8000/discord/discord/updateServer/${serverCopy._id}`,
        serverCopy
      )
      res.then((response: {message: string}) => {
        if (!response.message) {
          dispatch(CreateServerAction(serverCopy))
          props.setaddChannelModalToggle(false)
        } else {
          // idk some kind of code for error handling??
        }
      })
    }
    
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
          <Input
            containerClass='channelModalContainer'
            label={{ for: 'channelName', text: 'Channel Name' }}
            input={{
              type: 'text',
              name: 'channelName',
              id: 'channelName',
              handler: channelNameHandler,
            }}
          />
          <div className={classes.btnContainer}>
            <Button
              styles={['channelCancelBtn']}
              type='button'
              handler={toggleModalOff}
            >
              Cancel
            </Button>
            {channelName.length > 0 ? (
              <Button styles={['channelSubmitBtn']} type='submit'>
                Create
              </Button>
            ) : (
              <Button styles={['channelSubmitBtnDisabled']} type='button'>
                Create
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
