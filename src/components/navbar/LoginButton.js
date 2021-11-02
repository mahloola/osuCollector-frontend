import { Button } from '../bootstrap-osu-collector';
import config from '../../config/config'

function LoginButton() {
    const clientId = config.get('CLIENT_ID')
    const callback = encodeURIComponent(config.get('OAUTH_CALLBACK'))
    return (
        <a href={ `https://osu.ppy.sh/oauth/authorize?client_id=${clientId}&response_type=code&redirect_uri=${callback}` }>
            <Button className='ml-2' type="submit" variant="outline-primary">Login</Button>
        </a>
    )
}

export default LoginButton;