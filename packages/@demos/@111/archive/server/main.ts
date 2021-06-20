import express from 'express'

const app = express()
app.get('/authorize', (req, res) => {
  console.log(req.query)
})

app.listen(4000, () => {
  console.log('Server is on!')
})
