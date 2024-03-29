import React, { useState } from 'react'
import classes from './ChannelMainForm.module.scss'
import { FiSmile } from 'react-icons/fi'
import { AiOutlineGift, AiOutlineGif } from 'react-icons/ai'
import dateFormat from 'dateformat'
import { v4 as uuidv4 } from 'uuid'
import { io } from 'socket.io-client'
import { useSelector } from 'react-redux'
import { postRequest } from '../../../../utils/Api'
import { ChannelType, Server, MessageType } from '../../../../Redux/Action-creators/ServersActions'
import { RootState } from '../../../../Redux/Reducers'
import { User } from '../../../../Redux/Action-creators/UsersActions'

  type PropsTypes = {
    setMessages: Function,
    server: Server,
    channel: ChannelType,
    channelIndex: number
  }

export const ChannelMainForm = (props:PropsTypes) => {
  const user:User | null = useSelector((state:RootState) => state.user) as User
  const [msg, setMsg] = useState('')

  const socket = io('http://localhost:8080')
  let now = new Date()

  const msgInputHandler = (event:React.SyntheticEvent) => {
    const element = event.target as HTMLInputElement
    setMsg(element.value)
  }

  const msgFormHandler = (event:React.SyntheticEvent) => {
    event.preventDefault()

    const msgId = uuidv4()
    const msgObject:MessageType = {} as MessageType
    let currDate = dateFormat(now, 'mm/dd/yyyy hh:MM TT')
    msgObject.sentDate = currDate
    msgObject.id = msgId
    msgObject.sender = user.username
    msgObject.msg = msg

    let channelClone = { ...props.channel }
    channelClone.messages = [...channelClone.messages, msgObject]
    let serverClone = { ...props.server }
    serverClone.channels[props.channelIndex] = channelClone

    const formElement = event.target as HTMLFormElement
    const inputElement = formElement[0] as HTMLInputElement
    inputElement.value = ''

    const serverResponse = postRequest(
      `http://localhost:8000/discord/discord/updateServer/${props.server._id}`,
      serverClone
    )

    serverResponse.then((res:string) => {
      if (res) {
        props.setMessages((prevState:MessageType[]) => {
          const prevStateClone = [...prevState, msgObject]
          return [...prevStateClone]
        })
      }
    })

    socket.emit(
      'send-channel-message',
      props.server._id,
      props.channel._id,
      msgObject
    )
  }

  return (
    <div className={classes.DMMainSendMsgContainer}>
      <form
        className={classes.MsgContainerUploadBtn}
        onSubmit={msgFormHandler}
        autoComplete='off'
      >
        <div className={classes.MsgUploadBtnContainer}>
          <div className={classes.MsgUploadBtn}>+</div>
        </div>
        {/* <input type='file' name='uploadImg' id='uploadImg' /> */}
        <input
          type='text'
          className={classes.MsgContainerMsgInput}
          name='msgInput'
          id='msgInput'
          placeholder={`Message #${props.channel.channelName}`}
          onChange={msgInputHandler}
        />
        <button
          type='submit'
          style={{
            width: '0',
            height: '0',
            margin: '0',
            padding: '0',
            border: '0',
          }}
        ></button>
      </form>

      <div className={classes.MsgContainerExtras}>
        <AiOutlineGift
          fill='#dcddde'
          style={{
            width: '24px',
            height: '20px',
            cursor: 'pointer',
          }}
        />
        <AiOutlineGif
          fill='#40444b'
          style={{
            width: '24px',
            height: '20px',
            backgroundColor: '#dcddde',
            margin: '0px 15px',
            cursor: 'pointer',
          }}
        />
        <FiSmile
          fill='#dcddde'
          style={{
            width: '24px',
            height: '24px',
            cursor: 'pointer',
          }}
        />
      </div>
    </div>
  )
}
