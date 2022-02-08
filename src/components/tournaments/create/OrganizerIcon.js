import { useState } from 'react'
import styled from 'styled-components'
import { Image } from 'react-bootstrap'
import { XCircleFill } from 'react-bootstrap-icons'

function OrganizerIcon({ className, organizerId, onClick }) {
  const [hovered, setHovered] = useState(false)
  return (
    <S.Container
      onClick={onClick}
      className={className}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {hovered && <S.Overlay />}
      <S.Image key={organizerId} src={`https://a.ppy.sh/${organizerId}`} roundedCircle />
    </S.Container>
  )
}

const S = {}
S.Container = styled.div`
  margin-top: 1px;
  width: 34px;
`

S.Overlay = styled(XCircleFill)`
  color: #ff3333cc;
  position: absolute;
  z-index: 27;
  cursor: pointer;
  width: calc(34px + 2px);
  height: calc(34px + 2px);
  transform: translate(-1px, -1px);
`
S.Image = styled(Image)`
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  position: absolute;
  object-fit: cover;
  width: 34px;
  height: 34px;
  cursor: pointer;
`

export default OrganizerIcon
