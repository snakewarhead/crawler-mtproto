require('dotenv').config()
const telegram = require('./libs/telegram')

const main = async () => {
  await telegram.init()

  while (true) {
    try {
      await telegram.receiving(process.env.CHANNELS.split(','))
    } catch (e) {
      console.error(e)
    }

    console.log('retrying receive')
  }
}

main().catch(console.error)
