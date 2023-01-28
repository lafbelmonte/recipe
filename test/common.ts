import server from '../src/server'

before(async function () {
  await server.start()
})

after(async function () {
  await server.stop()
})
