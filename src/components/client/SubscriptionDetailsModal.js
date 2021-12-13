/* eslint-disable no-unused-vars */
import { Button, Modal, ModalBody } from '../bootstrap-osu-collector'
import { useState } from 'react'
import * as api from '../../utils/api'
import Tabs from 'react-bootstrap/Tabs'
import { Spinner, Tab } from 'react-bootstrap'
import ReactJson from 'react-json-view'
import moment from 'moment'
import { ExclamationTriangleFill } from 'react-bootstrap-icons'

function SubscriptionDetailsModal({
    user,
    show,
    onHide,
    paypalSubscription,
    stripeSubscription,
    onPaypalSubscriptionCancel,
    onStripeSubscriptionCancel
}) {
    // auto renew issue
    const [autorenewNoticeVisible, setAutorenewNoticeVisible] = useState(false)

    const showPaypalSubscription = (paypalSubscription, stripeSubscription) => {
        if (!paypalSubscription) {
            return false
        }
        if (paypalSubscription.status.toLowerCase() === 'active') {
            return true
        }
        // status: cancelled or expired or other
        if (!stripeSubscription) {
            return true
        } else if (stripeSubscription.status === 'active') {
            return false
        } else {
            // status: (cancelled or expired or other) for BOTH subscriptions
            // show the one that is more recent
            const paypalSubscriptionDateCreated = new Date(paypalSubscription.create_time)
            const stripeSubscriptionDateCreated = new Date(stripeSubscription.created * 1000)
            return paypalSubscriptionDateCreated > stripeSubscriptionDateCreated
        }
    }
    const showStripeSubscription = (paypalSubscription, stripeSubscription) => {
        if (!stripeSubscription) {
            return false
        }
        if (stripeSubscription.status === 'active') {
            return true
        }
        // status: cancelled or expired or other
        if (!paypalSubscription) {
            return true
        } else if (paypalSubscription.status.toLowerCase() === 'active') {
            return false
        } else {
            // status: (cancelled or expired or other) for BOTH subscriptions
            // show the one that is more recent
            const paypalSubscriptionDateCreated = new Date(paypalSubscription.create_time)
            const stripeSubscriptionDateCreated = new Date(stripeSubscription.created * 1000)
            return stripeSubscriptionDateCreated > paypalSubscriptionDateCreated
        }
    }

    const paypalEndDate = new Date(paypalSubscription?.billing_info.next_billing_time || (user?.private?.subscriptionExpiryDate?._seconds * 1000))
    const paypalEndDateVerb =
        new Date() > paypalEndDate ? 'Ended' :
            paypalSubscription?.status.toLowerCase() === 'active' ? 'Renews' :
                'Ends'

    const stripeEndDate = ['canceled', 'past_due', 'incomplete', 'incomplete_expired'].includes(stripeSubscription?.status) ?
        new Date(user?.private?.subscriptionExpiryDate?._seconds * 1000)
        : new Date(stripeSubscription?.current_period_end * 1000)
    const stripeEndDateVerb =
        new Date() > stripeEndDate ? 'Ended' :
            stripeSubscription?.cancel_at_period_end ? 'Ends' :
                stripeSubscription?.status.toLowerCase() === 'active' ? 'Renews' :
                    'Ends'

    return (
        <>
            <Modal
                show={show}
                onHide={onHide}
                size='lg'
                centered
            >
                <ModalBody className='px-5 py-5'>
                    <h2 className='mb-3'>Your subscription</h2>
                    {!user?.private?.paypalSubscriptionId && !user?.private?.stripeSubscriptionId &&
                        <p className='text-muted'> Nothing to show </p>
                    }

                    {/* PayPal Subscription */}
                    {showPaypalSubscription(paypalSubscription, stripeSubscription) && <>
                        <SubscriptionDetails
                            subscriptionId={paypalSubscription.id}
                            status={paypalSubscription.status.toUpperCase()}
                            created={new Date(paypalSubscription.create_time)}
                            endDateVerb={paypalEndDateVerb}
                            endDate={paypalEndDate}
                            paymentMethodComponent={
                                <div className='mt-1 d-flex align-items-center'>
                                    <img
                                        src='https://www.paypalobjects.com/webstatic/mktg/Logo/pp-logo-100px.png'
                                        className='mr-2'
                                        style={{ width: 'auto', maxHeight: 20 }}
                                    />
                                    {paypalSubscription.subscriber.email_address}
                                </div>
                            }
                            subscriptionObject={paypalSubscription}
                            cancelSubscriptionApiCall={api.cancelPaypalSubscription}
                            canCancelSubscription={paypalSubscription.status.toLowerCase() === 'active'}
                            onSubscriptionCancel={onPaypalSubscriptionCancel}
                        />
                    </>}

                    {showPaypalSubscription(paypalSubscription, stripeSubscription) && showStripeSubscription(paypalSubscription, stripeSubscription) &&
                        <hr className='my-5' />
                    }

                    {/* Stripe Subscription */}
                    {showStripeSubscription(paypalSubscription, stripeSubscription) && <>
                        <SubscriptionDetails
                            subscriptionId={stripeSubscription.id}
                            status={
                                (stripeSubscription.status === 'active' && stripeSubscription.cancel_at_period_end) ?
                                    'Active until end of billing period'
                                    : stripeSubscription.status.toUpperCase()
                            }
                            created={new Date(stripeSubscription.created * 1000)}
                            endDateVerb={stripeEndDateVerb}
                            endDate={stripeEndDate}
                            paymentMethodComponent={
                                stripeSubscription?.default_payment_method?.card ?
                                    <div className='d-flex align-items-center'>
                                        {stripeSubscription.default_payment_method.card.brand}
                                        {' '}ending in{' '}
                                        {stripeSubscription.default_payment_method.card.last4}
                                    </div>
                                    :
                                    'No current payment method'
                            }
                            subscriptionObject={stripeSubscription}
                            cancelSubscriptionApiCall={api.cancelSubscription}
                            canCancelSubscription={stripeSubscription.status.toLowerCase() !== 'canceled' && !stripeSubscription.cancel_at_period_end}
                            onSubscriptionCancel={onStripeSubscriptionCancel}
                            specialStatusIndicator={
                                stripeSubscription?.status === 'past_due' && (new Date(stripeSubscription.created * 1000)) < new Date('2021-12-13T17:12:10+00:00') &&
                                <>
                                    <ExclamationTriangleFill
                                        className='ml-2'
                                        style={{ color: '#ffd966', cursor: 'pointer' }}
                                        onClick={() => setAutorenewNoticeVisible(true)}
                                    />
                                    <Modal show={autorenewNoticeVisible} onHide={() => setAutorenewNoticeVisible(false)} centered>
                                        <Modal.Body>
                                            We are currently experiencing an issue where subscriptions created before December 7th are not auto-renewing.
                                            <br /><br />
                                            If your subscription is over and has not auto-renewed, you can cancel your current subscription, then create a new subscription.
                                            <br /><br />
                                            We are very sorry for the inconvenience.
                                        </Modal.Body>
                                        <Modal.Footer>
                                            <Button variant='secondary' onClick={() => setAutorenewNoticeVisible(false)}>
                                                Ok
                                            </Button>
                                        </Modal.Footer>
                                    </Modal>
                                </>
                            }
                        />
                    </>}

                </ModalBody>
            </Modal>

        </>
    )
}


