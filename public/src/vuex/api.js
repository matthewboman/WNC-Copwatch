import Vue from 'vue'

const API_URL = window.location.host == `localhost:8080`
  ? 'http://localhost:3000/api/v1'
  : 'https://copwatch.avlcommunityaction.com/api/v1'

export default {

  get: endpoint => Vue.http.get(`${API_URL}/${endpoint}`)
    .then(res => Promise.resolve(res.body))
    .catch(err => Promise.reject(err))

}
