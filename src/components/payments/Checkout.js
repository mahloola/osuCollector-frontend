/* eslint-disable no-unused-vars */
import { useState } from 'react'
import { Alert, Button, Card, Col, Container, Form, FormControl, Row, Spinner } from '../bootstrap-osu-collector'
import FloatingLabel from 'react-bootstrap-floating-label'
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { ReactSVG } from 'react-svg'
import * as api from '../../utils/api'
import { validateEmail } from '../../utils/misc'
import { useHistory } from 'react-router-dom'

function Checkout() {
  const [processing, setProcessingTo] = useState(0)
  const [checkoutError, setCheckoutError] = useState('')
  const [cardError, setCardError] = useState(false)

  const history = useHistory()
  const stripe = useStripe()
  const elements = useElements()

  const handleCardDetailsChange = (ev) => {
    if (ev.error) {
      setCheckoutError(ev.error.message)
      setCardError(true)
    } else {
      setCheckoutError('')
      setCardError(false)
    }
  }

  const handleFormSubmit = async (ev) => {
    ev.preventDefault()

    const email = ev.target[0].value
    if (!validateEmail(email)) {
      setCheckoutError('That is not a valid email')
      setProcessingTo(0)
      return
    }

    const cardElement = elements.getElement('card')

    // Create customer by sending request to backend
    setProcessingTo(1)
    const createCustomerResponse = await api.createCustomer(email)
    console.log(createCustomerResponse)

    // Create subscription by sending request to backend
    let createSubscriptionResponse
    try {
      setProcessingTo(2)
      createSubscriptionResponse = await api.createSubscription()
    } catch (err) {
      setCheckoutError(err.message)
      setProcessingTo(0)
      return
    }
    const clientSecret = createSubscriptionResponse.clientSecret
    console.log(createSubscriptionResponse)

    // Collect the payment via Stripe
    setProcessingTo(3)
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          email: email,
        },
      },
      setup_future_usage: 'off_session',
    })
    if (result.error) {
      setCheckoutError(result.error.message)
      setProcessingTo(0)
      return
    }
    history.push('/payments/success')
  }

  const cardElementOpts = {
    iconStyle: 'solid',
    style: {
      base: {
        color: '#000',
        fontSize: '16px',
        // iconColor: '#aaa',
        // '::placeholder': {
        //     color: '#999'
        // }
      },
      // invalid: {
      //     iconColor: '#FFC7EE',
      //     color: '#FFC7EE'
      // },
      // complete: {
      //     iconColor: '#cbf4c9'
      // }
    },
    // hidePostalCode: true
  }

  return (
    <Container className='pt-4'>
      {/* {process.env.NODE_ENV === 'production' &&
                    <Alert variant='danger'>
                        you shouldnt be here unless youre a dev
                    </Alert>
                } */}
      <Row className='justify-content-md-center'>
        <Col sm={12} md={9} lg={6}>
          <Card className='shadow-sm pt-3 px-3 mb-3 mt-4 text-center'>
            <h3>Desktop Client Subscription</h3>
            <p>
              $1.99 per month
              <br />
              auto-renewing subscription (you may cancel at any time)
            </p>
          </Card>
        </Col>
      </Row>

      <Row className='justify-content-md-center'>
        <Col sm={12} md={9} lg={6}>
          <Card className='shadow-sm py-4 px-5 my-4 text-center'>
            <h5 className='mb-4'>Pay with card</h5>

            <Form onSubmit={handleFormSubmit}>
              <FloatingLabel label='Email' className='mb-3'>
                <FormControl type='email' placeholder='name@example.com' />
              </FloatingLabel>
              <Card className='my-3 p-3'>
                <CardElement options={cardElementOpts} onChange={handleCardDetailsChange} />
              </Card>
              {checkoutError && (
                <>
                  <Alert className='mt-2 p-2' variant='danger'>
                    {checkoutError}
                  </Alert>
                  <Alert className='mt-2 p-2' variant='secondary'>
                    If you need help contact funorange42@yahoo.ca
                  </Alert>
                </>
              )}
              {/* TIP always disable your submit button while processing payments */}
              <Button type='submit' className='w-100 mb-5' disabled={cardError || processing > 0 || !stripe}>
                {processing ? (
                  <>
                    <Spinner as='span' animation='grow' className='mr-2' size='sm' role='status' aria-hidden='true' />
                    Processing ({processing}/3)
                  </>
                ) : (
                  `Subscribe`
                )}
              </Button>
            </Form>

            <ReactSVG
              src='https://cdn.brandfolder.io/KGT2DTA4/at/rvgw5pc69nhv9wkh7rw8ckv/Powered_by_Stripe_-_blurple.svg'
              beforeInjection={(svg) => {
                svg.setAttribute('style', 'width: 128px')
              }}
            />
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default Checkout
