import { IEvent } from '../../../../../interfaces'

/**
 * Tell if the row is loaded
 * @param data List of events we want to render
 * @param index Index of the row
 * @param hasNextPage Tell if there are more events to be loaded
 */
export const isRowLoaded = (
  data: IEvent[],
  index: number,
  hasNextPage: boolean
) => {
  return !hasNextPage || index < data.length
}

/**
 * Fetch data from a API
 * @param data List of events we want to render
 * @param stopIndex Index of the last rendered row
 * @param limit Number of data we want to fetch
 * @param socket Current socket of the client
 */
export const loadMoreRows = async (
  data: IEvent[],
  limit: number,
  socket: any,
  hasNextPage: boolean
) => {
  if (hasNextPage) {
    socket.emit('events', {
      limit,
      lastEventDate: data[data.length - 1].created
    })
  }
}
