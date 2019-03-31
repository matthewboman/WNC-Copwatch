import { Query } from '../../../entity'
import { ComplaintProvider } from '../providers/complaint.provider'

export default {
  Query: {
    complaints: (obj: any, args: Query, { injector }: any) => {
      return injector.get(ComplaintProvider).getAllComplaints(args)
    }
  }
}
