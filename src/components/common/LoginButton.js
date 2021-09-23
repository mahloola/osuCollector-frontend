import { Button } from 'react-bootstrap';
import './NavigationBar.css';
import config from '../../config/config'
import { LinkContainer } from 'react-router-bootstrap';

function LoginButton() {
    const clientId = config.get('CLIENT_ID')
    const callback = encodeURIComponent(config.get('OAUTH_CALLBACK'))
    return (
        <LinkContainer to={ `https://osu.ppy.sh/oauth/authorize?client_id=${clientId}&response_type=code&redirect_uri=${callback}` } >
            <Button type="submit" variant="outline-primary" className="navbar-button">Login</Button>
        </LinkContainer>
    )
}

export default LoginButton;