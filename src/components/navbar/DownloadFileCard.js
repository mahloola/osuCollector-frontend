/* eslint-disable no-unused-vars */
import { Card, Col, Container, Image, ProgressBar, Row } from '../bootstrap-osu-collector'
import { useContext, useState } from 'react'
import { ThemeContext } from 'styled-components'
import Truncate from 'react-truncate'
import { openInBrowser } from '../../utils/misc'
import { Accordion } from 'react-bootstrap'

// https://i.imgur.com/kNyRH49.png
function DownloadFileCard({ mapsetDownload }) {
  const [showError, setShowError] = useState(false)

  const theme = useContext(ThemeContext)

  const DownloadStates = Object.freeze({
    NotStarted: 'Starting download...',
    Downloading: 'Downloading...',
    Finished: 'Finished',
    Cancelled: 'Cancelled',
    Failed: 'Failed',
  })

  const megaBytesReceived = mapsetDownload.bytesReceived / 1000000
  const megaBytesTotal = mapsetDownload.bytesTotal / 1000000
  const progress = 100 * (mapsetDownload.bytesReceived / mapsetDownload.bytesTotal)

  return (
    <Card $lightbg2 className='my-1'>
      <Container>
        <Row className='align-items-center'>
          <Col xs='auto'>
            <Image
              className='mx-2'
              src='https://fileinfo.com/img/icons/files/128/osz-4290.png'
              style={{
                width: '32px',
                height: 'auto',
              }}
            />
          </Col>
          <Col
            className='py-2'
            style={{
              borderLeft: '2px solid ' + (theme.darkMode ? theme.primary30 : 'lightgray'),
            }}
          >
            <p className='mb-0'>{mapsetDownload.filename}</p>
            {mapsetDownload.downloadStatus === DownloadStates.Downloading ? (
              <>
                <p className='mb-0 text-secondary' style={{ fontSize: 13 }}>
                  {megaBytesReceived.toFixed(1)} MB of {megaBytesTotal.toFixed(1)} MB ({Math.round(progress) || 0}%)
                </p>
                <div style={{ marginTop: -6, marginBottom: 2 }}>
                  <Truncate lines={1} className='mb-1 text-secondary' style={{ fontSize: 10 }}>
                    {mapsetDownload.url}
                  </Truncate>
                </div>
                <ProgressBar animated now={progress} />
              </>
            ) : (
              mapsetDownload.downloadStatus === DownloadStates.Failed && (
                <p className='my-0 text-secondary' style={{ fontSize: 13 }}>
                  {mapsetDownload.downloadStatus}
                  {mapsetDownload.errorMessage && (
                    <>
                      <span>
                        {' '}
                        -{' '}
                        <u style={{ cursor: 'pointer' }}>
                          <a onClick={() => setShowError(!showError)}>See details</a>
                        </u>
                      </span>
                      <Accordion activeKey={showError ? '0' : null}>
                        <Accordion.Collapse eventKey='0'>
                          <div style={{ whiteSpace: 'pre-line' }}>{mapsetDownload.errorMessage}</div>
                        </Accordion.Collapse>
                      </Accordion>
                    </>
                  )}
                  <div>
                    <a
                      onClick={() => openInBrowser(`https://osu.ppy.sh/beatmapsets/${mapsetDownload.id}`)}
                      variant='outline-secondary'
                      className='mr-2'
                      size='sm'
                      style={{ cursor: 'pointer' }}
                    >
                      <small> {`https://osu.ppy.sh/beatmapsets/${mapsetDownload.id}`} </small>
                    </a>
                  </div>
                </p>
              )
            )}
          </Col>
        </Row>
      </Container>
    </Card>
  )
}

export default DownloadFileCard
