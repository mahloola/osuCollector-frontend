import { Container, Row, Col, Card } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap'
import './User.css'
import getUnicodeFlagIcon from 'country-flag-icons/unicode'

const User = ({ user }) => {
    const userFavouritesButton = (user) => {
        const disabled = !user.favourites || !user.favourites.length > 0
        return (
            <LinkContainer to={`/users/${user.id}/favourites`}>
                <Button
                    size='sm'
                    variant={disabled ? 'outline-secondary' : 'outline-danger'}
                    className='mx-1' {...{ disabled: disabled }}>
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
                    className='mx-1' {...{ disabled: disabled }}>
                    Uploads: {user.uploads ? user.uploads.length : 0}
                </Button>
            </LinkContainer>
        )
    }

    return (
        <div className='user-card'>
            <Card variant='Primary'>
                <img src={user.osuweb.cover.url} className="user-cover"></img>
                <img src={user.osuweb.avatar_url} className="user-avatar"></img>
                <Card.Body className="user-body">
                    <a href={`https://osu.ppy.sh/users/${user.id}`} className="user-username">{user.osuweb.username}</a>
                    <div className="user-rank">
                        <Container>
                            <Row className="user-ranks">
                                <Col className="user-rank-left">
                                    {user.osuweb.statistics.global_rank}
                                </Col>
                                <Col className="user-rank-right">
                                    {user.osuweb.statistics.country_rank}
                                </Col>
                            </Row>
                            <Row>
                                <Col className="user-rank-left">
                                    Global
                                </Col>
                                <Col className="user-rank-right">
                                    {getUnicodeFlagIcon(user.osuweb.country_code)}
                                </Col>
                            </Row>
                        </Container>
                    </div>
                </Card.Body>
                <Card.Subtitle className="user-links">
                    {userFavouritesButton(user)}{userUploadsButton(user)}
                </Card.Subtitle>
            </Card>
        </div>
    )
}

export default User
