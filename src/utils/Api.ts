// check if logged in
export const loggedIn = () => {
  const localStorageVal = localStorage.getItem('cordCopyToken')
  const userToken = JSON.parse(localStorageVal || '')
  if (!userToken) {
  } else {
    return
  }
}
export const getLoggedInUser = () => {
  const localStorageVal = localStorage.getItem('cordCopyToken')
  const userToken = JSON.parse(localStorageVal || '')
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

export const getRequest = (link:string) => {
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
// todo: fix the type here, no idea what to do with this fetch
export const postRequest = (link:string, payload:{}):any => {
  console.log(payload, 'payload')
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
