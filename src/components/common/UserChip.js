import { Card } from 'components/bootstrap-osu-collector'
import { Image } from 'react-bootstrap'
import styled from 'styled-components'

function UserChip({ id, username }) {
  return (
    <S.UserChipContainer $lightbg className='shadow-sm py-1 pl-1 pr-3 mr-2 mb-2'>
      <div className='d-flex align-items-center'>
        <Image className='collection-card-uploader-avatar mr-2' src={`https://a.ppy.sh/${id}`} roundedCircle />
        <a href={`https://osu.ppy.sh/u/${id}`}>{username}</a>
      </div>
    </S.UserChipContainer>
  )
}

const S = {}
S.UserChipContainer = styled(Card)`
  border-radius: 10vh;
`

export default UserChip
