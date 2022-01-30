/* eslint-disable no-unused-vars */
import { Button } from '../bootstrap-osu-collector'
import { Heart, HeartFill } from 'react-bootstrap-icons'
import './FavouriteButton.css'
import { useContext } from 'react'
import { ThemeContext } from 'styled-components'

function FavouriteButton({ className, favourites, favourited, onClick }) {
  const theme = useContext(ThemeContext)

  const notFavouritedStyle = {
    color: 'white',
    background: theme.darkMode ? '#555' : '#AAB8C2',
  }
  const favouritedStyle = {
    color: 'white',
    background: '#FF66AB',
  }
  const currentStyle = favourited ? favouritedStyle : notFavouritedStyle

  return (
    <Button variant='default' className={'favourite-button ' + className} style={currentStyle} onClick={onClick}>
      {favourited ? <HeartFill className='mr-2' /> : <Heart className='mr-2' />}
      Favorite
      {favourites ? ` (${favourites})` : ''}
    </Button>
  )
}

export default FavouriteButton
