import React from 'react'
import classes from './RenderUsersModule.scss'

export const renderUsers = (props) => {
  if (props.user.username) {
    // renders all friends regardless of the status
    if (friendStatusState.all || friendStatusState.online) {
      return filteredFriendsArr.map((user, index) => (
        <Link to={`${location.pathname}`}>
          <div
            className={classes.userContainer}
            onContextMenu={(event) =>
              openModalProfileHandler(event, user, index)
            }
          >
            {openModalProfile[index] ? renderProfileModal(user, index) : null}
            <div className={classes.userProfile}>
              <div className={classes.friendListUserAvatar}>
                <img src={catto} alt='' />
                {renderStatus(user, index)}
              </div>
              <div className={classes.friendUsername}>{user.username} </div>
            </div>
            <div className={classes.btnContainer}>
              <div className={classes.msgButton}>
                <FiMessageSquare
                  style={{
                    width: '20px',
                    height: '20px',
                    fill: '#b9bbbe',
                    stroke: 'none',
                  }}
                />
              </div>
              <div className={classes.optionsBtn}>
                <IoEllipsisVerticalSharp
                  style={{
                    width: '20px',
                    height: '20px',
                    fill: '#b9bbbe',
                    stroke: 'none',
                  }}
                />
              </div>
            </div>
          </div>
        </Link>
      ))
    }

    if (friendStatusState.blocked) {
      return filteredFriendsArr.map((user, index) => (
        <Link to={`${location.pathname}`}>
          <div className={classes.userContainer}>
            <div className={classes.userProfile}>
              <div className={classes.friendListUserAvatar}>
                <img src={catto} alt='' />
                {renderStatus(user, index)}
              </div>
              <div className={classes.friendUsername}>
                {user.username}
                <div className={classes.blockedStatus}>{user.status}</div>
              </div>
            </div>
            <div className={classes.btnContainer}>
              <div
                className={classes.optionsBtn}
                onClick={(event) =>
                  unblockUserHandler(
                    event,
                    user,
                    index,
                    props.users,
                    props.setuser,
                    seterrorState,
                    props.user
                  )
                }
              >
                <FaUserTimes
                  style={{
                    width: '20px',
                    height: '20px',
                    fill: '#b9bbbe',
                    stroke: 'none',
                  }}
                />
              </div>
            </div>
          </div>
        </Link>
      ))
    }
    // -------------------------------------------------------
    // renders all pending user requests
    if (friendStatusState.pending && filteredFriendsArr.length > 0) {
      return filteredFriendsArr.map((user, index) => (
        <Link to={`${location.pathname}`}>
          <div className={classes.userContainer}>
            <div className={classes.userProfile}>
              <div className={classes.friendListUserAvatar}>
                <img src={catto} alt='' />
                {renderStatus(user, index)}
              </div>
              <div className={classes.friendUsername}>{user.username} </div>
            </div>
            {user.status === 'incoming friend request' ? (
              <div className={classes.btnContainer}>
                <div
                  className={classes.msgButton}
                  onClick={(event) =>
                    acceptFriendRequest(
                      event,
                      user,
                      index,
                      props.users,
                      props.setuser,
                      props.setusers,
                      seterrorState,
                      props.user
                    )
                  }
                >
                  <TiTick
                    className={classes.pendingAcceptBtn}
                    style={{
                      width: '20px',
                      height: '20px',
                      stroke: 'none',
                    }}
                  />
                </div>
                <div
                  className={classes.optionsBtn}
                  onClick={(event) =>
                    declineFriendRequest(
                      event,
                      user,
                      index,
                      props.user,
                      props.users,
                      props.setuser,
                      props.setusers,
                      seterrorState
                    )
                  }
                >
                  <BsX
                    className={classes.pendingCancelBtn}
                    style={{
                      width: '20px',
                      height: '20px',
                      stroke: 'none',
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className={classes.btnContainer}>
                <div
                  className={classes.optionsBtn}
                  onClick={(event) => declineFriendRequest(event, user, index)}
                >
                  <BsX
                    className={classes.pendingCancelBtn}
                    style={{
                      width: '20px',
                      height: '20px',
                      stroke: 'none',
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </Link>
      ))
    } else {
    }
    //---------------------------------------------------------
    // renders add friend UI
    if (friendStatusState.addFriend) {
      return (
        <div className={classes.addFriendContainer}>
          <div className={classes.addFriendHeading}>add friend</div>
          {!errorState ? (
            <div className={classes.addFriendSubHeading}>
              You can add a friend with their Discord Tag. It is cAsE sEnSiTiVe
            </div>
          ) : (
            <div className={classes.addFriendError}>{errorState}</div>
          )}
          <form
            action=''
            className={classes.submitAddFriend}
            onSubmit={(event) =>
              addFriendHandler(
                event,
                props.user,
                usernameState,
                props.users,
                seterrorState,
                props.setusers,
                props.setuser,
                uuidv4
              )
            }
          >
            <input
              type='text'
              name='username'
              id='username'
              className={classes.username}
              placeholder='Enter a username#0000'
              onChange={usernameInputHandler}
            />

            <button
              type='submit'
              disabled={usernameState.length > 0 ? false : true}
              className={
                usernameState.length > 0
                  ? classes.addFriendSubmitBtn
                  : classes.addFriendSubmitBtnDisabled
              }
            >
              Send Friend Request
            </button>
          </form>
          <div className={classes.horizontalLine}></div>
        </div>
      )
    }
    //---------------------------------------------------------
  }
}
