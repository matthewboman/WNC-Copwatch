import { Query } from '../../../entity'
import { ComplaintProvider } from '../providers/complaint.provider'

export default {
  Query: {
    complaints: (_: any, args: Query, { injector }: any) => {
      return injector.get(ComplaintProvider).getAllComplaints(args)
    }
  }
}
