const telegram = require('../libs/telegram')

describe('telegram', () => {
  before(async () => {
    await telegram.init()
  })

  after(async () => {
    await telegram.destroy()
  })

  it('send msg', async () => {
    await telegram.sendMsg('me', 'test')
  })

  it('receive msg', async () => {
    const chanArray = process.env.CHANNELS.split(',')
    await telegram.receiving(chanArray)
  })
})
