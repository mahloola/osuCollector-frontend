import { useState } from 'react'
import { Badge, Button, Card, Form, Spinner, Modal, ModalBody } from '../bootstrap-osu-collector'
import { useHistory } from 'react-router-dom'
import * as api from '../../utils/api'
import './uploadModal.css'
import moment from 'moment'

function UploadModal({ uploadModalIsOpen, setUploadModalIsOpen, remoteCollections, localCollections }) {
  const [selectedCollection, setSelectedCollection] = useState(null)
  const [uploading, setUploading] = useState(false)
  const history = useHistory()

  const onCheck = ({ target }) => {
    const { value, checked } = target
    setSelectedCollection(checked ? localCollections[value] : null)
  }

  const isUploaded = (collection) => remoteCollections.map((c) => c.name).includes(collection?.name)

  const getRemoteCollection = (name) => {
    const c = remoteCollections.find((c) => c.name === name)
    console.log(c)
    return c
  }

  const submit = async () => {
    if (!selectedCollection) {
      return
    }
    if (selectedCollection.beatmapChecksums.length > 2000) {
      alert('This collection is too big (max collection size: 2000)')
      return
    }
    setUploading(true)
    try {
      const collections = await api.uploadCollections([selectedCollection])
      if (collections.length >= 1) {
        // history.push(`/collections/${collections[0].id}`) // TODO: mutate useRecentCollections
        window.location.href = `/collections/${collections[0].id}`
      }
    } catch (err) {
      alert(
        err.message + '\n\n' + 'If this is your first time seeing this, you can try uploading the collection again.'
      )
    }
    setUploading(false)
    setUploadModalIsOpen(false)
  }

  return (
    <Modal show={uploadModalIsOpen} onHide={() => setUploadModalIsOpen(false)} size='xl' centered>
      <ModalBody className='px-5 py-4'>
        <Form>
          {localCollections.length > 0 && (
            <div>
              <h3>Select a collection to upload or update</h3>
              <div style={{ maxHeight: '77vh', overflowY: 'scroll' }}>
                {localCollections.map((collection, index) => (
                  <Card $lightbg key={index} className='shadow-sm mx-2 my-2 py-2 px-4'>
                    <div className='d-flex text-right'>
                      <div className='flex-fill text-left'>
                        {collection.name}
                        <span className='text-muted ml-3'>{collection.beatmapChecksums.length} beatmaps</span>
                      </div>
                      {isUploaded(collection) && (
                        <>
                          <span className='text-muted ml-3'>
                            <small>
                              last updated{' '}
                              {moment.unix(getRemoteCollection(collection.name).dateLastModified._seconds).fromNow()}
                            </small>
                          </span>
                          <Badge
                            className='mx-3'
                            variant='info'
                            style={{
                              minWidth: '50px',
                              height: '24px',
                              paddingTop: '6px',
                            }}
                          >
                            Uploaded
                          </Badge>
                        </>
                      )}
                      <div className='ml-2'>
                        <Form.Check
                          checked={selectedCollection?.name === collection.name}
                          value={index}
                          onChange={onCheck}
                        />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
              <br></br>
              <div className='upload-buttons'>
                <Button
                  style={{ width: '11em' }}
                  onClick={submit}
                  disabled={!selectedCollection}
                  variant={selectedCollection ? 'primary' : 'outline-secondary'}
                >
                  {uploading ? (
                    <>
                      <Spinner
                        as='span'
                        animation='border'
                        size='sm'
                        role='status'
                        className='mx-2'
                        aria-hidden='true'
                      />
                      {isUploaded(selectedCollection) ? 'Updating...' : 'Uploading...'}
                    </>
                  ) : isUploaded(selectedCollection) ? (
                    'Update'
                  ) : (
                    'Upload'
                  )}
                </Button>
              </div>
            </div>
          )}
        </Form>
      </ModalBody>
    </Modal>
  )
}

export default UploadModal
