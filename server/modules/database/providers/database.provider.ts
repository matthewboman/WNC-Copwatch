import { OnRequest } from '@graphql-modules/core'
import { Injectable } from '@graphql-modules/di'
import { Connection } from 'typeorm'

@Injectable()
export class DatabaseProvider implements OnRequest {

  constructor(
    private connection: Connection
  ) {}

  async onRequest() {

  }
}
