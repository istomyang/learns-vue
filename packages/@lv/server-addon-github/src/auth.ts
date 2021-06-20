import { Channel, DataApi, Localer, MUser, Neter, PSM } from './'
import { request } from 'https'
import { runAsyncAll } from '@lv/shared/common'
import { error, log } from 'console'

class LoginApi {
  // 兼容，从其他地方移植
  private readonly localer: Localer
  private mUser: MUser
  private neter: Neter
  private readonly mode: string
  public api: DataApi
  constructor(api: DataApi) {
    this.api = api
    this.mode = api.mode
    this.localer = api.localer
    this.mUser = api.mUser
    this.neter = api.neter
  }

  /**
   * Get user's oauth info saving just now
   * @returns
   */
  async getNewLoginUser() {
    if (this.mode === 'full') {
      return await this.mUser.getNewLoginUser()
    }
  }

  async setUserToken(token: string) {
    if (this.mode === 'full') {
      await runAsyncAll(
        this.mUser.setOauthUserToken(token),
        this.localer.setOauthUserToken(token)
      )
    }
  }
}

/**
 * Addon: 身份验证
 */
export default async (koa, api: DataApi, psm: PSM) => {
  const loginApi = new LoginApi(api)

  koa.use(async (ctx, next) => {
    // receive code
    if (ctx.path === '/authorize') {
      const code = ctx.query['code']

      // TODO
      const port = 4000

      // get token
      const d = await loginApi.getNewLoginUser()
      const client_id = d.oauth.client_id
      const client_secret = d.oauth.client_secret
      const username = d.username

      const postData = JSON.stringify({
        client_id,
        client_secret,
        code,
        redirect_uri: `http://localhost:${port}/authorize`,
        state: 'istomyang',
      })

      const req = request(
        'https://github.com/login/oauth/access_token',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        },
        res => {
          res.setEncoding('utf-8')
          res.on('data', async chunk => {
            // de
            const token = (chunk as string).match(/(?<=access_token=)\w+(?=&)/g)

            // 存储密钥
            await loginApi.setUserToken(`token ${token}`)
            log('OAuth is Get!: ', `token ${token}`)

            psm.emit(Channel.TOKEN)

            // init use data
            loginApi.api.initUserData(username).then(() => {
              psm.emit(Channel.INIT)
            })
          })
        }
      )
      req.on('error', err => error(err))
      req.write(postData)
      req.end()
    }
    await next()
  })
}
