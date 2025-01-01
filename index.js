import users from "./users.js";
import express from 'express';


const api = express();
const port = 3500


api.get('/', (req, res) => {
    res.send('Hello World!')
  })

  api.get('/list', (req, res) => {
    res.send('This is a list')
  })

  api.get('/users',(req, res) => {
    res.json(users);
})
api.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
