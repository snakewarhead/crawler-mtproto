require('dotenv').config()
const email = require('./libs/emailSend')
const telegram = require('./libs/telegram')

const main = async () => {
  await telegram.init()
  await telegram.receiving(process.env.CHANNELS.split(','), email.send)
}

main().catch(console.error)
