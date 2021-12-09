import { useState } from 'react'
import Badge from 'react-bootstrap/Badge'
import { LinkContainer } from 'react-router-bootstrap'
import Modal from 'react-bootstrap/Modal'
import * as api from '../../utils/api'
import { useHistory } from 'react-router'
import { Button, Card, CardBody, Col, Container, Row, Spinner } from '../bootstrap-osu-collector'
import downloadsPng from './downloads.png'
import importPng from './import.png'
import darkmodePng from './darkmode.png'
import styled from 'styled-components'
import { ExclamationTriangleFill, HeartFill } from 'react-bootstrap-icons'
import moment from 'moment'

const downloadInstaller = async () => {
    try {
        const installerURL = await api.getInstallerURL()
        open(installerURL)
    } catch (err) {
        alert('Error ' + err.response.status + ': ' + err.response.data)
    }
}

const paidSubscriptionStatus = (user) => {
    if (!user?.private?.subscriptionExpiryDate) {
        return 'Inactive'
    }
    const subscriptionExpiryDate = new Date(user.private.subscriptionExpiryDate._seconds * 1000)
    if (subscriptionExpiryDate > new Date()) {
        // const renewOrEnd = user?.private?.stripeSubscriptionId ? 'auto-renews' : 'ends'
        return 'Active'
    } else {
        return 'Inactive'
    }
}

const offsetX = 3
const offsetY = 3
const ShadowImg = styled.img`
    -webkit-filter: drop-shadow(${offsetX}px ${offsetY}px 8px rgba(0,0,0,0.5));
    filter: url(#drop-shadow);
    -ms-filter: "progid:DXImageTransform.Microsoft.Dropshadow(OffX=${offsetX}, OffY=${offsetY}, Color='#444')";
    filter: "progid:DXImageTransform.Microsoft.Dropshadow(OffX=${offsetX}, OffY=${offsetY}, Color='#444')";
`

const ShadowHeart = styled(HeartFill)`
    -webkit-filter: drop-shadow(${offsetX}px ${offsetY}px 8px rgba(0,0,0,0.5));
    filter: url(#drop-shadow);
    -ms-filter: "progid:DXImageTransform.Microsoft.Dropshadow(OffX=${offsetX}, OffY=${offsetY}, Color='#444')";
    filter: "progid:DXImageTransform.Microsoft.Dropshadow(OffX=${offsetX}, OffY=${offsetY}, Color='#444')";
`

