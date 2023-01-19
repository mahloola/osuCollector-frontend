import local from './local.json'
import production from './production.json'

const config = {
  get: (prop) => (process.env.NODE_ENV === 'development' ? local[prop] : production[prop]),
}
export default config
