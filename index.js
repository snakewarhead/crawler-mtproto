require('dotenv').config()
const email = require('./libs/emailSend')
const telegram = require('./libs/telegram')

const main = async () => {
  await telegram.init()
  await telegram.receiving(process.env.CHANNELS.split(','), async (title, content) => {
    await email.send(title, content, undefined, undefined, { translate: true })
  })
}

main().catch(console.error)
