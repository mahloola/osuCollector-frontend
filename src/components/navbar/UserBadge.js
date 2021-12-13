import PropTypes from 'prop-types';
import { useState } from 'react';
import { Dropdown } from '../bootstrap-osu-collector';
import Image from 'react-bootstrap/Image';
import { LinkContainer } from 'react-router-bootstrap';
import './UserBadge.css';

const UserBadge = ({ className, user }) => {
    const [show, setShow] = useState(false)

    return (
        <Dropdown className='d-flex align-items-center'>
            <div className={'user-badge ' + (user?.paidFeaturesAccess ? 'user-badge-supporter ' : '') + className} onClick={() => {
                setShow(!show)
            }}>
                <Image className='avatar-img' src={user.osuweb.avatar_url + '/50x50'} roundedCircle />
                <span className='noselect'>{user.osuweb.username}</span>
            </div>
            <div className={`dropdown-menu ${show ? 'show' : ''}`}>
                <LinkContainer to={`/users/${user.id}/uploads`}>
                    <Dropdown.Item onClick={() => setShow(false)}>
                        Uploads
                    </Dropdown.Item>
                </LinkContainer>
                <LinkContainer to={`/users/${user.id}/favourites`}>
                    <Dropdown.Item onClick={() => setShow(false)}>
                        Favourites
                    </Dropdown.Item>
                </LinkContainer>
            </div>
        </Dropdown>
    )
}

UserBadge.propTypes = {
    user: PropTypes.object,
}

export default UserBadge;
