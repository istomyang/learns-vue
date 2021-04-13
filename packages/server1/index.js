const express = require('express')
const app = express()

const config = {
  port: 3000,
}

app.get('/', (req, res) => {
  res.send('Hey, World')
})

app.listen(config.port, () => {})
