import { Form, FormControl, Button, InputGroup } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useState } from 'react';
import UserBadge from './UserBadge';
import LoginButton from './LoginButton';
import UploadModal from './UploadModal';
import { CloudUpload } from 'react-bootstrap-icons';
import './common.css';
// import config from '../../config/config'

import './NavigationBar.css';
function NavigationBar({ user }) {

    const [uploadModalIsOpen, setUploadModalIsOpen] = useState(false);
    const [searchBarInput, setSearchBarInput] = useState('');
    const history = useHistory()

    const searchSubmit = (event) => {
        event.preventDefault();
        history.push(`/all?search=${encodeURIComponent(searchBarInput)}`);
        window.location.reload()
        return false;
    }


    // debug login
    // const [userId, setUserId] = useState(2051389);
    // function userIdChanged(e) {
    //     setUserId(e.target.value)
    // }
    // function debugLogin() {
    //     fetch(`${config.get('API_HOST')}/api/users/${userId}/debugLogin`, {
    //         method: 'POST'
    //     }).then((res) => {
    //         if (res.status === 200) {
    //             alert(`Logged in as user id ${userId}`)
    //         } else {
    //             alert(`${res.status}: ${res.statusText}`)
    //         }
    //     })
    // }

    return (
        <div id="navbar">
            <a id="logo" href="/">
                osu!<span id="collector">Collector</span>
            </a>
            <ul className="navbar-list">
                <li className="navbar-item"><a href='/recent'>Recent</a></li>
                <li className="navbar-item"><a href='/popular'>Popular</a></li>
                <li className="navbar-item"><a href='/users'>Users</a></li>
            </ul>

            <Form onSubmit={searchSubmit} className='mx-4 px-3 w-25 searchbar'>
                <InputGroup>
                    <FormControl
                        onChange={(e) => setSearchBarInput(e.target.value)}
                        type='search'
                        style={{ borderTopLeftRadius: 10, borderBottomLeftRadius: 10 }}
                        placeholder='tech, sotarks, camellia' />
                    <Button
                        type='submit'
                        className={searchBarInput.trim() === '' ? 'searchBtn' : 'searchBtnEnabled'}
                        {...{ disabled: searchBarInput.trim() === '' }}>
                        Search
                    </Button>
                </InputGroup>
            </Form>

            <div id="navbarRightSide">
                <Button
                    className="mx-3 navbar-button"
                    onClick={() => {
                        if (user)
                            setUploadModalIsOpen(true)
                        else
                            alert('Please log in!')
                    }}>
                    <CloudUpload className="mr-2" />Upload
                </Button>

                {user ? <UserBadge user={user} /> : user === null ? <LoginButton /> : null}
            </div>

            <UploadModal uploadModalIsOpen={uploadModalIsOpen} setUploadModalIsOpen={setUploadModalIsOpen} />
        </div>
    )
}

// NavigationBar.propTypes = {
//     searchText: PropTypes.string,
//     setSearchText: PropTypes.func.isRequired
// }
NavigationBar.propTypes = {
    user: PropTypes.object,
}

export default NavigationBar;