import PropTypes from 'prop-types';
import Image from 'react-bootstrap/Image';

const UserBadge = ({ user }) => {
    return (
        <div className="user-badge" >
            <a href='/'>
                <Image className="avatar-img" src={user.avatar_url + "/50x50"} roundedCircle />
                <span>{user.username}</span>
            </a>
        </div>
    )
}

UserBadge.propTypes = {
    user: PropTypes.object,
}

export default UserBadge;
