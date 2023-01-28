import * as Service from './libs/service'

// entry point of the application, application can either be server or seed-admin
async function main(entryPoint: string) {
  const { default: service } = await import(`./${entryPoint}`)

  Service.initialize(service)
  Service.start()
}

main(process.env.ENTRY_POINT || 'server')
