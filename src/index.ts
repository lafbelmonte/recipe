import * as Service from './libs/service'

async function main(entryPoint: string) {
  const { default: service } = await import(`./${entryPoint}`)

  Service.initialize(service)
  Service.start()
}

main(process.env.ENTRY_POINT || 'server')
