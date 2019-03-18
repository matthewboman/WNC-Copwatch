export default interface Query {
  id?: string
  
  before?: String
  after?: String

  arrest?: Boolean
  search?: Boolean

  use_of_force?: Boolean
  type_force_used?: String

  subject_race?: String
  subject_sex?: String
  subject_injury?: String
  subject_resistence?: String

  allegation?: String
  disposition?: String
  status?: String

  description?: String

  lastName?: String
}
