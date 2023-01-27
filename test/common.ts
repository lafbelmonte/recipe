import server from '../src/server'

before(async function () {
  console.log('called')
  await server.start()
})

after(async function () {
  await server.stop()
})
