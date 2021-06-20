export const load = async path => {
  let result
  try {
    result = await import(path)
  } catch (err) {
    console.error(`@@Load Error: ${err}`)
  }
  return result
}

