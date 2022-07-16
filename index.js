const express = require('express')
const config = require('config')
const authRouter = require('./routes/auth.routes')
const cors = require('cors')


const PORT = config.get('serverPort')
//const PORT = process.env.PORT || 7000

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api', authRouter)

app.listen(PORT, () => {
  console.log(`Start server ${PORT}`)
})
