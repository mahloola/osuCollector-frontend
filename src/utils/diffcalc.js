const ApproachRateTableHTEZ = [
  [0, -5],
  [1, -4.33],
  [2, -3.67],
  [3, -3],
  [4, -2.33],
  [5, -1.67],
  [6, -1],
  [7, -0.33],
  [8, 0.33],
  [9, 1],
  [10, 1.67]
]
const ApproachRateTableHT = [
  [0, -5],
  [1, -3.67],
  [2, -2.33],
  [3, -1],
  [4, 0.33],
  [5, 1.67],
  [6, 3.33],
  [7, 5],
  [8, 6.33],
  [9, 7.67],
  [10, 9],
]
const ApproachRateTableHTHR = [
  [0, -5],
  [1, -3.13],
  [2, -1.27],
  [3, 0.6],
  [4, 2.67],
  [5, 5],
  [6, 6.87],
  [7, 8.73],
  [8, 9],
  [9, 9],
  [10, 9],
]
const ApproachRateTableEZ = [
  [0, 0],
  [1, 0.5],
  [2, 1],
  [3, 1.5],
  [4, 2],
  [5, 2.5],
  [6, 3],
  [7, 3.5],
  [8, 4],
  [9, 4.5],
  [10, 5],
]
const ApproachRateTableHR = [
  [0, 0],
  [1, 1.4],
  [2, 2.8],
  [3, 4.2],
  [4, 5.6],
  [5, 7],
  [6, 8.4],
  [7, 9.8],
  [8, 10],
  [9, 10],
  [10, 10],
]
const ApproachRateTableDTEZ = [
  [0, 5],
  [1, 5.27],
  [2, 5.53],
  [3, 5.8],
  [4, 6.07],
  [5, 6.33],
  [6, 6.6],
  [7, 6.87],
  [8, 7.13],
  [9, 7.4],
  [10, 7.67],
]
const ApproachRateTableDT = [
  [0, 5],
  [1, 5.4],
  [2, 6.07],
  [3, 6.6],
  [4, 7.13],
  [5, 7.67],
  [6, 8.33],
  [7, 9],
  [8, 9.67],
  [9, 10.33],
  [10, 11],
]
const ApproachRateTableDTHR = [
  [0, 5],
  [1, 5.747],
  [2, 6.493],
  [3, 7.24],
  [4, 8.07],
  [5, 9],
  [6, 9.93],
  [7, 10.87],
  [8, 11],
  [9, 11],
  [10, 11],
]

const OverallDifficultyTableHTEZ = [
  [0, -4.42],
  [1, -3.75],
  [2, -3.08],
  [3, -2.42],
  [4, -1.75],
  [5, -1.08],
  [6, -0.42],
  [7, 0.25],
  [8, 0.92],
  [9, 1.54],
  [10, 2.25],
]
const OverallDifficultyTableHT = [
  [0, -4.42],
  [1, -3.08],
  [2, -1.75],
  [3, -0.42],
  [4, 0.92],
  [5, 2.25],
  [6, 3.54],
  [7, 4.92],
  [8, 6.25],
  [9, 7.54],
  [10, 8.92],
]
const OverallDifficultyTableHTHR = [
  [0, 4.42],
  [1, 2.42],
  [2, 0.64],
  [3, 1.36],
  [4, 3.14],
  [5, 4.92],
  [6, 6.92],
  [7, 8.69],
  [8, 8.92],
  [9, 8.92],
  [10, 8.92],
]
const OverallDifficultyTableEZ = [
  [0, 0],
  [1, 0.5],
  [2, 1],
  [3, 1.5],
  [4, 2],
  [5, 2.5],
  [6, 3],
  [7, 3.5],
  [8, 4],
  [9, 4.5],
  [10, 5],
]
const OverallDifficultyTableHR = [
  [0, 0],
  [1, 1.4],
  [2, 2.8],
  [3, 4.2],
  [4, 5.6],
  [5, 7],
  [6, 8.4],
  [7, 9.8],
  [8, 10],
  [9, 10],
  [10, 10],
]
const OverallDifficultyTableDTEZ = [
  [0, 4.42],
  [1, 4.75],
  [2, 5.08],
  [3, 5.42],
  [4, 5.75],
  [5, 6.08],
  [6, 6.42],
  [7, 6.75],
  [8, 7.08],
  [9, 7.42],
  [10, 7.75],
]
const OverallDifficultyTableDT = [
  [0, 4.42],
  [1, 5.08],
  [2, 5.75],
  [3, 6.42],
  [4, 7.08],
  [5, 7.75],
  [6, 8.42],
  [7, 9.08],
  [8, 9.75],
  [9, 10.42],
  [10, 11.08],
]
const OverallDifficultyTableDTHR = [
  [0, 4.42],
  [1, 5.42],
  [2, 6.31],
  [3, 7.31],
  [4, 8.19],
  [5, 9.08],
  [6, 10.08],
  [7, 10.97],
  [8, 11.08],
  [9, 11.08],
  [10, 11.08],
]

