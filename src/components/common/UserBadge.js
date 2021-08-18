import PropTypes from 'prop-types';
import Image from 'react-bootstrap/Image';

const UserBadge = ({ user }) => {
    return (
        <a className="user-badge" href='/'>
            <Image className="avatar-img" src={user.avatar_url + "/50x50"} roundedCircle />
            <span>{user.username}</span>
        </a>
    )
}

UserBadge.propTypes = {
    user: PropTypes.object,
}

export default UserBadge;
