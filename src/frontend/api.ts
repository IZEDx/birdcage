import axios from 'restyped-axios'
import { AdminAPI } from '../shared/admin-api';

export const api = axios.create<AdminAPI>({
  baseURL: './api/'
})
