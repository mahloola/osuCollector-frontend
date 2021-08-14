import { useHistory } from 'react-router';
import { Table } from 'react-bootstrap';
import PropTypes from 'prop-types';

const UserList = ({ users }) => {
    const history = useHistory();
    console.log(users)

    return (
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>Username</th>
                    <th>Global Rank</th>
                    <th>Country Rank</th>
                    <th>Favourites</th>
                    <th>Uploads</th>
                </tr>
            </thead>
            <tbody>
                {
                    users.map((user) => (
                        // TODO: this would link to a dedicated user page
                        <tr key={user.id} onClick={() => {
                            history.push(`/all?search=${encodeURIComponent(user.osuweb.username)}`);
                            window.location.reload()
                            }}>
                            <td>{user.osuweb.username}</td>
                            <td>#{user.osuweb.statistics.global_rank}</td>
                            <td>{`${user.osuweb.country_code}: #${user.osuweb.statistics.country_rank}`}</td>
                            <td>{user.favourites ? user.favourites.length : 0}</td>
                            <td>{user.uploads ? user.uploads.length : 0}</td>
                        </tr>
                    ))
                }
            </tbody>
        </Table>
    )
}

UserList.propTypes = {
    users: PropTypes.arrayOf(PropTypes.object)
}

export default UserList;