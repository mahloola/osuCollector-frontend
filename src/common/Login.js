import { Form, Button } from 'react-bootstrap';
import { Redirect, Link } from 'react-router-dom';
import config from '../config.json'

function Login() {
    const callback = encodeURIComponent(config.OAUTH_CALLBACK)
    return (
        <>
            <a href={ `https://osu.ppy.sh/oauth/authorize?client_id=7512&response_type=code&redirect_uri=${callback}` }>
                <Button type="submit" variant="outline-primary">Login</Button>
            </a>
        </>
    )
}

export default Login;