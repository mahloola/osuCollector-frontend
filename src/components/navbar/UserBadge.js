import PropTypes from 'prop-types'
import { useState } from 'react'
import { Button, Dropdown, Modal } from '../bootstrap-osu-collector'
import Image from 'react-bootstrap/Image'
import { LinkContainer } from 'react-router-bootstrap'
import './UserBadge.css'
import * as api from '../../utils/api'

const UserBadge = ({ className, user }) => {
  const [show, setShow] = useState(false)
  const [showChangeUserModal, setShowChangeUserModal] = useState(false)
  const [userId, setUserId] = useState('')
  const [username, setUsername] = useState('')

  return (
    <>
      <Dropdown className='d-flex align-items-center'>
        <div
          className={'user-badge ' + (user?.paidFeaturesAccess ? 'user-badge-supporter ' : '') + className}
          onClick={() => {
            setShow(!show)
          }}
        >
          <Image className='avatar-img' src={user.osuweb.avatar_url + '/50x50'} roundedCircle />
          <span className='noselect'>{user.osuweb.username}</span>
        </div>
        <div className={`dropdown-menu ${show ? 'show' : ''}`}>
          <LinkContainer to={`/users/${user.id}/uploads`}>
            <Dropdown.Item onClick={() => setShow(false)}>Uploads</Dropdown.Item>
          </LinkContainer>
          <LinkContainer to={`/users/${user.id}/favourites`}>
            <Dropdown.Item onClick={() => setShow(false)}>Favourites</Dropdown.Item>
          </LinkContainer>
          <LinkContainer to={`/subscription/status`}>
            <Dropdown.Item onClick={() => setShow(false)}>Subscription</Dropdown.Item>
          </LinkContainer>
          {user?.id === 2051389 && (
            <Dropdown.Item
              onClick={() => {
                setShow(false)
                setShowChangeUserModal(true)
              }}
            >
              Change User
            </Dropdown.Item>
          )}
          <Dropdown.Item
            onClick={async () => {
              setShow(false)
              await api.logout()
              window.location.reload()
            }}
          >
            Logout
          </Dropdown.Item>
        </div>
      </Dropdown>
      <Modal show={showChangeUserModal} onHide={() => setShowChangeUserModal(false)} centered={true}>
        <Modal.Body className='px-4 py-5'>
          <div className='d-flex justify-between gap-3'>
            <div>
              <h4>userId</h4>
              <input value={userId} onChange={(e) => setUserId(e.target.value)} />
            </div>
            <div>
              <h4>username</h4>
              <input value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={() => setShowChangeUserModal(false)}>
            Cancel
          </Button>
          <Button
            onClick={async () => {
              if (userId || username) {
                await api.changeUser({ userId: Number(userId), username })
              } else return
              setShowChangeUserModal(false)
              setShow(false)
              window.location.reload()
            }}
          >
            Okay
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

UserBadge.propTypes = {
  user: PropTypes.object,
}

export default UserBadge
