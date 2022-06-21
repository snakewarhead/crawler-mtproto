const nodemailer = require('nodemailer')
const { sleep } = require('./index')

const queue = []
const QUEUE_WAIT_TIME = 5 * 1000

let transporter

const init = async () => {
  if (!process.env.EMAIL_HOST) {
    throw new Error('email not config')
  }

  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    secure: true,
    auth: {
      user: process.env.EMAIL_NAME,
      pass: process.env.EMAIL_PASS,
    },
  })

  console.log('email init success')
}

const send = async (subject, text) => {
  if (!subject || !text) {
    console.log('subject or text is empty')
    return
  }

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_NAME,
      to: process.env.EMAIL_TO,
      subject,
      text,
    })

    console.log('email:', info.messageId, new Date(), subject, text)
  } catch (e) {
    console.error(e)
  }
}

const sendInQueue = (subject, text) => {
  queue.push({ subject, text })
}

const runQueue = async () => {
  while (true) {
    await sleep(QUEUE_WAIT_TIME)
    // console.log('queue: ', queue.length)

    const ct = queue.shift()
    if (!ct) {
      continue
    }

    await send(ct.subject, ct.text)
  }
}

module.exports = {
  init,
  send,
  sendInQueue,
  runQueue,
}
