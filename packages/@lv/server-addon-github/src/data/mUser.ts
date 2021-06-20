import { Collection, Db } from 'mongodb'
import { LoginUserBasicInfo, User, UserStatus } from '../types/user'

export class MUser {
  public collection: Collection<User>

  constructor(db: Db) {
    this.collection = db.collection<User>('github')
  }

  async checkHasData() {
    try {
      return !!(await this.collection.findOne({ status: UserStatus.login }))
    } catch (e) {
      throw e
    }
  }

  async setNewLoginUser(data: User) {
    // check
    if (!(await this.hasUserInfo(data))) {
      try {
        await this.collection.insertOne(data)
      } catch (error) {
        throw error
      }
    }
  }

  /**
   * Get user who in oauth stage.
   * @returns
   */
  async getNewLoginUser(): Promise<User> {
    try {
      return this.collection.findOne({ status: UserStatus.oauth })
    } catch (error) {
      throw error
    }
  }

  async setOauthUserToken(token: string) {
    try {
      await this.collection.updateOne(
        { status: UserStatus.oauth },
        {
          $set: { 'oauth.token': token, status: UserStatus.login },
        }
      )
    } catch (e) {
      throw e
    }
  }

  /**
   * Check has Userinfo, auto delete
   * 1. if data has oauth, db hasn't, then return false.
   * 2. if data has no oauth, db has no oauth, then return true.
   * 3. if nothing to find, return false
   */
  async hasUserInfo(data: User): Promise<boolean> {
    const d = await this.collection.findOne({ username: data.username })
    if (!d) {
      return false
    }
    const r1 = data.oauth.client_id
    const r2 = d.oauth.client_id

    if (r1 && !r2) {
      // delete data
      await this.delUserInfo(data.username)

      return false
    }
    if (!r1 && !r2) return true
  }

  async delUserInfo(username: string) {
    try {
      await this.collection.deleteOne({ username: username })
    } catch (e) {
      throw e
    }
  }

  /**
   * Get all Login Users' info
   */
  async getAllUserBasicInfo(): Promise<LoginUserBasicInfo[]> {
    try {
      const result: LoginUserBasicInfo[] = []
      await this.collection
        .find({
          status: UserStatus.login,
        })
        .project({
          _id: 0,
          profile: {
            name: 1,
            login: 1,
            avatar_url: 1,
            bio: 1,
            location: 1,
            email: 1,
            html_url: 1,
          },
        })
        .forEach(user => {
          result.push({
            name: user.profile.name,
            login: user.profile.login,
            avatar_url: user.profile.avatar_url,
            bio: user.profile.bio,
            location: user.profile.location,
            email: user.profile.email,
            html_url: user.profile.html_url,
          } as LoginUserBasicInfo)
        })
      return result
    } catch (error) {
      throw error
    }
  }
}
