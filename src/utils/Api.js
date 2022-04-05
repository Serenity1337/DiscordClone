// check if logged in
export const loggedIn = () => {
  const userToken = JSON.parse(localStorage.getItem('cordCopyToken'))
  if (!userToken) {
  } else {
    return
  }
}
export const getLoggedInUser = () => {
  const userToken = JSON.parse(localStorage.getItem('cordCopyToken'))
  if (userToken) {
    return fetch(
      `http://localhost:8000/discord/discord/getSingleUser/${userToken.id}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
      .then((header) => {
        return header.json()
      })
      .then((response) => {
        if (response) return response
      })
      .catch((e) => {
        return e
      })
  }
}
export const getUsers = () => {
  return fetch(`http://localhost:8000/discord/discord/getAllUsers`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((header) => {
      return header.json()
    })
    .then((response) => {
      if (response) return response
    })
    .catch((e) => {
      return e
    })
}
export const getServers = () => {
  return fetch(`http://localhost:8000/discord/discord/getAllServers`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((header) => {
      return header.json()
    })
    .then((response) => {
      if (response) return response
    })
    .catch((e) => {
      return e
    })
}

export const getRequest = (link) => {
  return fetch(`${link}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((header) => {
      return header.json()
    })
    .then((response) => {
      if (response) return response
    })
    .catch((e) => {
      return e
    })
}

export const postRequest = (link, payload) => {
  return fetch(`${link}`, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((header) => {
      return header.json()
    })
    .catch((e) => {
      return e
    })
}
