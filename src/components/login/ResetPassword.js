import { Button, Card, Container, FormControl } from '../bootstrap-osu-collector'
import * as api from '../../utils/api'
import { Link, useHistory } from 'react-router-dom'
import { useState } from 'react'
import { LinkContainer } from 'react-router-bootstrap'

export default function ResetPassword() {
  const history = useHistory()

  const [username, setUsername] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')

  const submit = async (event) => {
    try {
      await api.setPassword({ username, currentPassword, newPassword })
      alert('Password changed successfully. Please try logging in now.')
      history.push('/login/basicAuth')
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
        <label className='fw-bold'>Current Password:</label>
        <FormControl
          className='mb-3'
          type='password'
          style={{ textAlign: 'center', maxWidth: '200px' }}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
        <label className='fw-bold'>New Password:</label>
        <FormControl
          className='mb-3'
          type='password'
          style={{ textAlign: 'center', maxWidth: '200px' }}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <Button onClick={submit}>Reset password</Button>

        <LinkContainer to='/login/basicAuth' className='mt-3'>
          <a>Back to login</a>
        </LinkContainer>
      </Card>
    </Container>
  )
}
