/* eslint-disable no-unused-vars */
import { Button } from '../bootstrap-osu-collector'
import { Heart, HeartFill } from 'react-bootstrap-icons'
import './FavouriteButton.css'
import styled, { css } from 'styled-components'

function FavouriteButton({ className, favourites, favourited, onClick }) {
  return (
    <S.Button variant='default' className={'favourite-button ' + className} onClick={onClick} favourited={favourited}>
      {favourited ? <HeartFill className='mr-2' /> : <Heart className='mr-2' />}
      {favourited ? 'Favorited' : 'Favorite'}
      {favourites ? ` (${favourites})` : ''}
    </S.Button>
  )
}

const S = {
  Button: styled(Button)`
    ${({ favourited }) =>
      favourited
        ? css`
            color: white;
            background: #ff66ab;
            &:hover {
              color: white;
              background: #dd88ae;
            }
          `
        : css`
            color: white;
            background: ${({ theme }) => (theme.darkMode ? '#555' : '#AAB8C2')};
            &:hover {
              color: white;
              background: ${({ theme }) => (theme.darkMode ? '#8f5670' : '#e0b8c9')};
            }
          `};
  `,
}

export default FavouriteButton
