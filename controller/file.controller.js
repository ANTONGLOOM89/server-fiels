const fileService = require('../services/fileService')
const db = require('../db')

class FileController {
  async createDir(req, res) {
    try {

      const { name, type, parent_id, user_id } = req.body
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
}

module.exports = new FileController()