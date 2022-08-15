const fileService = require('../services/fileService')
const db = require('../db')

class FileController {
  async createDir(req, res) {
    try {
      const { name, type, parent_id, user_id } = req.body
      console.log(name, type, parent_id, user_id)
      const { rows: [file] } = await db.query(`INSERT INTO file (name, type, parent_id, user_id) values ($1, $2, $3, $4) RETURNING *`, [name, type, parent_id, user_id])
      
      if (!file.parent_id) {

        const { rows: [changeFile] } = await db.query(`UPDATE file SET path=$1 WHERE id=$2 RETURNING *`, [name, file.id])
        await fileService.createDir(changeFile)

      } else {

        const { rows: [ { path: parentPath } ] } = await db.query(`SELECT path FROM file where id = $1`, [file.parent_id])
        const { rows: [changeFile] } =  await db.query(`UPDATE file SET path=$1 WHERE id=$2 RETURNING *`, [`${parentPath}/${name}`, file.id])
        await fileService.createDir(changeFile)
        await db.query(`UPDATE file SET childs_id = array_append(childs_id, $1) WHERE id=$1;`, [changeFile.id])

      }
      return res.json(file)
    } catch (e) {
      return res.status(400).json(e)
    }
  }
  async getFiles(req,res) {
    console.log(req.query.parent)
    try {
      if (req.query.parent) {
        const { rows: files } = await db.query(`SELECT * FROM file where user_id=$1 AND parent_id=$2`, [req.params.id, req.query.parent])
        return res.json(files)
      } else {
        const { rows: files } = await db.query(`SELECT * FROM file where user_id=$1 AND parent_id IS NULL`, [req.params.id])
        return res.json(files)
      }
      
    } catch(e) {
      return res.status(500).json({ messages: 'Can not get files' })
    }
  }
}

module.exports = new FileController()