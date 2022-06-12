require('dotenv').config()
const input = require('input')

const { TelegramClient, Api } = require('telegram')
const { StringSession } = require('telegram/sessions')
const { NewMessage } = require('telegram/events')

const libs = require('../libs')

describe('telegram', () => {
  let client
  const channels = new Map()

  before(async () => {
    const stringSession = new StringSession(process.env.API_SESSION)
    client = new TelegramClient(stringSession, Number(process.env.API_ID), process.env.API_HASH, {
      connectionRetries: 5,
      proxy: { socksType: Number(process.env.PROXY_SOCKET_TYPE), ip: process.env.PROXY_IP, port: Number(process.env.PROXY_PORT) },
    })
    await client.start({
      phoneNumber: process.env.PHONE,
      password: process.env.PASS,
      phoneCode: async () => await input.text('Please enter the code you received: '),
      forceSMS: false, // code from app
      onError: console.error,
    })
    console.log(client.session.save())
  })

  after(async () => {
    await client.destroy()
  })

  it.skip('send msg', async () => {
    await client.sendMessage('me', { message: 'Hello!' })
  })

  it('get channels', async () => {
    const result = await client.invoke(
      new Api.channels.GetChannels({
        id: ['binance_announcements', 'gateio_english_news', 'BinanceChinese'],
      }),
    )
    result.chats.forEach((i) => {
      channels.set(i.id.toString(), i)
    })
    console.log(channels)
  })

  it('receive msg', async () => {
    const handler = async (e) => {
      const msg = e.message
      const channelId = msg?.peerId?.channelId.toString()
      if (!channels.has(channelId)) {
        return
      }
      const chan = channels.get(channelId)
      console.log(`channel - ${chan.id}, ${chan.title}, ${chan.username}`, `message - ${msg.id}, ${msg.message}`)
    }
    client.addEventHandler(handler, new NewMessage({}))

    await libs.sleep(30 * 1000)
  })
})
