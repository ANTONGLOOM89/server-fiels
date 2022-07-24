const db = require('../db')

class PersonController {
    async person(req,res) {
        console.log('dvdvdvvvvv')
        try{
            const id = req.params.id
            const person = await db.query(`SELECT * FROM person where id = $1`, [id])
            res.json(person.rows[0])
        } catch(e) {
            new Error(e)
        }
    }
}

module.exports = new PersonController()