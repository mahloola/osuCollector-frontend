import { useEffect, useRef } from 'react'
import {
  Badge,
  Button,
  Card,
  CardFooter,
  Col,
  Container,
  Image,
  ListGroup,
  ListGroupItem,
  Row,
} from '../bootstrap-osu-collector'
import { PlayFill, StopFill } from 'react-bootstrap-icons'
import { bpmToColor, openInBrowser, secondsToHHMMSS, useFallbackImg } from '../../utils/misc'
import './MapsetCard.css'
import slimcoverfallback from '../common/slimcoverfallback.jpg'
import DifficultyBadge from '../common/DifficultyBadge'
import Truncate from 'react-truncate'
import osuPng from '../common/mode-osu.png'
import taikoPng from '../common/mode-taiko.png'
import maniaPng from '../common/mode-mania.png'
import catchPng from '../common/mode-catch.png'
import { useMediaQuery } from 'react-responsive'

const compactThreshold = 991
const Compact = ({ children }) => (useMediaQuery({ maxWidth: compactThreshold }) ? children : null)
const Full = ({ children }) => (useMediaQuery({ minWidth: compactThreshold + 1 }) ? children : null)

function MapsetCard({ beatmapset, beatmaps, className, playing, onPlayClick, onAudioEnd }) {
  const modeToPng = (mode) => {
    return {
      osu: osuPng,
      taiko: taikoPng,
      mania: maniaPng,
      fruits: catchPng,
    }[mode]
  }

  const audioRef = useRef(null)

  useEffect(() => {
    const audio = new Audio(`https://b.ppy.sh/preview/${beatmapset.id}.mp3`)
    audio.volume = 0.2
    audio.addEventListener('ended', onAudioEnd)
    audioRef.current = audio

    return () => {
      if (audioRef.current && !audioRef.current.paused) {
        audioRef.current.pause()
      }
    }
  }, [])

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
      <Compact>
        {/* beatmapset */}
        <Card className='mr-2 mb-5' style={{}}>
          <img
            className='card-img-top'
            src={beatmapset.covers.card}
            onError={(ev) => useFallbackImg(ev, slimcoverfallback)}
            style={{ objectFit: 'cover', width: '100%', height: 64 }}
          />
          <Card.ImgOverlay className='py-2 pl-3 pr-1'>
            <div className='d-flex justify-content-between'>
              <div style={{ width: '100%' }}>
                <Card.Title className='my-0 img-overlay-text'>
                  <Truncate lines={1}>{beatmapset.title}</Truncate>
                </Card.Title>
                <Card.Text className='img-overlay-text'>
                  <Truncate lines={1}>{beatmapset.artist}</Truncate>
                </Card.Text>
              </div>
              <div className='align-self-center'>
                <button className='media-play-button p-0' onClick={onPlayClick}>
                  {playing ? (
                    <StopFill className='svg-shadow' size={40} />
                  ) : (
                    <PlayFill className='svg-shadow' size={40} />
                  )}
                </button>
              </div>
            </div>
          </Card.ImgOverlay>
          <CardFooter $lightbg className='p-1 text-center'>
            <small>Mapped by {beatmapset.creator}</small>
          </CardFooter>
          {/* diffs */}
          <ListGroup variant='flush'>
            {beatmaps.map((beatmap) => (
              <ListGroupItem $lightbg key={beatmap.id} className='px-2'>
                <div className='d-flex align-items-center p-0'>
                  <Badge
                    className='mr-1'
                    variant='secondary'
                    style={{
                      minWidth: '50px',
                      height: '24px',
                      paddingTop: '6px',
                    }}
                  >
                    {secondsToHHMMSS(beatmap.hit_length)}
                  </Badge>
                  <Badge
                    className='mr-1'
                    variant='primary'
                    style={{
                      backgroundColor: bpmToColor(beatmap.bpm),
                      minWidth: '70px',
                      height: '24px',
                      paddingTop: '6px',
                    }}
                  >
                    {Math.floor(beatmap.bpm)} bpm
                  </Badge>
                  <DifficultyBadge className='mr-3' stars={beatmap.difficulty_rating} />
                  {beatmap.mode !== 'osu' && (
                    <Image
                      src={modeToPng(beatmap.mode)}
                      size={20}
                      style={{
                        imageRendering: 'auto',
                        width: '18px',
                        height: 'auto',
                      }}
                      className='mr-2'
                    />
                  )}
                  <div className='w-100 mr-2'>
                    <Truncate lines={1} className='font-weight-bold'>
                      {beatmap.version}
                    </Truncate>
                  </div>
                  <Button
                    onClick={() => openInBrowser(beatmap.url)}
                    variant='outline-secondary'
                    className='ms-auto px-2 py-0 mr-1'
                    size='sm'
                  >
                    <small> Website </small>
                  </Button>
                  <Button variant='outline-primary' className='mx-1 px-2 py-0' size='sm' href={`osu://b/${beatmap.id}`}>
                    <small> Direct </small>
                  </Button>
                </div>
              </ListGroupItem>
            ))}
          </ListGroup>
        </Card>
      </Compact>
      <Full>
        <div className='d-flex '>
          {/* beatmapset */}
          <Card className='mr-2' style={{ width: '470px' }}>
            <img
              className='card-img-top'
              src={beatmapset.covers.card}
              onError={(ev) => useFallbackImg(ev, slimcoverfallback)}
              style={{ objectFit: 'cover', width: '100%', height: 64 }}
            />
            <Card.ImgOverlay className='py-2 pl-3 pr-1'>
              <div className='d-flex justify-content-between'>
                <div style={{ width: '100%' }}>
                  <Card.Title className='my-0 img-overlay-text'>
                    <Truncate lines={1}>{beatmapset.title}</Truncate>
                  </Card.Title>
                  <Card.Text className='img-overlay-text'>
                    <Truncate lines={1}>{beatmapset.artist}</Truncate>
                  </Card.Text>
                </div>
                <div className='align-self-center'>
                  <button className='media-play-button p-0' onClick={onPlayClick}>
                    {playing ? (
                      <StopFill className='svg-shadow' size={40} />
                    ) : (
                      <PlayFill className='svg-shadow' size={40} />
                    )}
                  </button>
                </div>
              </div>
            </Card.ImgOverlay>
            <CardFooter $lightbg className='p-1 text-center'>
              <small>Mapped by {beatmapset.creator}</small>
            </CardFooter>
          </Card>
          {/* diffs */}
          <Container className='p-0'>
            {' '}
            <Row>
              {' '}
              <Col>
                <Card>
                  <ListGroup variant='flush'>
                    {beatmaps.map((beatmap) => (
                      <ListGroupItem $lightbg key={beatmap.id} className='px-2'>
                        <div className='d-flex align-items-center p-0'>
                          <Badge
                            className='mr-1'
                            variant='secondary'
                            style={{
                              minWidth: '50px',
                              height: '24px',
                              paddingTop: '6px',
                            }}
                          >
                            {secondsToHHMMSS(beatmap.hit_length)}
                          </Badge>
                          <Badge
                            className='mr-1'
                            variant='primary'
                            style={{
                              backgroundColor: bpmToColor(beatmap.bpm),
                              minWidth: '70px',
                              height: '24px',
                              paddingTop: '6px',
                            }}
                          >
                            {Math.floor(beatmap.bpm)} bpm
                          </Badge>
                          <DifficultyBadge className='mr-3' stars={beatmap.difficulty_rating} />
                          {beatmap.mode !== 'osu' && (
                            <Image
                              src={modeToPng(beatmap.mode)}
                              size={20}
                              style={{
                                imageRendering: 'auto',
                                width: '18px',
                                height: 'auto',
                              }}
                              className='mr-2'
                            />
                          )}
                          <b className='mr-2'>{beatmap.version}</b>
                          <Button
                            onClick={() => openInBrowser(beatmap.url)}
                            variant='outline-secondary'
                            className='ms-auto px-2 py-0 mr-1'
                            size='sm'
                          >
                            <small> Website </small>
                          </Button>
                          <Button
                            variant='outline-primary'
                            className='mx-1 px-2 py-0'
                            size='sm'
                            href={`osu://b/${beatmap.id}`}
                          >
                            <small> Direct </small>
                          </Button>
                        </div>
                      </ListGroupItem>
                    ))}
                  </ListGroup>
                </Card>
              </Col>{' '}
            </Row>{' '}
          </Container>
        </div>
      </Full>
    </div>
  )
}

export default MapsetCard
