/* eslint-disable no-unused-vars */
import { Badge, Image } from '../bootstrap-osu-collector'
import { clamp, starToColor } from '../../utils/misc'

function DifficultyBadge({ className, stars }) {
  return (
    <Badge
      className={className}
      variant='default'
      style={{
        minWidth: '64px',
        backgroundColor: starToColor(stars),
      }}
    >
      <div className='d-flex justify-content-center align-items-center px-1' style={{ height: '16px' }}>
        {stars.toFixed(2)} ★
      </div>
    </Badge>
  )
}

export default DifficultyBadge
