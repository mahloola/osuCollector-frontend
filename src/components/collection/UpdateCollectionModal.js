import { useEffect, useState } from 'react'
import { Badge, Button, Card, Form, Spinner, Modal, ModalBody } from '../bootstrap-osu-collector'
import { useHistory } from 'react-router-dom'
import * as api from '../../utils/api'
import moment from 'moment'
import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { parseCollectionDb } from '../../utils/collectionsDb'
import styled from 'styled-components'
import { arrayEquals } from '../../utils/misc'

const { ipcRenderer } = window.require('electron')

function UpdateCollectionModal({ collection: remoteCollection, mutateCollection, show, hide }) {
  const [uploading, setUploading] = useState(false)
  const [localCollections, setLocalCollections] = useState(null)

  // read collection.db to show preview of mappool collections to be removed
  const loadCollectionDb = async () => {
    const { error, data } = await ipcRenderer.invoke('parse-collection-db')
    if (error) {
      alert(error + '\n\nPlease check that your osu! install folder is configured properly in settings.')
      return
    }
    setLocalCollections(
      data.collection.map((collection) => ({
        name: collection.name,
        beatmapChecksums: collection.beatmapsMd5,
      }))
    )
  }

  useEffect(() => {
    if (show) {
      setUploading(false)
      loadCollectionDb()
    }
  }, [show])

  const submit = async () => {
    setUploading(true)
    try {
      const collections = await api.uploadCollections([localCollection])
    } catch (err) {
      alert(
        err.message + '\n\n' + 'If this is your first time seeing this, you can try uploading the collection again.'
      )
    }
    mutateCollection()
    setUploading(false)
    hide()
  }

  const localCollection = localCollections?.find((collection) => collection.name === remoteCollection.name)
  const localCount = localCollection?.beatmapChecksums?.length
  const remoteChecksums = remoteCollection?.beatmapsets
    ?.flatMap((beatmapset) => beatmapset.beatmaps)
    .map((beatmap) => beatmap.checksum)
  const remoteCount = remoteChecksums?.length
  const localAdditions = localCollection?.beatmapChecksums?.filter(
    (checksum) => !remoteChecksums.includes(checksum)
  ).length
  const localRemovals = remoteChecksums?.filter(
    (checksum) => !localCollection?.beatmapChecksums.includes(checksum)
  ).length
  const isIdentical = arrayEquals(localCollection?.beatmapChecksums, remoteChecksums)
  const uploadDisabled = !localCollection || isIdentical || uploading

  return (
    <Modal show={show} onHide={hide} size='xl' centered>
      <ModalBody className='px-5 py-4'>
        <Title className='text-muted'>Update collection: {remoteCollection?.name}</Title>
        <div className='d-flex gap-5'>
          <div className='w-100'>
            <h5>In local collection.db:</h5>
            {localCollections && (
              <Card $lightbg className='p-3'>
                {localCollection ? (
                  <>
                    <div>
                      {localCount} beatmaps {isIdentical && <span className='text-muted ml-1'>(no change)</span>}
                    </div>
                    {localAdditions > 0 && <div className='text-success'>+{localAdditions} added beatmap(s)</div>}
                    {localRemovals > 0 && <div className='text-danger'>-{localRemovals} removed beatmap(s)</div>}
                  </>
                ) : (
                  <>You do not have a collection named &apos;{remoteCollection?.name}&apos;</>
                )}
              </Card>
            )}
          </div>
          <div className='w-100'>
            <div className='d-flex gap-3'>
              <h5>On osu!Collector:</h5>
            </div>
            <Card $lightbg className='p-3'>
              <div>
                <span className='mr-2'>{remoteCount} beatmaps</span>
                <span className='text-muted'>
                  (updated {moment(remoteCollection?.dateLastModified?._seconds * 1000).fromNow()})
                </span>
              </div>
            </Card>
          </div>
        </div>
        <div className='d-flex justify-content-end mt-4 gap-2'>
          <Button style={{ width: '11em' }} onClick={hide} variant='secondary'>
            Cancel
          </Button>
          <Button
            style={{ width: '11em' }}
            onClick={submit}
            variant={uploadDisabled ? 'outline-primary' : 'primary'}
            disabled={uploadDisabled}
          >
            {uploading ? (
              <>
                <Spinner as='span' animation='border' size='sm' role='status' className='mx-2' aria-hidden='true' />
                Updating...
              </>
            ) : (
              'Update'
            )}
          </Button>
        </div>
      </ModalBody>
    </Modal>
  )
}
const Title = styled.h1`
  font-weight: 300;
  margin-bottom: 30px;
`
export default UpdateCollectionModal
