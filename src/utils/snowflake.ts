import { Worker as SnowflakeWorker } from 'snowflake-uuid'

// TODO: I need to make sure this works through sharding at the point I decide to do so,
//  otherwise this will be a problem.
const generator = new SnowflakeWorker(0, 1, {
  workerIdBits: 5,
  datacenterIdBits: 5,
  sequenceBits: 12,
})

export const snowflake = (): string => generator.nextId().toString()
