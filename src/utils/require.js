import axios from 'axios'
const require = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/'
})
export default require
