import { Button, Card, Container, FormControl } from '../bootstrap-osu-collector'
import * as api from '../../utils/api'
import { useHistory } from 'react-router-dom'
import { useState } from 'react'

export default function BasicAuth({ setUser }) {
  const history = useHistory()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const submit = async (event) => {
    try {
      await api.loginBasicAuth({ username, password })
      const user = await api.getOwnUser()
      setUser(user)
      history.push('/')
    } catch (e) {
      alert('Login failed, please try again.')
      console.error(e)
    }
  }

  return (
    <Container className='pt-4'>
      <Card className='px-4 py-5 my-5 d-flex flex-column align-items-center'>
        <h3 className='display-5 fw-bold'>Username</h3>
        <FormControl
          className='col-1'
          type='text'
          style={{ textAlign: 'center' }}
          onChange={(e) => setUsername(e.target.value)}
        />
        <h3 className='display-5 fw-bold'>Password</h3>
        <FormControl
          className='col-1'
          type='password'
          style={{ textAlign: 'center' }}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button onClick={submit}>Login</Button>
      </Card>
    </Container>
  )
}
