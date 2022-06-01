import React, { useEffect, useState } from 'react'
import classes from './Dates.module.scss'
import { CreateUserAction, Users, User } from '../../Redux/Action-creators/UsersActions'
type Props = {
    profile: User,
    setprofile: Function
}
export const Dates = (props: Props) => {
  
  const { setprofile, profile } = props
  const [yearDates, setyearDates] = useState<number[]>([])
  const [monthDates, setmonthDates] = useState([
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ])
  const [dayDates, setdayDates] = useState<number[]>([])
  useEffect(() => {
    let yearTemp:any[] | null = []
    for (let index = 0; index <= 121; index++) {
      yearTemp = [...yearTemp, 2021 - index]
    }
    setyearDates(yearTemp)
    let dayTemp:number[] = []
    for (let index = 1; index <= 31; index++) {
      dayTemp = [...dayTemp, index]
    }
    setdayDates(dayTemp)
  }, [])

  const profileHandler = (event:React.ChangeEvent<HTMLSelectElement>):void => {
    let value = event.target.name
    let profileCopy:User = { ...profile }
    profileCopy.birthday[value] = event.target.value
    setprofile(profileCopy)
    console.log(event.target.name)
  }
  return (
    <div className={classes.inputContainer}>
      <label htmlFor='year'>DATE OF BIRTH</label>
      <div className={classes.selectionsContainer}>
        <select
          name='day'
          id='day'
          className={classes.days}
          onChange={profileHandler}
        >
          <option value=''>Select</option>
          {dayDates.map((day, i) => (
            <option value={day} key={day + i}>
              {day}
            </option>
          ))}
        </select>
        <select
          name='month'
          id='month'
          className={classes.months}
          onChange={profileHandler}
        >
          <option value=''>Select</option>
          {monthDates.map((month, i) => (
            <option value={i + 1} key={month}>
              {month}
            </option>
          ))}
        </select>
        <select
          name='year'
          id=''
          placeholder='select'
          className={classes.years}
          onChange={profileHandler}
        >
          <option value=''>Select</option>
          {yearDates.map((num, index) => (
            <option value={num} key={num}>
              {num}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
