import { useState } from 'react'
import { Button, Card } from 'components/bootstrap-osu-collector'
import styled from 'styled-components'
import { secondsToHHMMSS, useFallbackImg } from 'utils/misc'
import slimcoverfallback from '../common/slimcoverfallback.jpg'

/* eslint-disable no-unused-vars */
function MappoolBeatmap({ mod, modIndex, beatmap, className }) {
  const [hovered, setHovered] = useState(false)

  const beatmapset = beatmap?.beatmapset
  const beatmapString = `${beatmapset?.artist} - ${beatmapset?.title} [${beatmap?.version}]`
  const dt = mod.toLowerCase() === 'dt'
  const hr = mod.toLowerCase() === 'hr'
  const diffUp = <span style={{ color: '#cd334f' }}>▲</span>
  const diffDown = <span style={{ color: '#43D64E' }}>▼</span>
  return (
    <div className={className}>
      <Card $lightbg onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
        <div className='d-flex align-items-center'>
          {/* content */}
          <img
            className='card-img-top'
            src={beatmapset?.covers.card || ''}
            onError={(ev) => useFallbackImg(ev, slimcoverfallback)}
            style={{ objectFit: 'cover', width: 180, height: 66, borderStyle: 'none' }}
          />
          <S.ModBadge mod={mod} className='mx-3'>
            <div className='d-flex align-items-center justify-content-center' style={{ height: 48 }}>
              <div className='text-center' style={{ marginTop: 1 }}>
                {mod + modIndex}
              </div>
            </div>
          </S.ModBadge>
          <div className='flex-fill' style={{ minWidth: 0 }}>
            {typeof beatmap === 'object' ? (
              <>
                <S.Truncate hovered={hovered}>
                  <b>{beatmapString}</b>
                </S.Truncate>
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
              </>
            ) : (
              <span className='text-muted'>Beatmap being processed...</span>
            )}
          </div>
          {hovered && (
            <div className='d-flex pr-2'>
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
            </div>
          )}
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

S.Truncate = styled.div`
  /* background-color: #6eff79; */
  @media screen and (min-width: 576px) {
    /* background-color: #4fc0ff; */
  }
  @media screen and (min-width: 768px) {
    /* background-color: #f8da5e; */
  }
  @media screen and (min-width: 992px) {
    max-width: ${({ hovered }) => (hovered ? '328px' : '468px')};
    /* background-color: #ff7f68; */
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  @media screen and (min-width: 1200px) {
    max-width: ${({ hovered }) => (hovered ? '485px' : '625px')};
    /* background-color: #ff4e6f; */
  }
  @media screen and (min-width: 1400px) {
    max-width: ${({ hovered }) => (hovered ? '667px' : '807px')};
    /* background-color: #a653b0; */
  }
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
