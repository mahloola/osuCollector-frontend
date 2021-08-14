import { Button } from 'react-bootstrap';
import config from '../../config/config'
import Image from 'react-bootstrap/Image';
import './common.css';

function Login({ user }) {
    const clientId = config.get('CLIENT_ID')
    const callback = encodeURIComponent(config.get('OAUTH_CALLBACK'))
    console.log('user', user);  
    if(user === null) {
        return (
            <a href={ `https://osu.ppy.sh/oauth/authorize?client_id=${clientId}&response_type=code&redirect_uri=${callback}` }>
                <Button type="submit" variant="outline-primary">Login</Button>
            </a>
        )
    } else {
        return (
            <a className="user-badge" href='/'>
                <Image className="avatar-img" src={ user.avatar_url + "/50x50"} roundedCircle />
                <span>{user.username}</span>
            </a>
        )
    }
}

export default Login;