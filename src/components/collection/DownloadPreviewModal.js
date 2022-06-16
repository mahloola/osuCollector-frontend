/* eslint-disable no-unused-vars */
import {
  Button,
  Card,
  Container,
  Row,
  Col,
  Image,
  Modal,
  ModalBody,
  ModalHeader,
  ProgressBar,
} from '../bootstrap-osu-collector'
import { useContext, useEffect, useRef, useState } from 'react'
import { ThemeContext } from 'styled-components'
import Truncate from 'react-truncate'
import { Accordion } from 'react-bootstrap'
import { useCollectionBeatmaps } from '../../utils/api'
import { getRandomFromArray } from '../../utils/misc'

const DownloadStates = Object.freeze({
  NotStarted: 'Starting download...',
  Downloading: 'Downloading...',
  Finished: 'Finished',
  Cancelled: 'Cancelled',
  Failed: 'Failed',
})

function DownloadPreviewModal({ collection, show, hide }) {
  const { collectionBeatmaps } = useCollectionBeatmaps(collection?.id, {
    perPage: 50,
    sortBy: 'beatmapset.artist',
    orderBy: 'asc',
    filterMin: undefined,
    filterMax: undefined,
  })

  // simulate downloads
  const [collectionDownloads, setCollectionDownloads] = useState([new CollectionDownload(collection)])
  const intervalRef = useRef(null)
  useEffect(() => {
    intervalRef.current = setInterval(simulateDownload, 100)
    return () => clearInterval(intervalRef.current)
  })
  const simulateDownload = () => {
    // progress currently downloading beatmapset
    setCollectionDownloads((prev) => {
      if (!collectionBeatmaps) return

      const _collectionDownloads = [...prev]
      const collectionDownload = collectionDownloads[0]
      let currentBeatmapset = collectionDownload.beatmapsets.find(
        (beatmapset) => beatmapset.downloadStatus === DownloadStates.Downloading
      )
      if (!currentBeatmapset) {
        currentBeatmapset = collectionDownload.beatmapsets.find(
          (beatmapset) => beatmapset.downloadStatus === DownloadStates.NotStarted
        )
        if (currentBeatmapset) {
          currentBeatmapset.downloadStatus = DownloadStates.Downloading
          const randomBeatmap = getRandomFromArray(collectionBeatmaps)
          currentBeatmapset.url = `https://osz-dl.nyc3.cdn.digitaloceanspaces.com/${encodeURIComponent(
            `${randomBeatmap.beatmapset.id} ${randomBeatmap.beatmapset.artist} - ${randomBeatmap.beatmapset.title}`
          )}`
          currentBeatmapset.filename = `${randomBeatmap.beatmapset.id} ${randomBeatmap.beatmapset.artist} - ${randomBeatmap.beatmapset.title}`
        }
      }
      if (currentBeatmapset) {
        currentBeatmapset.bytesReceived = Math.min(
          currentBeatmapset.bytesReceived + 5 * 1e5,
          currentBeatmapset.bytesTotal
        )
        if (currentBeatmapset.bytesReceived >= currentBeatmapset.bytesTotal) {
          currentBeatmapset.downloadStatus = DownloadStates.Finished
        }
      } else {
        collectionDownload.downloadStatus = DownloadStates.Finished
      }
      return _collectionDownloads
    })
  }

  // https://i.imgur.com/optYWti.png
  const collections = collectionDownloads?.map((collectionDownload, index) => (
    <CollectionDownloadCard key={index} collectionDownload={collectionDownload} />
  ))

  return (
    <Modal show={show} onHide={hide} size='lg' centered={true} scrollable={true}>
      <ModalHeader closeButton>
        <Modal.Title>Downloads (preview)</Modal.Title>
      </ModalHeader>
      <ModalBody style={{ height: '85vh' }}>
        <div>osu! should automatically open all .osz files once they are finished downloading.</div>
        <div>If it doesn&apos;t, you may need to press F5 at the song select screen.</div>
        {collections.length > 0 ? (
          collections
        ) : (
          <div className='py-4'>
            <h5 className='text-secondary text-center'>No downloads</h5>
          </div>
        )}
      </ModalBody>
    </Modal>
  )
}

function CollectionDownloadCard({ collectionDownload }) {
  const totalBeatmapsets = collectionDownload.beatmapsets?.length
  const finishedDownloads = collectionDownload.beatmapsets?.filter(
    (mapset) => mapset.downloadStatus === DownloadStates.Finished
  ).length
  const visibleDownloads = collectionDownload.beatmapsets?.filter(
    (mapset) =>
      mapset.downloadStatus !== DownloadStates.NotStarted && mapset.downloadStatus !== DownloadStates.Cancelled
  )
  const statusText =
    collectionDownload.downloadStatus === DownloadStates.NotStarted
      ? 'Pending...'
      : collectionDownload.downloadStatus === DownloadStates.Downloading
      ? `Downloading: ${visibleDownloads.length} of ${totalBeatmapsets}`
      : collectionDownload.downloadStatus === DownloadStates.Finished
      ? `Downloaded ${finishedDownloads} of ${totalBeatmapsets}`
      : collectionDownload.downloadStatus === DownloadStates.Cancelled
      ? `Downloaded ${finishedDownloads} of ${totalBeatmapsets}`
      : ''
  const inProgress =
    collectionDownload.downloadStatus !== DownloadStates.Finished &&
    collectionDownload.downloadStatus !== DownloadStates.Cancelled
  return (
    <Card $lightbg className='shadow-sm py-2 px-3 mx-2 my-4'>
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
            <Button className='align-middle' variant='outline-secondary' size='sm'>
              {inProgress ? 'Stop all' : 'Clear'}
            </Button>
          </Col>
        </Row>
      </Container>
      {visibleDownloads?.map((mapset) => (
        <BeatmapsetDownloadCard key={mapset.id} mapsetDownload={mapset} />
      ))}
    </Card>
  )
}

function BeatmapsetDownloadCard({ mapsetDownload }) {
  const [showError, setShowError] = useState(false)

  const theme = useContext(ThemeContext)

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
            {mapsetDownload.downloadStatus === DownloadStates.Downloading && (
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
            )}
          </Col>
        </Row>
      </Container>
    </Card>
  )
}

class CollectionDownload {
  constructor(collection) {
    this.collectionId = collection.id
    this.uploader = collection.uploader.username
    this.name = collection.name
    this.downloadStatus = DownloadStates.Downloading
    this.beatmapsets = collection.beatmapsets.map((beatmapset) => ({
      id: beatmapset.id,
      beatmaps: beatmapset.beatmaps,
      downloadStatus: DownloadStates.NotStarted,
      bytesReceived: 0,
      bytesTotal: 5e6 + Math.random() * 5e6,
      downloadLocation: '',
    }))
    this.cancelTokens = new Map()
    this.url = ''
    this.errorMessage = undefined
  }

  getBeatmapsetsNotStarted() {
    return this.beatmapsets.filter((beatmapset) => beatmapset.downloadStatus === DownloadStates.NotStarted)
  }
}

export default DownloadPreviewModal
