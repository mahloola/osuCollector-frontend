import Confetti from 'react-confetti'
import { Container, Row } from '../bootstrap-osu-collector'
import { useWindowSize } from 'react-use'

function Success() {
  const { width, height } = useWindowSize()
  return (
    <Container className='pt-4'>
      <div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: height * 0.8,
          }}
        >
          <Container className='text-center'>
            <Row>
              <h1>Success!</h1>
            </Row>
            <Row>
              <a href='/client#download'>Click here to go to the download page</a>
            </Row>
          </Container>
        </div>
        <Confetti width={width} height={height} />
      </div>
    </Container>
  )
}

export default Success
