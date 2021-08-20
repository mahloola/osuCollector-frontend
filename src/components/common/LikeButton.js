import PropTypes from 'prop-types'
import './LikeButton.css'

function LikeButton({ liked, onClick }) {
    return (
        <div
            className={'heart' + (liked ? ' is-active' : '')}
            onClick={onClick}/>
    )
}

LikeButton.propTypes = {
    liked: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired
}

export default LikeButton
