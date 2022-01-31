import { useState } from 'react'
import { Button, Card } from 'components/bootstrap-osu-collector'
import Truncate from 'react-truncate'
import styled from 'styled-components'
import { secondsToHHMMSS, useFallbackImg } from 'utils/misc'
import slimcoverfallback from '../common/slimcoverfallback.jpg'

/* eslint-disable no-unused-vars */
function MappoolBeatmap({ mod, modIndex, beatmap, className }) {
  const [hovered, setHovered] = useState(false)

  const beatmapset = beatmap?.beatmapset
  const dt = mod.toLowerCase() === 'dt'
  const hr = mod.toLowerCase() === 'hr'
  const diffUp = <span style={{ color: '#cd334f' }}>▲</span>
  const diffDown = <span style={{ color: '#6EFF79' }}>▼</span>
  return (
    <div className={className}>
      <Card $lightbg onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
        <div className='d-flex align-items-center p-2'>
          {/* content */}
          <img
            className='card-img-top'
            src={beatmapset?.covers.card || ''}
            onError={(ev) => useFallbackImg(ev, slimcoverfallback)}
            style={{ objectFit: 'cover', width: 160, height: 48, borderStyle: 'none' }}
          />
          <S.ModBadge mod={mod} className='mx-3'>
            <div className='d-flex align-items-center justify-content-center' style={{ height: 48 }}>
              <div className='text-center' style={{ marginTop: 1 }}>
                {mod + modIndex}
              </div>
            </div>
          </S.ModBadge>
          <div className='flex-fill'>
            {typeof beatmap === 'object' ? (
              <div>
                <Truncate lines={1}>{`${beatmapset.artist} - ${beatmapset.title} [${beatmap.version}]`}</Truncate>
                <div className='d-flex mt-1' style={{ fontSize: 14 }}>
                  <div className='mr-4'>
                    {secondsToHHMMSS(beatmap.hit_length / (dt ? 1.5 : 1))} {dt && diffDown}
                  </div>
                  {/* TODO: calculate difficulty */}
                  <div className='mr-4'>
                    {beatmap.difficulty_rating} ★ {(dt || hr) && diffUp}
                  </div>
                  <div className='mr-4'>
                    {Math.round(beatmap.bpm * (dt ? 1.5 : 1))} bpm {dt && diffUp}
                  </div>
                  <div className='mr-4'>
                    CS {beatmap.cs} {hr && diffUp}
                  </div>
                  <div className='mr-4'>
                    AR {beatmap.ar} {(dt || hr) && diffUp}
                  </div>
                  <div className='mr-4'>
                    OD {beatmap.accuracy} {(dt || hr) && diffUp}
                  </div>
                </div>
              </div>
            ) : (
              <span className='text-muted'>Beatmap being processed...</span>
            )}
          </div>
          <div className='flex' style={{ minWidth: 130 }}>
            {hovered && (
              <>
                <Button
                  href={beatmap.url || `https://osu.ppy.sh/b/${beatmap}`}
                  target='blank'
                  variant='outline-secondary'
                  className='ms-auto px-2 mr-1'
                  size='sm'
                >
                  <small> Website </small>
                </Button>
                <Button variant='outline-primary' className='mx-1 px-2' size='sm' href={`osu://b/${beatmap.id}`}>
                  <small> Direct </small>
                </Button>
              </>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}

const S = {}

S.ModBadge = styled(Card)`
  min-width: 60px;
  color: #fff;
  ${({ mod }) => {
    if (mod.toLowerCase() === 'nm') return 'background-color: #2191CD;'
    if (mod.toLowerCase() === 'hd') return 'background-color: #BDA542;'
    if (mod.toLowerCase() === 'hr') return 'background-color: #CD334F;'
    if (mod.toLowerCase() === 'dt') return 'background-color: #B44DC0;'
    if (mod.toLowerCase() === 'fm') return 'background-color: #888;'
    if (mod.toLowerCase() === 'tb') return 'background-color: #111;'
    return ''
  }}
`

// S.Length = styled.div`
//   ${(props) =>
//     props.dt &&
//     css`
//       color: #cd334f;
//       font-weight: 600;
//     `};
// `

// S.Star = styled.div`
//   ${(props) =>
//     (props.dt || props.hr) &&
//     css`
//       color: #cd334f;
//       font-weight: 600;
//     `};
// `

// S.Bpm = styled.div`
//   ${(props) =>
//     props.dt &&
//     css`
//       color: #cd334f;
//       font-weight: 600;
//     `};
// `

// S.CS = styled.div`
//   ${(props) =>
//     (props.dt || props.hr) &&
//     css`
//       color: #cd334f;
//       font-weight: 600;
//     `};
// `

// S.AR = styled.div`
//   ${(props) =>
//     (props.dt || props.hr) &&
//     css`
//       color: #cd334f;
//       font-weight: 600;
//     `};
// `

// S.OD = styled.div`
//   ${(props) =>
//     (props.dt || props.hr) &&
//     css`
//       color: #cd334f;
//       font-weight: 600;
//     `};
// `

export default MappoolBeatmap
