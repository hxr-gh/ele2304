//参数name: string是op-swipe
export function createBEM(name: string) {
  return (el?: string, mods?: Record<string, boolean>) => {
    //变量result是op-swipe__xxx
    let result = `${name}${el ? `__${el}` : ''}`
    //判断
    if (mods) {
      const modsStr = Object.keys(mods)
        .filter(mod => mods[mod])
        .map(mod => ` ${result}--${mod}`)
        .join('')
      result += modsStr
    }
    //返回
    return result
  }
}

//参数name: string是swipe
export function createNamespace(name: string) {
  const prfixedName = `op-${name}`
  return [prfixedName, createBEM(prfixedName)] as const
}
