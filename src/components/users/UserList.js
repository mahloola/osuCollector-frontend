import { Container, Row } from 'react-bootstrap';
import PropTypes from 'prop-types';
import User from './User';
import './UserList.css'

const UserList = ({ users }) => {

    return (
        <Container>
            <Row>
                {
                    users.map((user) => (
                        <User key={user.id} user={user}></User>
                    ))
                }
            </Row>
        </Container>
    )
}

UserList.propTypes = {
    users: PropTypes.arrayOf(PropTypes.object)
}

export default UserList;