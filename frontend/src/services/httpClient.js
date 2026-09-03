import axios from 'axios'

const httpClient = axios.create({
 baseURL: '/',
 timeout: 10000,
})

export default httpClient
