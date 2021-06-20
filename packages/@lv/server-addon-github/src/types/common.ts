import { User } from './user'

export enum Status {
  success,
  faild,
  has,
}

export interface Result {
  status: Status
  data?: string | any[] | any
  message?: string
}

export type NetResult = {
  _b: boolean
  error?: any
}

export interface IDataClass {
  // use for account management
  setNewLoginUser(data: User)
  getNewLoginUser(): Promise<User>
  setOauthUserToken(token: string)
}
