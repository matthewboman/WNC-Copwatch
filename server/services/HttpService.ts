import axios from 'axios'

export default class HttpService {
  baseURL: String

  constructor(url: String) {
    this.baseURL = url
  }

  async get(param: String): Promise<any> {
    return await axios.get(`${this.baseURL}/${param}`).then(res => res.data)
  }
}
