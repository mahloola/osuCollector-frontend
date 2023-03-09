/* eslint-disable no-unused-vars */
import { Card, Col, Container, Image, ProgressBar, Row } from '../bootstrap-osu-collector'
import { memo, useContext, useState } from 'react'
import { ThemeContext } from 'styled-components'
import { openInBrowser, truncate } from '../../utils/misc'
import { Accordion } from 'react-bootstrap'

const { ipcRenderer } = window.require('electron')

// https://i.imgur.com/kNyRH49.png
function DownloadFileCard({
  bytesReceived,
  bytesTotal,
  filename,
  downloadStatus,
  url,
  downloadLocation,
  errorMessage,
  id,
  collectionDownloadIndex,
}) {
  const [showError, setShowError] = useState(false)

  const theme = useContext(ThemeContext)

  const DownloadStates = Object.freeze({
    NotStarted: 'Starting download...',
    Downloading: 'Downloading...',
    Finished: 'Finished',
    Cancelled: 'Cancelled',
    Aborted: 'Aborted',
    Failed: 'Failed',
    AlreadyDownloaded: 'Already downloaded',
  })

  const megaBytesReceived = bytesReceived / 1000000
  const megaBytesTotal = bytesTotal / 1000000
  const progress = 100 * (bytesReceived / bytesTotal)

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
            <p className='mb-0' style={{ minHeight: '24px' }}>
              {filename || 'Loading...'}
            </p>
            {[DownloadStates.Downloading, DownloadStates.Finished].includes(downloadStatus) && (
              <>
                <div className='mb-0 text-secondary' style={{ fontSize: 13 }}>
                  {megaBytesReceived.toFixed(1)} MB of {megaBytesTotal.toFixed(1)} MB ({Math.round(progress) || 0}%){' '}
                  {downloadStatus === DownloadStates.Finished && progress !== 100 && ' (Cancelled)'}
                  {downloadStatus === DownloadStates.Downloading && (
                    <span
                      onClick={() => ipcRenderer.invoke('skip-current-download', collectionDownloadIndex)}
                      style={{ marginLeft: '12px', textDecoration: 'underline', cursor: 'pointer', color: '#0d6efd' }}
                    >
                      Skip
                    </span>
                  )}
                </div>
                <div style={{ marginTop: -6, marginBottom: 2 }}>
                  {downloadStatus === DownloadStates.Downloading && (
                    <a
                      className='mb-1'
                      style={{ fontSize: 10, height: '24px' }}
                      onClick={() => openInBrowser(url)}
                      href='#'
                      target='_blank'
                    >
                      {truncate(url, 100)}
                    </a>
                  )}
                  {downloadStatus === DownloadStates.Finished && (
                    <div className='mt-2 mb-1 text-secondary' style={{ fontSize: 10 }}>
                      {downloadLocation}
                    </div>
                  )}
                </div>
                <ProgressBar now={progress} />
              </>
            )}
            {downloadStatus === DownloadStates.AlreadyDownloaded && (
              <div>
                <div className='my-0 text-secondary' style={{ fontSize: 13 }}>
                  Already downloaded
                </div>
                <div className='text-secondary' style={{ fontSize: 10 }}>
                  {downloadLocation}
                </div>
              </div>
            )}
            {downloadStatus === DownloadStates.Failed && (
              <div className='my-0 text-secondary' style={{ fontSize: 13 }}>
                {downloadStatus}
                {errorMessage && (
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
                        <div style={{ whiteSpace: 'pre-line' }}>{errorMessage}</div>
                      </Accordion.Collapse>
                    </Accordion>
                  </>
                )}
                <div>
                  <a
                    onClick={() => openInBrowser(`https://osu.ppy.sh/beatmapsets/${id}`)}
                    className='mr-2'
                    style={{ cursor: 'pointer' }}
                  >
                    <small> {`https://osu.ppy.sh/beatmapsets/${id}`} </small>
                  </a>
                </div>
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </Card>
  )
}

export default memo(DownloadFileCard)
