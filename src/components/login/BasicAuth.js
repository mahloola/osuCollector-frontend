import { Button, Card, Container, FormControl } from '../bootstrap-osu-collector'
import * as api from '../../utils/api'
import { useHistory } from 'react-router-dom'
import { useState } from 'react'
import { LinkContainer } from 'react-router-bootstrap'

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
        <label className='fw-bold'>Username:</label>
        <FormControl
          className='mb-3'
          type='text'
          style={{ textAlign: 'center', maxWidth: '200px' }}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label className='fw-bold mb-2'>Password:</label>
        <FormControl
          className='mb-3'
          type='password'
          style={{ textAlign: 'center', maxWidth: '200px' }}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button onClick={submit}>Login</Button>

        <LinkContainer to='/resetPassword' className='mt-3'>
          <a>Reset password</a>
        </LinkContainer>
      </Card>
    </Container>
  )
}
