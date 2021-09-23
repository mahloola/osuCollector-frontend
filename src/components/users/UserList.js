import { Table } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import getUnicodeFlagIcon from 'country-flag-icons/unicode'
import {LinkContainer} from 'react-router-bootstrap'
import './UserList.css'

const UserList = ({ users }) => {

    const userFavouritesButton = (users) => {
        const disabled = !user.favourites || !user.favourites.length > 0
        return (
            users.map((user) => (
                <User key={user.id} collection={user}></User>
            ))
            <LinkContainer to={`/users/${user.id}/favourites`}>
                <Button
                    size='sm'
                    variant={disabled ? 'outline-secondary' : 'outline-danger'}
                    className='mx-1' {...{disabled: disabled}}>
                    Favourites: {user.favourites ? user.favourites.length : 0}
                </Button>
            </LinkContainer>
        )
    }
    const userUploadsButton = (user) => {
        const disabled = !user.uploads || !user.uploads.length > 0
        return (
            <LinkContainer to={`/users/${user.id}/uploads`}>
                <Button
                    size='sm'
                    variant={disabled ? 'outline-secondary' : 'outline-primary'}
                    className='mx-1' {...{disabled: disabled}}>
                    Uploads: {user.uploads ? user.uploads.length : 0}
                </Button>
            </LinkContainer>
        )
    }

    return (
        <Table bordered hover>
            <thead>
                <tr>
                    <th>Username</th>
                    <th>Global Rank</th>
                    <th>Country Rank</th>
                    <th>Collections</th>
                </tr>
            </thead>
            <tbody id='user-table'>
                {
                    users.map((user) => (
                        <tr key={user.id}>
                            <td><a href={`https://osu.ppy.sh/users/${user.id}`}>{user.osuweb.username}</a></td>
                            <td>#{user.osuweb.statistics.global_rank}</td>
                            <td>
                                {getUnicodeFlagIcon(user.osuweb.country_code)}
                                &nbsp;#{user.osuweb.statistics.country_rank}
                            </td>
                            <td>{userFavouritesButton(user)}{userUploadsButton(user)}</td>
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