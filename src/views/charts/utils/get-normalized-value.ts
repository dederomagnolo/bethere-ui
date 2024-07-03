export const getNormalizedValue = (value: number) => { // for moisture only
  const outMax = 100
  const outMin = 0
  const inMax = 270
  const inMin = 700 // linear coeficient
  const angularCoeficient = (outMax - outMin) / (inMax - inMin)

  const normalizedTick = angularCoeficient * value + 556

  const percentual = normalizedTick * 100 / 700
  return Number(percentual.toFixed(2))
}