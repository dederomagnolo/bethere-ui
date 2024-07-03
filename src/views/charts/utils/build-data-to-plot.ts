import moment from 'moment'
import _ from 'lodash'
import { getNormalizedValue } from './get-normalized-value'

export type Filter = {
  [key: string]: string[]
}

export const buildDataToPlot = (measuresCollectionByType: any, filters: Filter = {}) => {
  let availableToPlot = {}

  _.forEach(measuresCollectionByType, (collection, type: number) => {
    const collectionFilters = filters[type]
    const batch = [] as any
    const dataKeys = [] as string[]

    _.forEach(collection, (measure: any) => { // get data to plot from collection
      const measureType = measure.type
      const value = measure.value
      const origin = measure.origin

      const shouldIncludeMeasure = measureType !== 'moisture' && value !== 998

      if (shouldIncludeMeasure) {
        if (!dataKeys.includes(origin)) {
          dataKeys.push(origin)
        }

        const hasFiltersToApply = collectionFilters && collectionFilters.length
        const shouldFilterMeasure = hasFiltersToApply && collectionFilters.includes(origin)

        const xTick = (moment(measure.createdAt)).valueOf()
        const point = {
          x: xTick,
          [origin]: measureType === 'moisture' ? getNormalizedValue(value) : value,
        }

        if (!shouldFilterMeasure) {
          batch.push(point)
        }
      } 
    })

    availableToPlot = {
      ...availableToPlot,
      [type]: {
        data: batch,
        dataKeys: dataKeys
      }
    }
  })

  return availableToPlot
}