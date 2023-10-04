import server from './server.js'


const io = server.start(() => {
  console.log('Server started')
})

io.on('connection', socket => {
  console.log('connection:', socket.id)
  socket.emit('connected', {})
})