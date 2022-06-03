import local from './local.json'
import production from './production.json'

const config = {
  get: (prop) => (process.env.NODE_ENV === 'production' ? production[prop] : local[prop]),
}
export default config
