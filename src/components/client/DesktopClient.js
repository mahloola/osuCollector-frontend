import { useEffect, useState } from 'react'
import Badge from 'react-bootstrap/Badge'
import { LinkContainer } from 'react-router-bootstrap'
import * as api from '../../utils/api'
import { useHistory } from 'react-router-dom'
import { Button, Card, CardBody, Col, Container, Row, Spinner } from '../bootstrap-osu-collector'
import downloadsPng from './downloads.png'
import importPng from './import.png'
import darkmodePng from './darkmode.png'
import styled from 'styled-components'
import { HeartFill, Twitch } from 'react-bootstrap-icons'
import { PayPalButtons } from '@paypal/react-paypal-js'
import { Alert } from 'react-bootstrap'
import SubscriptionDetailsModal from './SubscriptionDetailsModal'

const offsetX = 3
const offsetY = 3
const ShadowImg = styled.img`
  -webkit-filter: drop-shadow(${offsetX}px ${offsetY}px 8px rgba(0, 0, 0, 0.5));
  filter: url(#drop-shadow);
  -ms-filter: "progid:DXImageTransform.Microsoft.Dropshadow(OffX=${offsetX}, OffY=${offsetY}, Color='#444')";
  filter: "progid:DXImageTransform.Microsoft.Dropshadow(OffX=${offsetX}, OffY=${offsetY}, Color='#444')";
`

const ShadowHeart = styled(HeartFill)`
  -webkit-filter: drop-shadow(${offsetX}px ${offsetY}px 8px rgba(0, 0, 0, 0.5));
  filter: url(#drop-shadow);
  -ms-filter: "progid:DXImageTransform.Microsoft.Dropshadow(OffX=${offsetX}, OffY=${offsetY}, Color='#444')";
  filter: "progid:DXImageTransform.Microsoft.Dropshadow(OffX=${offsetX}, OffY=${offsetY}, Color='#444')";
`