function DesktopClient({ user, setUser }) {
    const history = useHistory()

    // Buy now
    const [alreadySubbedModalVisible, setAlreadySubbedModalVisible] = useState(false)
    const [alreadyPaidModalVisible, setAlreadyPaidModalVisible] = useState(false)
    const buyNowClicked = () => {
        if (paidSubscriptionStatus(user).includes('Active')) {
            setAlreadyPaidModalVisible(true)
        } else if (user?.isSubbedToFunOrange) {
            setAlreadySubbedModalVisible(true)
        } else {
            history.push('/payments/checkout')
        }
    }

    // Cancel Subscription
    const [cancelSubscriptionConfirmationVisible, setCancelSubscriptionConfirmationVisible] = useState(false)
    const [cancellingSubscription, setCancellingSubscription] = useState(false)
    const cancelSubscription = async () => {
        setCancellingSubscription(true)

        try {
            const result = await api.cancelSubscription()
            console.log(result)
        } catch (err) {
            alert(err.message)
        }
        const data = await api.getOwnUser()
        setUser(data)
        console.log(data)

        setCancellingSubscription(false)
        setCancelSubscriptionConfirmationVisible(false)
    }

    // Change Payment Method
    const [changePaymentMethodVisible, setChangePaymentMethodVisible] = useState(false)

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

    // auto renew notice
    const [autorenewNoticeVisible, setAutorenewNoticeVisible] = useState(false)

    // Current Status
    const linkedTwitchAccountStatus = user?.private?.linkedTwitchAccount?.displayName || 'Not linked'
    const twitchSubStatus = user?.isSubbedToFunOrange ? 'Subbed' : 'Not subbed'
    const userIsSubscribed = user?.isSubbedToFunOrange || new Date(user?.private?.subscriptionExpiryDate?._seconds * 1000) > new Date()
    const expiryEvent = (Date.now() / 1000) > user?.private?.subscriptionExpiryDate?._seconds ? 'Ended' :
        user?.private?.stripeSubscriptionId ? 'Renews' :
            'Ends'

    const Divider = () => (
        <div style={{
            height: '3rem',
            backgroundColor: 'rgba(0, 0, 0, .1)',
            border: 'solid rgba(0, 0, 0, .15)',
            borderWidth: '1px 0',
            boxShadow: 'inset 0 0.5em 1.5em rgb(0 0 0 / 10%), inset 0 0.125em 0.5em rgb(0 0 0 / 15%)'
        }} />
    )

    return (
        <div className='pb-5'>
            {/* {process.env.NODE_ENV === 'production' &&
                <Alert variant='danger'>
                    you shouldnt be here unless youre a dev
                </Alert>
            } */}

            <div className="bg-dark px-4 py-5 text-center">
                <div className="mt-5">
                    <h1 className="display-5 fw-bold text-white">Support us to gain access to these features!</h1>
                    {/* <div className="col-lg-6 mx-auto">
                        <p className="fs-5 mb-4 text-secondary">The greatest thing FunOrange has made since osu! trainer</p>
                    </div> */}
                </div>
            </div>
            <Divider />
            <div className="px-4 py-5 text-center">
                <div className="container col-xxl-8">
                    <div className="row flex-lg-row-reverse align-items-center g-5">
                        <div className="col-10 col-sm-8 col-lg-6">
                            <ShadowImg src={downloadsPng} className="d-block mx-lg-auto img-fluid" width="700" height="500" loading="lazy" />
                        </div>
                        <div className="col-lg-6">
                            <h1 className="display-5 fw-bold lh-1 mb-3">Download entire collections</h1>
                            <p className="lead text-secondary">
                                osu!Collector Desktop feature
                            </p>
                            <p className="lead text-secondary">
                                Download all the beatmaps in a collection with one click.<br />
                                <small>
                                    Downloads are hosted on our own servers.<br/>
                                    No rate limits, stupid fast download speeds.
                                </small>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <Divider />
            <div className="px-4 py-5 text-center">
                <div className="container col-xxl-8">
                    <div className="row flex-lg-row-reverse align-items-center g-5">
                        <div className="col-10 col-sm-8 col-lg-6">
                            <ShadowImg src={importPng} className="d-block mx-lg-auto img-fluid" width="700" height="500" loading="lazy" />
                        </div>
                        <div className="col-lg-6">
                            <h1 className="display-5 fw-bold lh-1 mb-3">Import collections</h1>
                            <p className="lead text-secondary">
                                osu!Collector Desktop feature
                            </p>
                            <p className="lead text-secondary">Directly add collections to osu! with the click of a button</p>
                        </div>
                    </div>
                </div>
            </div>
            <Divider />
            <div className="px-4 py-5 text-center">
                <div className="container col-xxl-8">
                    <div className="row flex-lg-row-reverse align-items-center g-5">
                        <div className="col-10 col-sm-8 col-lg-6">
                            <ShadowImg src={darkmodePng} className="d-block mx-lg-auto img-fluid" width="700" height="500" loading="lazy" />
                        </div>
                        <div className="col-lg-6">
                            <h1 className="display-5 fw-bold lh-1 mb-3">Dark mode</h1>
                            <p className="lead text-secondary">Also available on the website</p>
                        </div>
                    </div>
                </div>
            </div>
            <Divider />
            <div className="px-4 py-5 text-center">
                <div className="container col-xxl-8">
                    <div className="row flex-lg-row-reverse align-items-center g-5">
                        <div className="col-10 col-sm-8 col-lg-6">
                            <ShadowHeart className='my-4' style={{ color: '#FF66AB', width: 200, height: 200 }} />
                        </div>
                        <div className="col-lg-6">
                            <h1 className="display-5 fw-bold lh-1 mb-3">Help pay for server costs</h1>
                            <p className="lead text-secondary">
                                I had to find some way to monetize this project so that it could continue running on its own.
                                I figured something in similar vein to osu! supporter would be the best approach.
                                Any support you give us is greatly appreciated!
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
                                <strong>
                                    Download osu!Collector Desktop
                                </strong>
                            </h3>
                        </Card.Title>
                        <Card.Subtitle>
                            <Button
                                disabled={!userIsSubscribed}
                                variant={userIsSubscribed ? 'primary' : 'outline-secondary'}
                                className='mr-2 my-2'
                                onClick={downloadInstaller}
                            >
                                Windows (64-bit)
                            </Button>
                            <br />
                            {userIsSubscribed ? 'Thank you for supporting us! You are awesome.' : 'Please support us to gain access to the desktop client.'}
                        </Card.Subtitle>
                    </CardBody>
                </Card>

                <h2 className='text-center'>Two ways to support us!</h2>
                <p>
                    Please note that supporting us with both methods at the same time <strong>will not extend your supporter status!</strong>&nbsp;
                    If you want to save money we recommend doing only 1 option.
                </p>
                <Row>
                    <Col>
                        <Card className='shadow mb-4'>
                            <CardBody>
                                <Card.Title>
                                    <span className='mr-2'>Option 1</span> <i>free with Twitch Prime</i>
                                </Card.Title>
                                <Card className='shadow-sm p-3 mx-3 my-4'>
                                    <p><strong className='mr-2'>1</strong> Link your Twitch account with osu!Collector</p>
                                    {!user ?
                                        <Button
                                            disabled
                                            variant='outline-secondary'>
                                            You are not logged in
                                        </Button>
                                        : user?.private?.linkedTwitchAccount ?
                                            <Button
                                                disabled
                                                variant='outline-secondary'>
                                                Already linked: {user.private.linkedTwitchAccount.displayName}
                                            </Button>
                                            :
                                            <Button
                                                href='https://id.twitch.tv/oauth2/authorize?client_id=q0uygwcj9cplrb0sb20x7fthkc4wcd&redirect_uri=https%3A%2F%2Fosucollector.com%2Fauthentication%2Ftwitch&response_type=code&scope=user:read:subscriptions'
                                                variant='outline-primary'>
                                                Link Twitch Account
                                            </Button>
                                    }
                                </Card>
                                <Card className='shadow-sm p-3 mx-3 my-4'>
                                    <p><strong className='mr-2'>2</strong> Subscribe to FunOrange&apos;s Twitch channel (if you haven&apos;t already)</p>
                                    <Button
                                        href='https://www.twitch.tv/funorange42'
                                        variant='outline-primary'>
                                        FunOrange&apos;s Twitch Channel
                                    </Button>
                                </Card>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col>
                        <Card className='shadow mb-4'>
                            <CardBody>
                                <Card.Title>
                                    Option 2
                                </Card.Title>
                                <Card.Subtitle>
                                    <Card className='shadow-sm p-3 mx-3 my-4'>
                                        <p>Purchase the desktop client for $1.99 per month</p>
                                        {user ?
                                            <Button onClick={buyNowClicked} variant='outline-primary'>Buy now!</Button>
                                            :
                                            <Button disabled variant='outline-secondary'>You are not logged in</Button>
                                        }
                                    </Card>
                                </Card.Subtitle>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>

                <Card className='shadow-sm my-5'>
                    <CardBody>
                        <Card.Title>
                            Current Status
                        </Card.Title>
                        <Card.Subtitle>
                            <p>You are <strong>{!userIsSubscribed && 'not'} currently supporting</strong> osu!Collector.</p>
                            <Row>
                                <Col xs={6}>
                                    <Card className='shadow-sm p-3'>
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
                                            {user?.private?.linkedTwitchAccount?.displayName &&
                                                <Button onClick={unlinkTwitchAccount} style={{ width: 60, padding: '0 0 0 0' }} size='sm' variant='outline-secondary'>
                                                    {unlinkingTwitchAccount ?
                                                        <Spinner as='span' animation='grow' size='sm' role='status' aria-hidden='true' />
                                                        :
                                                        <small>Unlink</small>
                                                    }
                                                </Button>
                                            }
                                        </div>
                                        <div className='d-flex justify-content-start align-items-center'>
                                            <div className='text-right mr-3' style={{ minWidth: 120 }}>
                                                Twitch Sub
                                            </div>
                                            <div>
                                                <Badge
                                                    variant={user?.isSubbedToFunOrange ? 'success' : 'secondary'}
                                                    className='py-1 px-2'
                                                >
                                                    {twitchSubStatus}
                                                </Badge>
                                            </div>
                                        </div>
                                        {user?.private?.error &&
                                            <span className='mt-2 ml-2 text-danger'>
                                                An error occurred. Please try to unlink and relink your twitch account.
                                            </span>
                                        }
                                    </Card>
                                </Col>
                                <Col xs={6}>
                                    <Card className='shadow-sm p-3'>
                                        <div className='d-flex justify-content-start align-items-center'>
                                            <div className='text-right mr-3'>
                                                Paid Subscription
                                            </div>
                                            <Badge
                                                variant={
                                                    paidSubscriptionStatus(user) === 'Active' ?
                                                        'success'
                                                        : paidSubscriptionStatus(user) === 'Active*' ?
                                                            'warning'
                                                            :
                                                            'secondary'}
                                                className='py-1 px-2 mr-3'
                                            >
                                                {paidSubscriptionStatus(user)}
                                            </Badge>
                                            {user?.private?.stripeSubscriptionId && paidSubscriptionStatus(user) === 'Inactive' &&
                                                <ExclamationTriangleFill
                                                    className='mr-2'
                                                    style={{ color: '#ffd966', cursor: 'pointer' }}
                                                    onClick={() => setAutorenewNoticeVisible(true)}
                                                />
                                            }
                                            {user?.private?.subscriptionExpiryDate?._seconds &&
                                                <small className='text-muted'>
                                                    {expiryEvent} on {moment.unix(user.private.subscriptionExpiryDate._seconds).format('MMMM Do YYYY')}
                                                </small>
                                            }
                                        </div>
                                        {user?.private?.stripeSubscriptionId &&
                                            <div className='mt-3 d-flex justify-content-start'>
                                                <Col xs='auto' className='pl-0'>
                                                    <Button onClick={() => setChangePaymentMethodVisible(true)} size='sm' variant='outline-secondary'>Change payment method</Button>
                                                </Col>
                                                <Col xs='auto' className='pl-0'>
                                                    <Button onClick={() => setCancelSubscriptionConfirmationVisible(true)} size='sm' variant='outline-danger'>Cancel Subscription</Button>
                                                </Col>
                                            </div>
                                        }
                                    </Card>
                                </Col>
                            </Row>
                        </Card.Subtitle>
                    </CardBody>
                </Card>
                <svg height="0" xmlns="http://www.w3.org/2000/svg">
                    <filter id="drop-shadow">
                        <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
                        <feOffset dx={offsetX} dy={offsetY} result="offsetblur" />
                        <feFlood floodColor="rgba(0,0,0,0.15)" />
                        <feComposite in2="offsetblur" operator="in" />
                        <feMerge>
                            <feMergeNode />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </svg>


                <Modal show={alreadySubbedModalVisible} onHide={() => setAlreadySubbedModalVisible(false)} size='lg' centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Warning</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        It looks like you are already subbed to FunOrange&apos;s Twitch channel.<br />
                        Are you sure you would like to support us for an additional $1.99/month?
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant='secondary' onClick={() => setAlreadySubbedModalVisible(false)}>
                            Ok
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={alreadySubbedModalVisible} onHide={() => setAlreadySubbedModalVisible(false)} size='lg' centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Warning</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        It looks like you are already subbed to my twitch account.<br />
                        Are you sure you would like to support us for an additional $1.99/month?
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant='secondary' onClick={() => setAlreadySubbedModalVisible(false)}>
                            No
                        </Button>
                        <LinkContainer to='/payments/checkout'>
                            <Button> Yes </Button>
                        </LinkContainer>
                    </Modal.Footer>
                </Modal>

                <Modal show={alreadyPaidModalVisible} onHide={() => setAlreadyPaidModalVisible(false)} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Error</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        It looks like you are already have an active paid subscription.
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant='secondary' onClick={() => setAlreadyPaidModalVisible(false)}>
                            Okay
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={cancelSubscriptionConfirmationVisible} onHide={() => setCancelSubscriptionConfirmationVisible(false)} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirmation</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Are you sure you would like to cancel your subscription?</Modal.Body>
                    <Modal.Footer>
                        <Button variant='secondary' onClick={() => setCancelSubscriptionConfirmationVisible(false)}>
                            No
                        </Button>
                        <Button style={{ width: 240 }} variant='danger' onClick={cancelSubscription}>
                            {cancellingSubscription ?
                                <>
                                    <Spinner
                                        className='mr-2'
                                        as='span'
                                        animation='grow'
                                        size='sm'
                                        role='status'
                                        aria-hidden='true' />
                                    Processing...
                                </>
                                : 'Yes, cancel my subscription'}
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={changePaymentMethodVisible} onHide={() => setChangePaymentMethodVisible(false)} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Changing Your Payment Method</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>If you would like to change payment method, please cancel your existing subscription, then subscribe with a new payment method once the old subscription ends.</Modal.Body>
                    <Modal.Footer>
                        <Button variant='secondary' onClick={() => setChangePaymentMethodVisible(false)}>
                            Ok
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={autorenewNoticeVisible} onHide={() => setAutorenewNoticeVisible(false)} centered>
                    <Modal.Body>
                        We are currently experiencing an issue where subscriptions are not auto-renewing.
                        <br/><br/>
                        Customers who created a subscription before December 7th are affected by this issue.
                        <br/><br/>
                        If your subscription is over and has not auto-renewed, you can click Cancel Subscription,
                        and then create a new subscription by clicking Buy Now! and checking out as before.
                        <br/><br/>
                        We are very sorry for the inconvenience.
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant='secondary' onClick={() => setAutorenewNoticeVisible(false)}>
                            Ok
                        </Button>
                    </Modal.Footer>
                </Modal>

            </Container>
        </div>
    )
}

export default DesktopClient