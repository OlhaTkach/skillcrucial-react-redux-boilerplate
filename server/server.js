import express from 'express'
import path from 'path'
import cors from 'cors'
import bodyParser from 'body-parser'
import sockjs from 'sockjs'
import { renderToStaticNodeStream } from 'react-dom/server'
import React from 'react'
import axios from 'axios'


import cookieParser from 'cookie-parser'
import config from './config'
import Html from '../client/html'

const Root = () => ''

try {
  // eslint-disable-next-line import/no-unresolved
  // ;(async () => {
  //   const items = await import('../dist/assets/js/root.bundle')
  //   console.log(JSON.stringify(items))

  //   Root = (props) => <items.Root {...props} />
  //   console.log(JSON.stringify(items.Root))
  // })()
  console.log(Root)
} catch (ex) {
  console.log(' run yarn build:prod to enable ssr')
}

let connections = []

const port = process.env.PORT || 8090
const server = express()
const fs = require('fs');

const middleware = [
  cors(),
  express.static(path.resolve(__dirname, '../dist/assets')),
  bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }),
  bodyParser.json({ limit: '50mb', extended: true }),
  cookieParser()
]

const { readFile, writeFile } = require("fs").promises;

middleware.forEach((it) => server.use(it))

server.use((req, res, next) => {
  res.set('x-skillcrucial-user', 'd71e4430-5383-4865-9f7c-5edfdbccb2da')  
  res.set('Access-Control-Expose-Headers', 'X-SKILLCRUCIAL-USER')
  next()
})

server.get('/api/v1/users', (req, res) => {
    readFile(`${__dirname}/users.json`, { encoding: "utf8" })  
      .then(text => {  
        const users = JSON.parse(text) 
        res.json(users)
      })  
      .catch(err => {
        // eslint-disable-next-line no-console
        console.log(err)
        const externalSource = 'https://jsonplaceholder.typicode.com/users'
        const getData = async (url) => {
          const result = await axios(url).then(({ data }) => data)
          const text = JSON.stringify(result)
          writeFile(`${__dirname}/users.json`, text, { encoding: "utf8" });  
          res.json(result)
        }   
        getData(externalSource)
        
      })        
})


server.post('/api/v1/users', (req, res) => {
  readFile(`${__dirname}/users.json`, { encoding: "utf8" })  
  .then(text => {  
    const users = JSON.parse(text)
    const lastId = users[users.length - 1].id
    let newUser = req.body
    newUser = { ...newUser, id : lastId + 1 }
    users.push(newUser) 
    const usersString = JSON.stringify(users)
    writeFile(`${__dirname}/users.json`, usersString, { encoding: "utf8" })
    res.json({ status: 'success', id : newUser.id }) 
  })    
})


server.patch('/api/v1/users/:userId', (req, res) => {
  readFile(`${__dirname}/users.json`, { encoding: "utf8" })  
  .then(text => {  
    const users = JSON.parse(text)
    const userToChange = users.filter( item => item.id === parseInt(req.params.userId, 10))
    if (userToChange.length === 0) {
      res.json({status: 'error', message: `No user with id ${req.params.userId}` }) 
    }
    const userToChangeIndex = users.indexOf(userToChange[0])
    const changedUser = { ...userToChange[0], ...req.body}
    users[userToChangeIndex] = changedUser
    const usersString = JSON.stringify(users)
    writeFile(`${__dirname}/users.json`, usersString, { encoding: "utf8" })
    res.json({ status: 'success', id: userToChange[0].id })
  })
})


server.delete('/api/v1/users/:userId', (req, res) => {
  readFile(`${__dirname}/users.json`, { encoding: "utf8" })  
  .then(text => {  
    const users = JSON.parse(text)
    const userToChange = users.filter( item => item.id === parseInt(req.params.userId, 10))
    if (userToChange.length === 0) {
      res.json({status: 'error', message: `No user with id ${req.params.userId}` }) 
    }
    const userToChangeIndex = users.indexOf(userToChange[0])
    users.splice(userToChangeIndex, 1)
    const usersString = JSON.stringify(users)
    writeFile(`${__dirname}/users.json`, usersString, { encoding: "utf8" })
    res.json({ status: 'success', id: req.params.userId })
  })
})


server.delete('/api/v1/users', (req, res) => { 
  fs.unlink(`${__dirname}/users.json`, (done) => {
    console.log(done)
    res.json({ status: 'success' })
  })
}) 

server.use('/api/', (req, res) => {
  res.status(404)
  res.end()
})

const [htmlStart, htmlEnd] = Html({
  body: 'separator',
  title: 'Skillcrucial - Become an IT HERO'
}).split('separator')

server.get('/', (req, res) => {
  const appStream = renderToStaticNodeStream(<Root location={req.url} context={{}} />)
  res.write(htmlStart)
  appStream.pipe(res, { end: false })
  appStream.on('end', () => {
    res.write(htmlEnd)
    res.end()
  })
})

server.get('/*', (req, res) => {
  const initialState = {
    location: req.url
  }

  return res.send(
    Html({
      body: '',
      initialState
    })
  )
})



const app = server.listen(port)

if (config.isSocketsEnabled) {
  const echo = sockjs.createServer()
  echo.on('connection', (conn) => {
    connections.push(conn)
    conn.on('data', async () => {})

    conn.on('close', () => {
      connections = connections.filter((c) => c.readyState !== 3)
    })
  })
  echo.installHandlers(app, { prefix: '/ws' })
}
console.log(`Serving at http://localhost:${port}`)

