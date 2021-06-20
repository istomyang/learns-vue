// noinspection SpellCheckingInspection
import hljs from 'highlight.js'
import chalk from 'chalk'

export const highlight = (codes: string, lang?: string) => {
  if (!!lang) {
    return hljs.highlight(codes, { language: lang }).value
  }
  return hljs.highlightAuto(codes).value
}

/**
 * Print to console colorfully
 * @param msg message string
 * @param preset
 * 0: message,
 * 1: error,
 * 2: warning,
 * 3: ok,
 * @param tag [tagString]
 * */
export const print = (
  msg: string,
  preset: number = 0,
  tag: string = 'istomyang'
) => {
  // preset
  const message = chalk.magenta
  const error = chalk.black.bgRed
  const warning = chalk.yellow
  const ok = chalk.green

  msg = '[' + tag.trim() + '] ' + msg.trim()
  let result
  switch (preset) {
    case 0:
      result = message(msg)
      break
    case 1:
      result = error(msg)
      break
    case 2:
      result = warning(msg)
      break
    case 3:
      result = ok(msg)
      break
    default:
      result = chalk.gray(msg)
      break
  }

  console.log(result)
}
