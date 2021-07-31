import { Form, Button } from 'react-bootstrap';
import { Redirect, Link } from 'react-router-dom';

function Login() {
    return (
        <>
            <a href='https://osu.ppy.sh/oauth/authorize?client_id=7512&response_type=code&redirect_uri=https%3A%2F%2Fmap-collector-314202.uc.r.appspot.com%2Fauthentication'>
                <Button type="submit" variant="outline-primary">Login</Button>
            </a>
        </>
    )
}

export default Login;