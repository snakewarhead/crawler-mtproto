require('dotenv').config()
const axios = require('axios').default

const config = {
  baseURL: process.env.EMAIL_API_URL,
  timeout: Number(process.env.EMAIL_API_TIMEOUT),
}

/**
 * send a email
 *
 * @param {*} subject
 * @param {*} text
 * @param {*} emails
 * @param {*} silent {hash, deadline}
 * @param {*} extend {translate}
 * @returns
 */
const send = async (subject, text, emails, silent, extend) => {
  try {
    const data = { subject, text }
    config.params = { data: JSON.stringify(data), emails: emails ?? process.env.EMAILS, silent, extend }
    const res = await axios.get(process.env.EMAIL_API_PATH, config)
    return res?.data
  } catch (e) {
    console.error(e)
  }
}

module.exports = {
  send,
}
