import React, { useState } from 'react'
import classes from './AddServerModal.module.scss'
import catto from '../../utils/imgs/catto.png'
import { v4 as uuidv4 } from 'uuid'
import Input from '../../Components/Shared/Input'
import Button from '../../Components/Shared/Button'
import { postRequest } from '../../utils/Api'
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
    const res = postRequest(
      `http://localhost:8000/discord/discord/createServer`,
      server
    )
    res.then((response) => {
      if (!response.message) {
        props.setservers(serversCopy)
        props.setaddServerModalToggle(false)
      } else {
        // idk some kind of code for error handling??
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
          <Input
            containerClass='serverModalContainer'
            label={{ for: 'serverName', text: 'Server Name' }}
            input={{
              type: 'text',
              name: 'serverName',
              id: 'serverName',
              handler: serverNameHandler,
            }}
          />
          <div className={classes.btnContainer}>
            <Button
              styles={['serverCancelBtn']}
              type='button'
              handler={toggleModalOff}
            >
              Cancel
            </Button>
            {serverName.length > 0 ? (
              <Button styles={['serverlSubmitBtn']} type='submit'>
                Create
              </Button>
            ) : (
              <Button styles={['serverSubmitBtnDisabled']} type='button'>
                Create
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
