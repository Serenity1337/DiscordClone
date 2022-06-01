export const discordTag = () => {
  const randomNum = Math.floor(Math.random() * Math.floor(10000))
  if (randomNum / 1000 >= 1) {
    return `#${randomNum}`
  }
  if (randomNum / 100 >= 1) {
    return `#0${randomNum}`
  }
  if (randomNum / 10 > 1) {
    return `#00${randomNum}`
  }
  return `#000${randomNum}`
}
