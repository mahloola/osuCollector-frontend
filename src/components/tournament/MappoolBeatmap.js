/* eslint-disable no-unused-vars */
import { useContext, useEffect, useRef, useState } from 'react'
import { Button, Card } from 'components/bootstrap-osu-collector'
import styled, { css, ThemeContext } from 'styled-components'
import { secondsToHHMMSS, starToColor } from 'utils/misc'
import { PlayFill, StopFill } from 'react-bootstrap-icons'
import { Breakpoints } from 'utils/misc'

/* eslint-disable no-unused-vars */
function MappoolBeatmap({ beatmap, mod, modIndex, playing, onPlayClick, onAudioEnd, className }) {
  const theme = useContext(ThemeContext)
  const [hovered, setHovered] = useState(false)

  const beatmapset = beatmap?.beatmapset
  const beatmapName = `${beatmapset?.artist} - ${beatmapset?.title}`
  const beatmapDiff = `[${beatmap?.version}]`
  const dt = mod.toLowerCase() === 'dt'
  const hr = mod.toLowerCase() === 'hr'
  const diffUp = <span style={{ color: '#cd334f' }}>▲</span>
  const diffDown = <span style={{ color: '#43D64E' }}>▼</span>
  const starColorAlpha = theme.darkMode ? '90' : '60'

  const audioRef = useRef(null)

  useEffect(() => {
    return () => {
      if (audioRef.current && !audioRef.current.paused) {
        audioRef.current.pause()
      }
    }
  }, [])

  useEffect(() => {
    if (!beatmap || audioRef.current !== null) {
      return
    }
    const audio = new Audio(`https://b.ppy.sh/preview/${beatmapset?.id}.mp3`)
    audio.volume = 0.2
    audio.addEventListener('ended', onAudioEnd)
    audioRef.current = audio
  }, [beatmap])

  useEffect(() => {
    if (!audioRef.current) return
    if (playing) {
      audioRef.current.play()
    } else {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
  }, [playing])

  return (
    <div className={className}>
      <Card $lightbg onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
        <div className='d-flex align-items-center'>
          {/* content */}
          <S.BeatmapCover className='card-img-top' src={beatmapset?.covers.card || ''} onClick={onPlayClick}>
            <div className='d-flex justify-content-center align-items-center'>
              {playing ? (
                <StopFill style={{ color: 'white' }} className='svg-shadow' size={66} />
              ) : (
                <PlayFill style={{ color: 'white' }} className='svg-shadow' size={66} />
              )}
            </div>
          </S.BeatmapCover>
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
                  {beatmapName} <b>{beatmapDiff}</b>
                </S.Truncate>
                <div className='d-flex mt-1' style={{ fontSize: 14 }}>
                  <div className='mr-3 text-muted'>
                    {dt ? (
                      <b>{secondsToHHMMSS(beatmap.hit_length / (dt ? 1.5 : 1))}</b>
                    ) : (
                      secondsToHHMMSS(beatmap.hit_length / (dt ? 1.5 : 1))
                    )}
                  </div>
                  <Breakpoints.XLUp>
                    <div className='mr-3'>
                      <S.BackgroundSpan color={starToColor(beatmap.difficulty_rating) + starColorAlpha}>
                        {dt || hr ? <b>&gt;{beatmap.difficulty_rating} ★</b> : beatmap.difficulty_rating + ' ★'}
                      </S.BackgroundSpan>
                    </div>
                    <div className='mr-4'>{dt ? <b>{beatmap.bpm} bpm</b> : beatmap.bpm + ' bpm'}</div>
                    <div className='mr-4'>
                      <S.BackgroundSpan color={'#4fc0ff2a'}>
                        {hr ? <b>CS {beatmap.cs}</b> : 'CS ' + beatmap.cs}
                      </S.BackgroundSpan>
                    </div>
                    <div className='mr-4'>
                      <S.BackgroundSpan color={'#ff4e6f2a'}>
                        {dt || hr ? <b>AR {beatmap.ar}</b> : 'AR ' + beatmap.ar}
                      </S.BackgroundSpan>
                    </div>
                    <div className='mr-4'>
                      <S.BackgroundSpan color={'#6eff792a'}>
                        {dt || hr ? <b>OD {beatmap.accuracy}</b> : 'AR ' + beatmap.accuracy}
                      </S.BackgroundSpan>{' '}
                    </div>
                  </Breakpoints.XLUp>
                  <Breakpoints.LG>
                    <div className='mr-2'>
                      <S.BackgroundSpan color={starToColor(beatmap.difficulty_rating) + starColorAlpha}>
                        {dt || hr ? <b>&gt;{beatmap.difficulty_rating} ★</b> : beatmap.difficulty_rating + ' ★'}
                      </S.BackgroundSpan>
                    </div>
                    <div className='mr-2'>{dt ? <b>{beatmap.bpm} bpm</b> : beatmap.bpm + ' bpm'}</div>
                    <div className='mr-2'>
                      <S.BackgroundSpan color={'#4fc0ff2a'}>
                        {hr ? <b>CS {beatmap.cs}</b> : 'CS ' + beatmap.cs}
                      </S.BackgroundSpan>
                    </div>
                    <div className='mr-2'>
                      <S.BackgroundSpan color={'#ff4e6f2a'}>
                        {dt || hr ? <b>AR {beatmap.ar}</b> : 'AR ' + beatmap.ar}
                      </S.BackgroundSpan>
                    </div>
                    <div className='mr-2'>
                      <S.BackgroundSpan color={'#6eff792a'}>
                        {dt || hr ? <b>OD {beatmap.accuracy}</b> : 'AR ' + beatmap.accuracy}
                      </S.BackgroundSpan>{' '}
                    </div>
                  </Breakpoints.LG>
                  <Breakpoints.MD>
                    <div className='mr-2'>
                      <S.BackgroundSpan color={starToColor(beatmap.difficulty_rating) + starColorAlpha}>
                        {dt || hr ? <b>&gt;{beatmap.difficulty_rating} ★</b> : beatmap.difficulty_rating + ' ★'}
                      </S.BackgroundSpan>
                    </div>
                    <div className='mr-2'>{dt ? <b>{beatmap.bpm} bpm</b> : beatmap.bpm + ' bpm'}</div>
                  </Breakpoints.MD>
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

S.BeatmapCover = styled.div`
  background-color: #474958;
  background-image: url(${(props) => props.src});
  width: 180px;
  height: 66px;
  background-size: cover;
  cursor: pointer;
  & > div > svg {
    display: none;
  }
  &:hover {
    & > div > svg {
      display: block;
    }
  }
`

S.ModBadge = styled(Card)`
  min-width: 60px;
  color: #fff;
  ${({ mod }) => {
    if (mod.toLowerCase() === 'nm') return 'background-color: #2191CD;'
    if (mod.toLowerCase() === 'hd') return 'background-color: #BDA542;'
    if (mod.toLowerCase() === 'hr') return 'background-color: #CD334F;'
    if (mod.toLowerCase() === 'dt') return 'background-color: #B44DC0;'
    if (mod.toLowerCase() === 'ez') return 'background-color: #4dc04f;'
    if (mod.toLowerCase() === 'fl')
      return 'background: radial-gradient(circle, rgba(85,85,85,1) 0%, rgba(0,0,0,1) 70%);'
    if (mod.toLowerCase() === 'fm') return 'background-color: #888;'
    if (mod.toLowerCase() === 'tb') return 'background-color: #111;'
    return 'background-color: #111;'
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
    max-width: ${({ hovered }) => (hovered ? '448px' : '588px')};
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

S.BackgroundSpan = styled.span`
  background: ${({ color }) => color};
  border-radius: 999px;
  padding: 0px 8px 0px 8px;
  display: inline-block;
  text-align: center;
  margin-right: 6px;
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
