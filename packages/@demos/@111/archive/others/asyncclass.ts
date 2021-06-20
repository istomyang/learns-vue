class AsyncConstructor {
  private then

  constructor(asyncFn) {
    const init = (async () => {
      await asyncFn()
      delete this.then
      return this
    })()

    this.then = init.then.bind(init)
  }
}

const delay = t => new Promise(resolve => setTimeout(resolve, t))

class A extends AsyncConstructor {
  status: boolean
  constructor() {
    super(async () => {
      try {
        await delay(2000)
        this.status = true
      } catch (error) {}
    })
  }
}




async function run(){
	console.log('start')
	const a = await new A()
	console.log(a.status)
	delay(2000).then(f => {
		console.log(a.status)
	})
}

run()