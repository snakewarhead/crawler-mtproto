const input = require('input')

const { TelegramClient, Api } = require('telegram')
const { StringSession } = require('telegram/sessions')
const { NewMessage } = require('telegram/events')

const { sleep } = require('./index')

let client

const init = async () => {
  // login
  const stringSession = new StringSession(process.env.API_SESSION)
  client = new TelegramClient(stringSession, Number(process.env.API_ID), process.env.API_HASH, {
    connectionRetries: Number(process.env.API_RETRY),
    proxy: process.env.PROXY_SOCKET_TYPE
      ? { socksType: Number(process.env.PROXY_SOCKET_TYPE), ip: process.env.PROXY_IP, port: Number(process.env.PROXY_PORT) }
      : undefined,
  })
  await client.start({
    phoneNumber: process.env.PHONE,
    password: process.env.PASS,
    phoneCode: async () => await input.text('Please enter the code you received: '),
    forceSMS: false, // code from app
    onError: console.error,
  })
  console.log('session:', client.session.save())
}

const destroy = async () => {
  await client.destroy()
}

const receiving = async (chanArray, onMsg) => {
  // get channels
  const channels = new Map()
  const result = await client.invoke(
    new Api.channels.GetChannels({
      id: chanArray,
    }),
  )
  result.chats.forEach((i) => {
    channels.set(i.id.toString(), i)
    console.log(`${i.id.toString()} - ${i.username} - ${i.title}`)
  })

  const handler = async (m) => {
    try {
      const msg = m.message
      const channelId = msg?.peerId?.channelId.toString()
      if (!channels.has(channelId)) {
        return
      }
      const chan = channels.get(channelId)

      const title = `${chan.id}, ${chan.title}, ${chan.username}`
      const content = `${msg.id}, ${msg.message}`
      console.log(`channel - ${title}`, `message - ${content}`)

      await onMsg(title, content)
    } catch (e) {
      console.error(e)
    }
  }
  client.addEventHandler(handler, new NewMessage({}))

  while (true) {
    await sleep(60 * 1000)
  }
}

const sendMsg = async (who, msg) => {
  await client.sendMessage(who, { message: msg })
}

module.exports = {
  init,
  destroy,
  receiving,
  sendMsg,
}
