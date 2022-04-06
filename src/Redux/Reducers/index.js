import { combineReducers } from 'redux'
import { ServersReducer } from './ServersReducer'
import { UsersReducer } from './UsersReducer'
import { UserReducer } from './UserReducer'
const Reducers = combineReducers({
  user: UserReducer,
  servers: ServersReducer,
  users: UsersReducer,
})
export default Reducers
