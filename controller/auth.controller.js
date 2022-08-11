const bcrypt = require('bcryptjs')
const db = require('../db')
const jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator')
const config = require('config')
const fileService = require('../services/fileService')


class AuthController {
    async register( { body: { name, email, password, diskSpace, usedSpace, avatar } }, res) {

        try {
            
            const errors = validationResult( { name, email, password, diskSpace, usedSpace, avatar } )
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
            const salt = bcrypt.genSaltSync(10)

            const newPerson = await db.query(`INSERT INTO person (name, email, password, diskSpace, usedSpace, avatar) values ($1, $2, $3, $4, $5, $6) RETURNING *`, 
            [name, email, hashPassword, diskSpace, usedSpace, avatar])

            const foundPerson = await db.query(`SELECT id, name, email, password, diskSpace, usedSpace, avatar FROM person WHERE email = $1`, [email])
            const person = foundPerson.rows[0]

            const token = jwt.sign({
                email: email
            }, 'dev-jwt', { expiresIn: 60*60 })

            const file = await db.query(`INSERT INTO file (user_id, path) values ($1, $2) RETURNING *`, [person.id, ''])
            await fileService.createDir(file.rows[0])


            return res.status(200).send({
                success: true,
                message: "Пользователь создан",
                token: `Bearer ${token}`,
                person: {
                    id: person.id,
                    name: person.name,
                    email: person.email, 
                    password: person.password,  
                    diskSpace: person.diskSpace,
                    usedSpace: person.usedSpace, 
                    avatar: person.avatar
                }
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
          const foundPerson = await db.query(`SELECT id, name, email, password, diskSpace, usedSpace, avatar FROM person WHERE email = $1`, [email])
          const person = foundPerson.rows[0]
          if (!person) {
            return res.status(200).send({
                success: false,
                message: 'Данный пользователь не найден!'
            })
          }
          const isPassValid = bcrypt.compareSync(password, person.password)
          if (!isPassValid) {
            return res.status(200).send({
                success: false,
                message: 'Пароль не верен!'
            })
          }
          
          const token = jwt.sign({
            email: person.email
          }, 'dev-jwt', { expiresIn: 60*60 })

          return res.status(200).send({
            success: true,
            token: `Bearer ${token}`,
            person: {
                id: person.id,
                name: person.name,
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