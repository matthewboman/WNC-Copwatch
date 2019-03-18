import { OpenDataReport } from './OpenDataReport'

export interface Name {
  firstName: string
  firstInitial: string
  middleInitial: string
  lastName: string
}

export interface Officer extends OpenDataReport, Name {
  position?: string | null
  division?: string | null
}

  // { attributes:
  //    { OBJECTID: 88677,
  //      employee_name: 'GIBSON, JOSHUA E',
  //      position_: 'SR POLICE OFFICER',
  //      annual_base_pay: 43240.08,
  //      hire_date: 1453680000000,
  //      exempt_group: 'POLICE / NON-EXEMPT',
  //      dept_id: '12',
  //      department: 'POLICE',
  //      div_id: '122',
  //      division: 'PATROL',
  //      objectid_1: 567670 } },
