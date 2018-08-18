import Vue from 'vue'

const API_URL = 'http://localhost:3000/api'

export default {

  get: endpoint => Vue.http.get(`${API_URL}/${endpoint}`)
    .then(res => Promise.resolve(res.body))
    .catch(err => Promise.reject(err))

}
