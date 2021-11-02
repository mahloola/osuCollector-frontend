import PropTypes from 'prop-types'
import { Container, Image } from '../bootstrap-osu-collector'

function TwitchSuccess({ user }) {
    const twitchAva = user?.private?.linkedTwitchAccount.profilePictureUrl
    const twitchName = user?.private?.linkedTwitchAccount.displayName
    return (
        <Container className='pt-5'>
            <div className='text-center pt-5'>
                <h1>Success!</h1>
                <h2>Your Twitch account has been linked.</h2>
                <Image className='mt-5 mb-4 shadow' roundedCircle src={twitchAva} style={{width: '128px', height: 'auto'}}/>
                <h2>{twitchName}</h2>
            </div>
        </Container>
    )
}

TwitchSuccess.propTypes = {
    user: PropTypes.object
}

export default TwitchSuccess
