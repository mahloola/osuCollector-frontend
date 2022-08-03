import { useState } from 'react'
import { Badge, Button, Card, Form, Spinner, Modal, ModalBody } from '../bootstrap-osu-collector'
import { useHistory } from 'react-router-dom'
import * as api from '../../utils/api'
import './uploadModal.css'
import moment from 'moment'
import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { parseCollectionDb } from '../../utils/collectionsDb'
import { useSWRConfig } from 'swr'

function UploadModal({ uploadModalIsOpen, setUploadModalIsOpen, remoteCollections }) {
  const { cache } = useSWRConfig()
  const [selectedCollection, setSelectedCollection] = useState(null)
  const [uploading, setUploading] = useState(false)
  const history = useHistory()
  const [file, setFile] = useState(null)
  const [localCollections, setLocalCollections] = useState([])
  const onDrop = useCallback((acceptedFiles) => {
    let file = acceptedFiles[0]
    setFile(file)
    console.log(file)
    let reader = new FileReader()
    reader.onload = async () => {
      setLocalCollections(parseCollectionDb(reader.result))
      console.log('collections', localCollections)
    }
    reader.readAsArrayBuffer(file)
  }, [])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

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
        // this is easier than mutating useRecentCollections
        // window.location.href = `/collections/${collections[0].id}`
        cache.clear()
        history.push(`/collections/${collections[0].id}`)
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
        <h3>1. Open collection.db</h3>
        collection.db is a file that contains all of your osu! collections. It is located in your osu! install folder.
        Example:
        <pre className='bg-light my-2 py-1 px-3'>
          <code>C:\Users\jun\AppData\Local\osu!\collection.db</code>
        </pre>
        <br></br>
        <Form>
          <div className='dragon-drop' {...getRootProps()}>
            <input {...getInputProps()} />
            {file != null ? (
              file.name
            ) : isDragActive ? (
              <span>Drop the file here ...</span>
            ) : (
              <span>Choose a file or drag it here.</span>
            )}
          </div>
          <br />
          {localCollections.length > 0 && (
            <div>
              <h3>2. Select a collection to upload or update</h3>
              <div style={{ height: '52vh', overflowY: 'scroll' }}>
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
