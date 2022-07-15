const bcrypt = require('bcryptjs')
const db = require('../db')

class AuthController {
    async register({ body: { email, password, diskSpace, usedSpace, avatar } }, res) {
        console.log(эвмвмвымвымвв)
        try {
            
            const foundEmail = await db.query(`SELECT email FROM person WHERE $email = $1`, [email])
            if (foundEmail.rows[0]) {
                return res.status(200).send({
                    success: false,
                    message: 'Данное имя заянто, попробуйте другое!'
                })
            }

            const newPerson = await db.query(`INSERT INTO person (email, password, diskSpace, usedSpace, avatar) values ($1, $2, $3, $4, $5) RETURNING *`, 
            [email, password, diskSpace, usedSpace, avatar])

            return res.status(200).send({
                success: true,
                message: "Пользователь создан" 
            }) 

        } catch (error) {
            console.log('dvvvvvvvvvvvvvvvvvvvvv')
            return res.status(403).send({
                message: 'Извините, но логин или пароль не подходят!',
                error
            })
        }
    }
}

module.exports = new AuthController()