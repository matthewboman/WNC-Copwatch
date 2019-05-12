export interface Query {
  id?: string | number

  before?: string
  after?: string
  exact?: string | Date

  arrest?: Boolean
  search?: Boolean
  category?: String

  use_of_force?: Boolean
  type_force_used?: string

  subject_race?: string
  subject_sex?: string
  subject_injury?: string
  subject_resistence?: string

  allegation?: string
  disposition?: string
  status?: string

  description?: string

  lastName?: string
  firstInitial?: string
  middleInitial?: string

  target?: string
}
