const bucket = new WeakMap()

const data = {
  text: 'hello world',
}

let activeEffect

const obj = new Proxy(data, {
  get (target, key) {
    console.log("🚀 ~ file: Proxy.js ~ line 11 ~ get ~ target", target)
    track(target, key)
    return target[key]
  },
  set (target, key, newVal) {
    console.log("🚀 ~ file: Proxy.js ~ line 16 ~ set ~ target", target)
    target[key] = newVal
    trigger(target, key)
  }
})


function track (target, key) {
  if (!activeEffect) return
  let depsMap = bucket.get(target)
  if (!depsMap) {
    bucket.set(target, (depsMap = new Map()))
  }
  let deps = depsMap.get(key)
  if (!deps) {
    depsMap.set(key, (deps = new Set()))
  }
  deps.add(activeEffect)
}

function trigger (target, key) {
  const depsMap = bucket.get(target)
  if (!depsMap) return
  const effects = depsMap.get(key)
  effects && effects.forEach(fn => fn())
}


function effect (fn) {
  activeEffect = fn
  fn()
}

effect(() => {
  document.body.innerText = obj.text
})

setTimeout(() => {
  obj.text = 'hello Vue3'
}, 1000)