function DesktopClient({ user, setUser }) {
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

  const Divider = () => (
    <div
      style={{
        height: '3rem',
        backgroundColor: 'rgba(0, 0, 0, .1)',
        border: 'solid rgba(0, 0, 0, .15)',
        borderWidth: '1px 0',
        boxShadow: 'inset 0 0.5em 1.5em rgb(0 0 0 / 10%), inset 0 0.125em 0.5em rgb(0 0 0 / 15%)',
      }}
    />
  )

  return (
    <div className='pb-5'>
      {/* {process.env.NODE_ENV === 'production' &&
                <Alert variant='danger'>
                    you shouldnt be here unless youre a dev
                </Alert>
            } */}

      <div className='bg-dark px-4 py-5 text-center'>
        <div className='mt-5'>
          <h1 className='display-5 fw-bold text-white'>Support us to gain access to these features!</h1>
          {/* <div className="col-lg-6 mx-auto">
                        <p className="fs-5 mb-4 text-secondary">The greatest thing FunOrange has made since osu! trainer</p>
                    </div> */}
        </div>
      </div>
      <Divider />
      <div className='px-4 py-5 text-center'>
        <div className='container col-xxl-8'>
          <div className='row flex-lg-row-reverse align-items-center g-5'>
            <div className='col-10 col-sm-8 col-lg-6'>
              <ShadowImg
                src={downloadsPng}
                className='d-block mx-lg-auto img-fluid'
                width='700'
                height='500'
                loading='lazy'
              />
            </div>
            <div className='col-lg-6'>
              <h1 className='display-5 fw-bold lh-1 mb-3'>Download entire collections</h1>
              <p className='lead text-secondary'>osu!Collector Desktop feature</p>
              <p className='lead text-secondary'>
                Download all the beatmaps in a collection with one click.
                <br />
                <small>
                  Downloads are hosted on our own servers.
                  <br />
                  No rate limits, stupid fast download speeds.
                </small>
              </p>
            </div>
          </div>
        </div>
      </div>
      <Divider />
      <div className='px-4 py-5 text-center'>
        <div className='container col-xxl-8'>
          <div className='row flex-lg-row-reverse align-items-center g-5'>
            <div className='col-10 col-sm-8 col-lg-6'>
              <ShadowImg
                src={importPng}
                className='d-block mx-lg-auto img-fluid'
                width='700'
                height='500'
                loading='lazy'
              />
            </div>
            <div className='col-lg-6'>
              <h1 className='display-5 fw-bold lh-1 mb-3'>Import collections</h1>
              <p className='lead text-secondary'>osu!Collector Desktop feature</p>
              <p className='lead text-secondary'>Directly add collections to osu! with the click of a button</p>
            </div>
          </div>
        </div>
      </div>
      <Divider />
      <div className='px-4 py-5 text-center'>
        <div className='container col-xxl-8'>
          <div className='row flex-lg-row-reverse align-items-center g-5'>
            <div className='col-10 col-sm-8 col-lg-6'>
              <ShadowImg
                src={darkmodePng}
                className='d-block mx-lg-auto img-fluid'
                width='700'
                height='500'
                loading='lazy'
              />
            </div>
            <div className='col-lg-6'>
              <h1 className='display-5 fw-bold lh-1 mb-3'>Dark mode</h1>
              <p className='lead text-secondary'>Also available on the website</p>
            </div>
          </div>
        </div>
      </div>
      <Divider />
      <div className='px-4 py-5 text-center'>
        <div className='container col-xxl-8'>
          <div className='row flex-lg-row-reverse align-items-center g-5'>
            <div className='col-10 col-sm-8 col-lg-6'>
              <ShadowHeart className='my-4' style={{ color: '#FF66AB', width: 200, height: 200 }} />
            </div>
            <div className='col-lg-6'>
              <h1 className='display-5 fw-bold lh-1 mb-3'>Help pay for server costs</h1>
              <p className='lead text-secondary'>
                I had to find some way to monetize this project so that it could continue running on its own. I figured
                something in similar vein to osu! supporter would be the best approach. Any support you give us is
                greatly appreciated!
              </p>
            </div>
          </div>
        </div>
      </div>
      <Divider />

      <Container className='pt-4'>
        <Card className='shadow-sm mt-4 mb-5'>
          <CardBody>
            <Card.Title>
              <h3 id='download'>
                <strong>Download osu!Collector Desktop</strong>
              </h3>
            </Card.Title>
            <Card.Subtitle>
              <Button
                disabled={!user?.paidFeaturesAccess}
                variant={user?.paidFeaturesAccess ? 'primary' : 'outline-secondary'}
                className='mr-2 my-2'
                onClick={() => downloadInstaller('win32')}
              >
                Windows 64-bit
              </Button>
              <Button
                disabled={!user?.paidFeaturesAccess}
                variant={user?.paidFeaturesAccess ? 'primary' : 'outline-secondary'}
                className='mr-2 my-2'
                onClick={() => downloadInstaller('linux')}
              >
                Linux x64 .deb
              </Button>
              <br />
              {user?.paidFeaturesAccess
                ? 'Thank you for supporting us! You are awesome.'
                : 'Please support us to gain access to the desktop client.'}
            </Card.Subtitle>
          </CardBody>
        </Card>

        <h2 className='text-center'>Two ways to support us!</h2>
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
                      {user?.private?.twitchError && (
                        <small className='text-danger text-sm ml-2'> Please unlink and try again. </small>
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

        <svg height='0' xmlns='http://www.w3.org/2000/svg'>
          <filter id='drop-shadow'>
            <feGaussianBlur in='SourceAlpha' stdDeviation='2' />
            <feOffset dx={offsetX} dy={offsetY} result='offsetblur' />
            <feFlood floodColor='rgba(0,0,0,0.15)' />
            <feComposite in2='offsetblur' operator='in' />
            <feMerge>
              <feMergeNode />
              <feMergeNode in='SourceGraphic' />
            </feMerge>
          </filter>
        </svg>

        <SubscriptionDetailsModal
          user={user}
          show={paymentModalVisible}
          onHide={() => setPaymentModalVisible(false)}
          paypalSubscription={paypalSubscription}
          stripeSubscription={stripeSubscription}
          onPaypalSubscriptionCancel={onPaypalSubscriptionCancel}
          onStripeSubscriptionCancel={onStripeSubscriptionCancel}
        />
      </Container>
    </div>
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

export default DesktopClient
