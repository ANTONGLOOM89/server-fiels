const bcrypt = require('bcryptjs')
const db = require('../db')
const jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator')
const config = require('config')


class AuthController {
    async register( { body: { email, password, diskSpace, usedSpace, avatar } }, res) {
        
        try {
            
            const errors = validationResult( { email, password, diskSpace, usedSpace, avatar } )
            if(!errors.isEmpty()) {
                return res.status(400).send({
                    success: false,
                    message: 'Данный email некорректный'
                })
            }
            
            const foundEmail = await db.query(`SELECT email FROM person WHERE email = $1`, [email])
            if (foundEmail.rows[0]) {
                return res.status(200).send({
                    success: false,
                    message: 'Данный email занят, попробуйте другой!'
                })
            }

            const hashPassword = await bcrypt.hash(password, 8)
            const newPerson = await db.query(`INSERT INTO person (email, password, diskSpace, usedSpace, avatar) values ($1, $2, $3, $4, $5) RETURNING *`, 
            [email, hashPassword, diskSpace, usedSpace, avatar])

            return res.status(200).send({
                success: true,
                message: "Пользователь создан" 
            }) 

        } catch (error) {
            return res.status(403).send({
                message: 'Извините, но произошла ошибка!',
                error
            })
        }

    }

    async login ({ body: {email, password} }, res) {
        try {
          const foundPerson = await db.query(`SELECT id, email, password, diskSpace, usedSpace, avatar FROM person WHERE email = $1`, [email])
          const person = foundPerson.rows[0]
          console.log(person)
          if (!person) {
            return res.status(400).send({
                success: false,
                message: 'Данный пользователь не найден!'
            })
          }
          const isPassValid = bcrypt.compareSync(password, person.password)
          if (!isPassValid) {
            return res.status(400).send({
                success: false,
                message: 'Пароль не верен!'
            })
          }
          const token = jwt.sign({ id: person.id }, config.get('secretKey'), { expiresIn: "1h" })
          return res.json({
              success: true,
              token,
              person: {
                id: person.id,
                email: person.email, 
                password: person.password,  
                diskSpace: person.diskSpace,
                usedSpace: person.usedSpace, 
                avatar: person.avatar
              }
          })
        } catch(error) {
            return res.status(403).send({
                message: 'Извините, но произошла ошибка!',
                error
            })
        }
    }

}

module.exports = new AuthController()