import exitHook from 'async-exit-hook'

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

exitHook((callback) => {
  stop().then(() => {
    setTimeout(() => callback(), 3000)
  })
})
