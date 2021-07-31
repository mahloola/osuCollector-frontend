import { Form, Button } from 'react-bootstrap';
import { Redirect, Link } from 'react-router-dom';

function Login() {

    async function getToken(url = 'https://osu.ppy.sh/oauth/token', data) {
        // Default options are marked with *
        const response = await fetch(url, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: JSON.stringify(data) // body data type must match "Content-Type" header
        });
        return response.json(); // parses JSON response into native JavaScript objects
    }

    return (
        <>
            <a href='https://osu.ppy.sh/oauth/authorize?client_id=7512&response_type=code&redirect_uri=https%3A%2F%2Fmap-collector-314202.uc.r.appspot.com%2Fauthentication'>
                <Button type="submit" variant="outline-primary">Login</Button>
            </a>
        </>
    )
}

export default Login;