import { Button } from 'react-bootstrap';
import config from '../../config/config'
import './common.css';

function Login() {
    const clientId = config.get('CLIENT_ID')
    const callback = encodeURIComponent(config.get('OAUTH_CALLBACK'))
    return (
        <a href={ `https://osu.ppy.sh/oauth/authorize?client_id=${clientId}&response_type=code&redirect_uri=${callback}` }>
            <Button type="submit" variant="outline-primary">Login</Button>
        </a>
    )
}

export default Login;