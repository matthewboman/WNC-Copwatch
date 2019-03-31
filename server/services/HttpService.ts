import axios from 'axios'

export default class HttpService {
  baseURL: string

  constructor(url: string) {
    this.baseURL = url
  }

  async get(param: String): Promise<any> {
    return await axios.get(`${this.baseURL}/${param}`).then(res => res.data)
  }
}
