import internetAvailable from 'internet-available'

export const isOnline = async () => {
  try {
    await internetAvailable({
      domainName: 'api.github.com',
      host: '8.8.8.8',
      timeout: 2000,
      retries: 3,
    })
    return true
  } catch (error) {
    throw error
  }
}
