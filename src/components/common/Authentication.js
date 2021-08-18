import Login from './Login';
import UserBadge from './UserBadge';
import PropTypes from 'prop-types';

const Authentication = ({ user }) => {
    if(user === null) {
        return <Login/>
    } else {
        return <UserBadge user={user}/>
    }
    // do something like the following
   // return isAuthenticated ? <Logout /> : <Login />;
}

Authentication.propTypes = {
    user: PropTypes.object,
}

export default Authentication;
