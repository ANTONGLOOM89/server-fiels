const express = require('express')
const config = require('config')
const authRouter = require('./routes/auth.routes')
const personRouter = require('./routes/person.routes')
const fileRouter = require('./routes/file.routes')
const cors = require('cors')


const PORT = config.get('serverPort')
//const PORT = process.env.PORT || 3000

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api', authRouter)
app.use('/api', personRouter)
app.use('/api', fileRouter)

app.listen(PORT, () => {
  console.log(`Start server ${PORT}`)
})
