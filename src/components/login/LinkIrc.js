import { useQuery } from '../../utils/hooks'
import { useState } from 'react'
import { Button, Card, Container, Spinner } from '../bootstrap-osu-collector'
import styled from 'styled-components'
import { linkIrc } from 'utils/api'
import Confetti from 'react-confetti'
import { useWindowSize } from 'react-use'

function LinkIrc({ user }) {
  const query = useQuery()
  query.get('username')

  const { width, height } = useWindowSize()

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(false)

  const submit = async () => {
    setLoading(true)
    try {
      await linkIrc(query.get('ircName'))
      setSuccess(true)
    } catch (error) {
      console.error(error)
      setError(true)
    }
    setLoading(false)
  }

  console.log('user', user)

  return (
    <Container className='pt-4'>
      <Card className='shadow-lg mt-5'>
        <div className='px-4 py-5 my-5 text-center'>
          {!success ? (
            <>
              <h4 className='mb-4'>Hi {query.get('ircName')}, click the button below to complete setup</h4>
              <SubmitButton onClick={submit} disabled={!user}>
                {loading ? (
                  <Spinner as='span' animation='grow' size='sm' role='status' aria-hidden='true' />
                ) : (
                  'Complete setup'
                )}
              </SubmitButton>
              {!user && <div className='text-muted mt-2'>you are not logged in</div>}
              {error && <div className='text-danger mt-2'>an error occurred</div>}
            </>
          ) : (
            <>
              <h1 className='mb-4'>Setup complete! Let&apos;s get started:</h1>
              <h3>
                1. Enable /np one of your <a href={`/users/${user.id}/uploads`}> collections</a>
              </h3>
              <h3>2. Send /np to FunOrange in osu! {"(don't be shy)"}</h3>
              <h4 className='mt-4'>The beatmap will then be added to the osu!Collector collection</h4>
              <Confetti width={width} height={height} />
            </>
          )}
        </div>
      </Card>
    </Container>
  )
}

const SubmitButton = styled(Button)`
  width: 150px;
`

export default LinkIrc
