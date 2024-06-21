export const allowOnlyNumbers = (input: string) => {
  const reg = /^\+?(0|[1-9]\d*)$/;
  if (!reg.test(input)) {
      return input.replace(/(\D)/g, '').replace(/^0+/, '')
  }
  return input
}