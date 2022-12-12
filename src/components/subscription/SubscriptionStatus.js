import { useEffect, useState } from 'react'
import Badge from 'react-bootstrap/Badge'
import * as api from '../../utils/api'
import { useHistory } from 'react-router-dom'
import { Button, Card, CardBody, Col, Container, Row, Spinner } from '../bootstrap-osu-collector'
import SubscriptionDetailsModal from '../client/SubscriptionDetailsModal'
import SubscribeModal from 'components/client/SubscribeModal'

function SubscriptionStatus({ user, setUser }) {
  const history = useHistory()

  const [isSubbedToFunOrange, setIsSubbedToFunOrange] = useState(false)

  const [paypalError, setPaypalError] = useState(null)

  const [paypalSubscription, setPaypalSubscription] = useState(null)
  const onPaypalSubscriptionCancel = async () => {
    setUser(await api.getOwnUser())
    if (user?.private?.paypalSubscriptionId) {
      setPaypalSubscription(await api.getPaypalSubscription(user?.private?.paypalSubscriptionId))
    }
  }

  const [stripeSubscription, setStripeSubscription] = useState(null)
  const onStripeSubscriptionCancel = async () => {
    setUser(await api.getOwnUser())
    if (user?.private?.stripeSubscriptionId) {
      setStripeSubscription(await api.getSubscription(user?.private?.stripeSubscriptionId))
    }
  }

  useEffect(() => {
    if (!user || paypalSubscription || stripeSubscription) {
      return
    }
    let cancel1, cancel2, cancel3
    api
      .getTwitchSubStatus((c) => (cancel1 = c))
      .then(setIsSubbedToFunOrange)
      .catch(console.error)
    if (user?.private?.paypalSubscriptionId) {
      api
        .getPaypalSubscription((c) => (cancel2 = c))
        .then(setPaypalSubscription)
        .catch(console.error)
    }
    if (user?.private?.stripeSubscriptionId) {
      api
        .getSubscription((c) => (cancel3 = c))
        .then(setStripeSubscription)
        .catch(console.error)
    }
    return () => {
      if (cancel1) cancel1()
      if (cancel2) cancel2()
      if (cancel3) cancel3()
    }
  }, [user])

  const [paymentModalVisible, setPaymentModalVisible] = useState(false)
  const [subscribeModalVisible, setSubscribeModalVisible] = useState(false)

  // Unlink Twitch
  const [unlinkingTwitchAccount, setUnlinkingTwitchAccount] = useState(false)
  const unlinkTwitchAccount = async () => {
    setUnlinkingTwitchAccount(true)

    try {
      await api.unlinkTwitchAccount()
      console.log('ok')
    } catch (err) {
      alert(err.message)
    }
    const data = await api.getOwnUser()
    setUser(data)
    console.log(data)

    setUnlinkingTwitchAccount(false)
  }

  // Current Status
  const linkedTwitchAccountStatus = user?.private?.linkedTwitchAccount?.displayName || 'Not linked'
  const twitchSubStatus = isSubbedToFunOrange ? 'Subbed' : 'Not subbed'

  const twitchSub = isSubbedToFunOrange
  const paidSub = paidSubscriptionActive(user, paypalSubscription, stripeSubscription)

  return (
    <Container className='pt-4'>
      {!twitchSub && !paidSub && (
        <Alert variant='warning' className='text-center'>
          {/* @ts-ignore */}
          <span style={{ marginRight: '10px' }}>It looks like your subscription has ended! </span>
          <Button size='sm' onClick={() => setSubscribeModalVisible(true)}>
            Subscribe
          </Button>
        </Alert>
      )}
      <Card className='shadow-sm my-5'>
        <CardBody>
          <Card.Title>
            <h5 id='status'>Current status</h5>
          </Card.Title>
          <Card.Subtitle>
            <p>
              You are <strong>{!user?.paidFeaturesAccess && 'not'} currently supporting</strong> osu!Collector.
            </p>
            <Row>
              <Col md={12} lg={6}>
                <Card className='shadow-sm p-3 mb-4'>
                  <div className='mb-2 d-flex justify-content-start align-items-center'>
                    <div className='text-right mr-3' style={{ minWidth: 120 }}>
                      Twitch account
                    </div>
                    <div>
                      <Badge
                        variant={user?.private?.linkedTwitchAccount?.displayName ? 'info' : 'secondary'}
                        className='py-1 px-2 mr-2'
                      >
                        {linkedTwitchAccountStatus}
                      </Badge>
                    </div>
                    {user?.private?.linkedTwitchAccount?.displayName && (
                      <Button
                        onClick={unlinkTwitchAccount}
                        style={{ width: 60, padding: '0 0 0 0' }}
                        size='sm'
                        variant='outline-secondary'
                      >
                        {unlinkingTwitchAccount ? (
                          <Spinner as='span' animation='grow' size='sm' role='status' aria-hidden='true' />
                        ) : (
                          <small>Unlink</small>
                        )}
                      </Button>
                    )}
                    {user?.private?.twitchError && user?.private?.linkedTwitchAccount?.displayName && (
                      <small className='text-danger text-sm ml-2'> Please unlink and try again. </small>
                    )}
                    {!user?.private?.linkedTwitchAccount?.displayName && (
                      <Button
                        href='https://id.twitch.tv/oauth2/authorize?client_id=q0uygwcj9cplrb0sb20x7fthkc4wcd&redirect_uri=https%3A%2F%2Fosucollector.com%2Fauthentication%2Ftwitch&response_type=code&scope=user:read:subscriptions'
                        variant='link'
                      >
                        <small>Link Twitch Account</small>
                      </Button>
                    )}
                  </div>
                  <div className='d-flex justify-content-start align-items-center'>
                    <div className='text-right mr-3' style={{ minWidth: 120 }}>
                      Twitch Sub
                    </div>
                    <div>
                      <Badge variant={isSubbedToFunOrange ? 'success' : 'secondary'} className='py-1 px-2'>
                        {twitchSubStatus}
                      </Badge>
                    </div>
                  </div>
                  {user?.private?.error && (
                    <span className='mt-2 ml-2 text-danger'>
                      An error occurred. Please try to unlink and relink your twitch account.
                    </span>
                  )}
                </Card>
              </Col>
              <Col md={12} lg={6}>
                <Card className='shadow-sm p-3 mb-2'>
                  <div className='mb-3 d-flex justify-content-start align-items-center'>
                    <div className='text-right mr-3'>Paid Subscription</div>
                    <Badge
                      variant={
                        paidSubscriptionActive(user, paypalSubscription, stripeSubscription) ? 'success' : 'secondary'
                      }
                      className='py-1 px-2 mr-3'
                    >
                      {paidSubscriptionActive(user, paypalSubscription, stripeSubscription) ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  {(user?.private?.paypalSubscriptionId || user?.private?.stripeSubscriptionId) && (
                    <Button onClick={() => setPaymentModalVisible(true)} size='sm' variant='outline-secondary'>
                      Show details
                    </Button>
                  )}
                </Card>
              </Col>
            </Row>
          </Card.Subtitle>
        </CardBody>
      </Card>

      <SubscriptionDetailsModal
        user={user}
        show={paymentModalVisible}
        onHide={() => setPaymentModalVisible(false)}
        paypalSubscription={paypalSubscription}
        stripeSubscription={stripeSubscription}
        onPaypalSubscriptionCancel={onPaypalSubscriptionCancel}
        onStripeSubscriptionCancel={onStripeSubscriptionCancel}
      />
      <SubscribeModal
        user={user}
        show={subscribeModalVisible}
        onHide={() => setSubscribeModalVisible(false)}
        paypalSubscription={paypalSubscription}
        stripeSubscription={stripeSubscription}
        isSubbedToFunOrange={isSubbedToFunOrange}
      />
    </Container>
  )
}

const downloadInstaller = async (platform = 'win32') => {
  try {
    const installerURL = await api.getInstallerURL(platform)
    open(installerURL)
  } catch (err) {
    alert('Error ' + err.response.status + ': ' + err.response.data)
  }
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

export default SubscriptionStatus
