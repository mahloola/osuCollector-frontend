import { Button, Card, Col, Container, Row, ModalHeader, ModalBody } from '../bootstrap-osu-collector'
import Modal from 'react-bootstrap/Modal'
import DownloadFileCard from './DownloadFileCard'
import { useEffect, useState } from 'react'

const { ipcRenderer } = window.require('electron')

function DownloadsModal({
  preferences,
  collectionDownloads,
  downloadsModalIsOpen,
  setDownloadsModalIsOpen,
  showDownloadTroubleshootText,
  setShowDownloadTroubleshootText,
}) {
  const DownloadStates = Object.freeze({
    NotStarted: 'Starting download...',
    Downloading: 'Downloading...',
    Finished: 'Finished',
    Cancelled: 'Cancelled',
    Failed: 'Failed',
  })

  const [showAll, setShowAll] = useState(false)
  useEffect(() => setShowAll(false), [downloadsModalIsOpen])

  // https://i.imgur.com/optYWti.png
  const collections = collectionDownloads?.map((collectionDownload, index) => {
    const totalBeatmapsets = collectionDownload.beatmapsets?.length
    const finishedDownloads = collectionDownload.beatmapsets?.filter(
      (mapset) => mapset.downloadStatus === DownloadStates.Finished
    ).length
    const displayableDownloads = collectionDownload.beatmapsets
      ?.filter(
        (mapset) =>
          mapset.downloadStatus !== DownloadStates.NotStarted && mapset.downloadStatus !== DownloadStates.Cancelled
      )
      ?.reverse()
    const visibleDownloads = displayableDownloads?.slice(0, showAll ? 999999 : 15)
    const notShownCount = Math.max(0, displayableDownloads?.length - visibleDownloads?.length)
    const statusText =
      collectionDownload.downloadStatus === DownloadStates.NotStarted
        ? 'Pending...'
        : collectionDownload.downloadStatus === DownloadStates.Downloading
        ? `Downloading: ${displayableDownloads.length} of ${totalBeatmapsets}`
        : collectionDownload.downloadStatus === DownloadStates.Finished
        ? `Downloaded ${finishedDownloads} of ${totalBeatmapsets}`
        : collectionDownload.downloadStatus === DownloadStates.Cancelled
        ? `Downloaded ${finishedDownloads} of ${totalBeatmapsets}`
        : ''
    const inProgress =
      collectionDownload.downloadStatus !== DownloadStates.Finished &&
      collectionDownload.downloadStatus !== DownloadStates.Cancelled
    const cancelDownload = () => ipcRenderer.invoke('cancel-download', index)
    const clearDownload = () => {
      setShowDownloadTroubleshootText(false)
      ipcRenderer.invoke('clear-download', index)
    }

    return (
      <Card $lightbg key={index} className='shadow-sm py-2 px-3 mx-2 my-4'>
        <Container className='mb-1'>
          <Row className='align-items-center'>
            <Col className='px-0'>
              <h5 className='mb-0'>
                {collectionDownload.uploader && collectionDownload.uploader + ' - '}
                {collectionDownload.name}
              </h5>
            </Col>
            <Col xs='auto' className='text-right'>
              {statusText}
            </Col>
            <Col xs='auto' className='pr-0'>
              <Button
                onClick={inProgress ? cancelDownload : clearDownload}
                className='align-middle'
                variant={inProgress ? 'danger' : 'outline-secondary'}
                size='sm'
              >
                {inProgress ? 'Stop all' : 'Clear'}
              </Button>
            </Col>
          </Row>
        </Container>
        {visibleDownloads?.map((mapset) => {
          const { bytesReceived, bytesTotal, filename, downloadStatus, url, downloadLocation, errorMessage, id } =
            mapset ?? {}
          return (
            <DownloadFileCard
              key={mapset.id}
              bytesReceived={bytesReceived}
              bytesTotal={bytesTotal}
              filename={filename}
              downloadStatus={downloadStatus}
              url={url}
              downloadLocation={downloadLocation}
              errorMessage={errorMessage}
              id={id}
            />
          )
        })}
        {notShownCount > 0 && (
          <Button variant='secondary' className='my-1 py-2' onClick={() => setShowAll(true)}>
            + {notShownCount} more {'(Click to show all)'}
          </Button>
        )}
      </Card>
    )
  })

  return (
    <Modal
      show={downloadsModalIsOpen}
      onHide={() => setDownloadsModalIsOpen(false)}
      size='lg'
      centered={true}
      scrollable={true}
    >
      <ModalHeader closeButton>
        <Modal.Title>Downloads</Modal.Title>
      </ModalHeader>
      <ModalBody style={{ height: '85vh' }}>
        {preferences?.downloadToSongsDirectory ? (
          <>
            <div>osu! should automatically open all .osz files once they are finished downloading.</div>
            <div>If it doesn&apos;t, you may need to press F5 at the song select screen.</div>
          </>
        ) : (
          <div>Download location: {preferences?.downloadDirectoryOverride}</div>
        )}
        {collections.length > 0 ? (
          collections
        ) : (
          <div className='py-4'>
            <h5 className='text-secondary text-center'>No downloads</h5>
            {showDownloadTroubleshootText && (
              <p className='text-secondary text-center'>
                Downloads not starting? Try restarting the program and trying again.
              </p>
            )}
          </div>
        )}
      </ModalBody>
    </Modal>
  )
}

export default DownloadsModal
