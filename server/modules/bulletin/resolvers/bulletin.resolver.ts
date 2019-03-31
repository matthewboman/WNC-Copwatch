import { Query } from '../../../entity'
import { BulletinProvider } from '../providers/bulletin.provider'

export default {
  Query: {
    apd_bulletins: (_: any, args: Query, { injector }: any) => {
      return injector.get(BulletinProvider).getAllBulletins(args)
    }
  }
}
