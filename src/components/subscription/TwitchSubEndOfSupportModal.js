import { useEffect, useState } from 'react'
import { Button, ModalHeader, ModalBody } from '../bootstrap-osu-collector'
import Modal from 'react-bootstrap/Modal'

export default function TwitchSubEndOfSupportModal({ user }) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const alreadyShown = localStorage.getItem('twitch-sub-end-of-support-modal-shown')
    if (user?.private?.linkedTwitchAccount?.id && alreadyShown !== 'true') {
      setShow(true)
    }
  }, [user?.private?.linkedTwitchAccount?.id])

  const onConfirm = () => {
    localStorage.setItem('twitch-sub-end-of-support-modal-shown', 'true')
    setShow(false)
  }

  return (
    <Modal show={show} onHide={() => setShow(false)} size='lg' centered={true} scrollable={true}>
      <ModalHeader closeButton>
        <Modal.Title>Dear Beloved Twitch Subscriber,</Modal.Title>
      </ModalHeader>
      <ModalBody>
        <p>
          Thank you for your support. Unfortunately,{' '}
          <b style={{ color: 'oklch(0.704 0.191 22.216)' }}>
            we are ending support for Twitch subscriptions starting April.
          </b>
        </p>
        <p>
          The reason for this is that 6 months ago, Twitch suspended all payouts for my channel for some unexplained
          reason. I have tried for months to contact them, but I was only able to receive this automated response:
        </p>
        <div
          className='px-4 py-3 text-slate-400 bg-slate-800 rounded '
          style={{
            padding: '16px 12px',
            color: 'oklch(0.704 0.04 256.788)',
            backgroundColor: 'oklch(0.279 0.041 260.031)',
            borderRadius: '8px',
            marginBottom: '16px',
          }}
        >
          One or more transactions associated with your account were flagged as fraudulent. Specifically, your account
          was flagged as having received subscriptions from accounts abusing the Prime trial offer. We cannot reinstate
          this portion of the payout. Moreover, our fraud team is continuing to monitor your account for suspicious
          activity. If and when the team clears your account, you will continue receiving authorized revenue to which
          you are entitled.
        </div>
        <p>I&apos;ve given up on waiting for another update from them. Thus I&apos;m ending support for Twitch subs.</p>
        <p>
          You are seeing this because you linked your Twitch account with osu!Collector. If you have subscribed via
          Twitch recently, your subscription will still be in effect until the start of April.
        </p>
        <p>- FunOrange</p>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={onConfirm}>I understand, do not show again</Button>
        </div>
      </ModalBody>
    </Modal>
  )
}