const SubscriptionDetails = ({
    subscriptionId,
    status,
    created,
    endDateVerb,
    endDate,
    paymentMethodComponent,
    subscriptionObject,
    cancelSubscriptionApiCall,
    canCancelSubscription,
    onSubscriptionCancel,
    specialStatusIndicator
}) => {
    const [cancelSubscriptionConfirmationVisible, setCancelSubscriptionConfirmationVisible] = useState(false)
    const [cancellingSubscription, setCancellingSubscription] = useState(false)
    const cancelSubscription = async () => {
        setCancellingSubscription(true)

        try {
            await cancelSubscriptionApiCall()
        } catch (err) {
            alert(err.message)
        }

        setCancellingSubscription(false)
        setCancelSubscriptionConfirmationVisible(false)
        onSubscriptionCancel()
    }
    const [showJSON, setShowJSON] = useState(false)

    return (
        <div>
            <div className='d-flex'>
                <div className='w-50'>
                    <div><small className='text-muted'>Subscription number</small></div>
                    <div>{subscriptionId}</div>
                </div>
                <div className='w-50'>
                    <div><small className='text-muted'>Status</small></div>
                    <div className='d-flex align-items-center'>
                        {status}
                        {specialStatusIndicator}
                    </div>
                </div>
            </div>
            <hr />
            <div className='d-flex'>
                <div className='w-50'>
                    <div><small className='text-muted'>Created on</small></div>
                    <div>{moment(created).format('MMMM Do, YYYY')}</div>
                </div>
                <div className='w-50'>
                    <div><small className='text-muted'>{endDateVerb} on</small></div>
                    <div>{endDate ? moment(endDate).format('MMMM Do, YYYY') : '---'}</div>
                </div>
            </div>
            <hr />
            <div className='d-flex'>
                <div className='w-50'>
                    <div><small className='text-muted'>Subscription fee</small></div>
                    <div>$1.99 USD per month</div>
                </div>
                <div className='w-50'>
                    <div>
                        <small className='text-muted'>Payment method</small>
                    </div>
                    {paymentMethodComponent}
                </div>
            </div>
            <hr />
            <div className='d-flex justify-content-end align-items-center'>
                <Button
                    size='sm'
                    className='mx-1'
                    variant='outline-secondary'
                    onClick={() => setShowJSON(!showJSON)}
                >
                    Show full details
                </Button>
                <Button
                    size='sm'
                    className='mx-1'
                    variant='outline-secondary'
                    onClick={() => alert('If you\'d like to change your payment method, please cancel your subscription, then create a new subscription with the new payment method after the old subscription ends.')}
                >
                    Change payment method
                </Button>
                <Button
                    size='sm'
                    className='ml-1'
                    variant='outline-danger'
                    disabled={!canCancelSubscription}
                    onClick={() => setCancelSubscriptionConfirmationVisible(true)}
                >
                    Cancel subscription
                </Button>
            </div>
            <Tab.Container activeKey={showJSON ? 'visible' : 'hidden'} defaultActiveKey='hidden'>
                <Tab.Content>
                    <Tab.Pane eventKey='hidden'>
                    </Tab.Pane>
                    <Tab.Pane eventKey='visible'>
                        <div className='mt-3'>
                            <ReactJson
                                src={subscriptionObject}
                                theme='ocean'
                                name={null}
                                style={{ padding: '16px', fontSize: '0.8em' }}
                                iconStyle='triangle'
                                enableClipboard={false}
                                displayObjectSize={false}
                                displayDataTypes={false}
                            />
                        </div>
                    </Tab.Pane>
                </Tab.Content>
            </Tab.Container>


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
        </div>
    )
}

export default SubscriptionDetailsModal
