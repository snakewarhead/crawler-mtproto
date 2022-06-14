require('dotenv').config()
const email = require('./libs/emailUtils')
const telegram = require('./libs/telegram')

const main = async () => {
  await email.init()
  await telegram.init()

  await Promise.all([email.runQueue(), telegram.receiving(process.env.CHANNELS.split(','), email.sendInQueue)])
}

main().catch(console.error)
