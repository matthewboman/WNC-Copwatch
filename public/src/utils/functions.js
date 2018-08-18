const debounce = (fn, delay) => {
  let inDebounce

  return function() {
    const context = this
    const args = arguments
    clearTimeout(inDebounce)
    inDebounce = setTimeout(() => fn.apply(context, args), delay)
  }
}

const throttle = (fn, limit) => {
  let lastFn
  let lastRan

  return function() {
    const context = this
    const args = arguments

    if (!lastRan) {
      fn.apply(context, args)
      lastRan = Date.now()
    } else {
      clearTimeout(lastFn)
      lastFn = setTimeout(function() {
        if ((Date.now() - lastRan) >= limit) {
          fn.apply(context, args)
          lastRan = Date.now()
        }
      }, limit - (Date.now() - lastRan))
    }
  }
}

export {
  debounce,
  throttle,
}
