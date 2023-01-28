import exitHook from 'async-exit-hook'

// library to perform graceful shutdown, utilizes start and stop functions

let options = {
  start: async () => {},
  stop: async () => {}
}

export function initialize(params: {
  start: () => Promise<void>
  stop: () => Promise<void>
}) {
  options = params
}

export async function start() {
  await options.start()
}

export async function stop() {
  await options.stop()
}

// after calling the stop hook, wait for 3 seconds before closing the application
exitHook((callback) => {
  stop().then(() => {
    setTimeout(() => callback(), 3000)
  })
})
