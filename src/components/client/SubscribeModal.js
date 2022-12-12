/* eslint-disable no-unused-vars */
import { useState } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import * as api from '../../utils/api'
import { useHistory } from 'react-router-dom'
import { Button, Card, CardBody, Col, Modal, ModalBody, Row } from '../bootstrap-osu-collector'
import { Twitch } from 'react-bootstrap-icons'
import { PayPalButtons } from '@paypal/react-paypal-js'
import { Alert } from 'react-bootstrap'

export default function SubscribeModal({
  user,
  show,
  onHide,
  paypalSubscription,
  stripeSubscription,
  isSubbedToFunOrange,
}) {
  const history = useHistory()

  const [paypalError, setPaypalError] = useState(null)
  // Current Status
  const linkedTwitchAccountStatus = user?.private?.linkedTwitchAccount?.displayName || 'Not linked'
  const twitchSubStatus = isSubbedToFunOrange ? 'Subbed' : 'Not subbed'

  const twitchSub = isSubbedToFunOrange
  const paidSub = paidSubscriptionActive(user, paypalSubscription, stripeSubscription)
  return (
    <Modal show={show} onHide={onHide} size='xl' centered>
      <ModalBody className='px-5 py-5'>
        <h2 id='subscription-methods' className='text-center'>
          Two ways to support us!
        </h2>
        <p>
          Please note that supporting us with both methods at the same time{' '}
          <strong>will not extend your supporter status!</strong>&nbsp; If you want to save money we recommend doing
          only 1 option.
        </p>
        <Row>
          <Col md={12} lg={6}>
            <Card className='shadow mb-4'>
              <CardBody>
                <Card.Title>
                  <span className='mr-2'>Option 1</span> <i style={{ marginTop: 1 }}>free with Twitch Prime</i>
                  <Twitch size={28} className='ml-3 mb-1' style={{ color: '#8a43f2' }} />
                </Card.Title>
                <Card className='shadow-sm p-3 mx-3 my-4'>
                  <p>
                    <strong className='mr-2'>1</strong> Link your Twitch account with osu!Collector
                  </p>
                  {!user ? (
                    <Button disabled variant='outline-secondary'>
                      You are not logged in
                    </Button>
                  ) : user?.private?.linkedTwitchAccount ? (
                    <Button disabled variant='outline-secondary'>
                      Already linked: {user.private.linkedTwitchAccount.displayName}
                    </Button>
                  ) : (
                    <Button
                      href='https://id.twitch.tv/oauth2/authorize?client_id=q0uygwcj9cplrb0sb20x7fthkc4wcd&redirect_uri=https%3A%2F%2Fosucollector.com%2Fauthentication%2Ftwitch&response_type=code&scope=user:read:subscriptions'
                      variant='outline-primary'
                    >
                      Link Twitch Account
                    </Button>
                  )}
                </Card>
                <Card className='shadow-sm p-3 mx-3 my-4'>
                  <p>
                    <strong className='mr-2'>2</strong> Subscribe to FunOrange&apos;s Twitch channel (if you
                    haven&apos;t already)
                  </p>
                  <Button href='https://www.twitch.tv/funorange42' variant='outline-primary'>
                    FunOrange&apos;s Twitch Channel
                  </Button>
                </Card>
              </CardBody>
            </Card>
          </Col>
          <Col md={12} lg={6}>
            <Card className='shadow mb-4'>
              <CardBody>
                <Card.Title>Option 2</Card.Title>
                <Card.Subtitle>
                  {!user ? (
                    <Alert variant='warning' className='mt-4 mx-3 py-2 text-center'>
                      <small>You are not logged in</small>
                    </Alert>
                  ) : paidSub ? (
                    <Alert variant='success' className='mt-4 mx-3 py-2 text-center'>
                      <small>You already have a paid subscription</small>
                    </Alert>
                  ) : (
                    twitchSub && (
                      <Alert variant='warning' className='mt-4 mx-3 py-2 text-center'>
                        <small>You are already subbed to FunOrange&apos;s Twitch channel!</small>
                      </Alert>
                    )
                  )}
                  {paypalError && (
                    <Alert variant='danger' className='mt-4 mx-3 py-2 text-center'>
                      <small>{paypalError.message}</small>
                    </Alert>
                  )}
                  <Card className='shadow-sm p-3 mx-3 my-4'>
                    <p>Purchase the desktop client for $1.99 per month</p>
                    <PayPalButtons
                      style={{
                        shape: 'rect',
                        color: 'gold',
                        height: 46,
                        layout: 'vertical',
                      }}
                      disabled={!user || paidSub}
                      fundingSource='paypal'
                      createSubscription={(data, actions) => {
                        return actions.subscription.create({
                          plan_id: 'P-5DC05698WC351562JMGZFV6Y', // production: $1.99 per month
                          // plan_id: 'P-1YN01180390590643MGZNV3Y' // test: $0.05 per day
                        })
                      }}
                      // eslint-disable-next-line no-unused-vars
                      onApprove={async (data, actions) => {
                        await api.linkPaypalSubscription(data.subscriptionID)
                        history.push('/payments/success')
                      }}
                      onError={(error) => {
                        console.error(error)
                        setPaypalError(error)
                      }}
                    />
                    <div className='d-flex my-2'>
                      <hr className='flex-fill' />
                      <span className='mx-3 my-1 text-muted'>Or pay with card</span>
                      <hr className='flex-fill' />
                    </div>
                    <LinkContainer to='/payments/checkout'>
                      <Button variant='outline-primary' disabled={!user || paidSub}>
                        <p className='my-1'>Pay with credit card</p>
                      </Button>
                    </LinkContainer>
                  </Card>
                </Card.Subtitle>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </ModalBody>
    </Modal>
  )
}

const paidSubscriptionActive = (user, paypalSubscription, stripeSubscription) => {
  if (user?.private?.subscriptionExpiryDate) {
    const subscriptionExpiryDate = new Date(user.private.subscriptionExpiryDate._seconds * 1000)
    if (subscriptionExpiryDate > new Date()) {
      return true
    }
  }
  if (paypalSubscription?.status.toLowerCase() === 'active') {
    return true
  }
  if (stripeSubscription?.status.toLowerCase() === 'active') {
    return true
  }
  return false
}