export const calculateARWithHTEZ = (od) => LerpValueUsingLUT(od, ApproachRateTableHTEZ)
export const calculateARWithHT = (od) => LerpValueUsingLUT(od, ApproachRateTableHT)
export const calculateARWithHTHR = (od) => LerpValueUsingLUT(od, ApproachRateTableHTHR)
export const calculateARWithEZ = (od) => LerpValueUsingLUT(od, ApproachRateTableEZ)
export const calculateARWithHR = (od) => LerpValueUsingLUT(od, ApproachRateTableHR)
export const calculateARWithDT = (od) => LerpValueUsingLUT(od, ApproachRateTableDT)
export const calculateARWithDTEZ = (od) => LerpValueUsingLUT(od, ApproachRateTableDTEZ)
export const calculateARWithDTHR = (od) => LerpValueUsingLUT(od, ApproachRateTableDTHR)
export const calculateODWithHTEZ = (od) => LerpValueUsingLUT(od, OverallDifficultyTableHTEZ)
export const calculateODWithHT = (od) => LerpValueUsingLUT(od, OverallDifficultyTableHT)
export const calculateODWithHTHR = (od) => LerpValueUsingLUT(od, OverallDifficultyTableHTHR)
export const calculateODWithEZ = (od) => LerpValueUsingLUT(od, OverallDifficultyTableEZ)
export const calculateODWithHR = (od) => LerpValueUsingLUT(od, OverallDifficultyTableHR)
export const calculateODWithDT = (od) => LerpValueUsingLUT(od, OverallDifficultyTableDT)
export const calculateODWithDTEZ = (od) => LerpValueUsingLUT(od, OverallDifficultyTableDTEZ)
export const calculateODWithDTHR = (od) => LerpValueUsingLUT(od, OverallDifficultyTableDTHR)

function LerpValueUsingLUT(input, lut) {
  if (input < 0 || input > 10 || !input) return 0

  const values = lut.map((xyPair) => xyPair[1])
  const maxValue = Math.max(values)

  const lowerIndex = Math.floor(input)
  const upperIndex = Math.min(lowerIndex + 1, 10) // clamp to 10

  const lowerValue = lut[lowerIndex][1]
  const upperValue = lut[upperIndex][1]
  const stepDifference = upperValue - lowerValue
  const stepFraction = input - Math.floor(input) // decimal part

  if (lowerValue != maxValue && upperValue == maxValue) {
    // special case: piece-wise linear interval. Starts with a positive slope, then plateaus to max value.
    // Linearly interpolate based on the slope of the previous interval
    const prevIntervalLowerValue = lut[lowerIndex - 1][1]
    const prevIntervalUpperValue = lut[lowerIndex][1]
    const previousSlope = prevIntervalUpperValue - prevIntervalLowerValue
    // Clamp the lerped value to maxValue
    const lerp = lowerValue + stepFraction * previousSlope
    return Math.min(lerp, maxValue)
  } else return lowerValue + stepFraction * stepDifference
}
