require('dotenv').config()
const input = require('input')

const { TelegramClient } = require('telegram')
const { StringSession } = require('telegram/sessions')

describe('telegram', () => {
  let client

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

  it('send msg', async () => {
    await client.sendMessage('me', { message: 'Hello!' })
  })
})
