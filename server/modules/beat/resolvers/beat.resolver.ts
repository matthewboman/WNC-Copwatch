import { GraphQLModule, ModuleContext } from '@graphql-modules/core'

import { Query } from '../../../entity'
import { IResolvers } from '../../../types'
import { BeatProvider } from '../providers/beat.provider'

export default {
  Query: {
    beats: (obj: any, args: Query, { injector }: any) => {
      return injector.get(BeatProvider).allBeats()
    },
    beat: (obj: any, args: any, { injector }: any) => {
      return injector.get(BeatProvider).beatById(args.beat)
    },
    // rawBeats: (obj: any, args: any, { injector }: any) => {
    //   return injector.get(BeatProvider).rawBeats()
    // }
  }
}
