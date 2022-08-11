const fs = require('fs')
const db = require('../db')
const config = require('config')

class fileService {
  createDir(file) {
    const filePath = `${config.get('filePath')}/${file.user_id}/${file.path}`
    return new Promise((resolve, reject) => {
      try {
        if (!fs.existsSync(filePath)) {
          fs.mkdirSync(filePath)
          return resolve({ messages: 'File was created' })
        } else {
          return reject({ messages: 'File already exist' })
        }
      } catch(e) {
        return reject({ messages: 'File error' })
      }
    })
  }
}

module.exports = new fileService()