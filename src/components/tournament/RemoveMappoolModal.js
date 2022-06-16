import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { getMappoolCollections } from 'utils/misc'
import { Badge, Button, Card, Form, Modal, ModalBody, Spinner } from '../bootstrap-osu-collector'

const { ipcRenderer } = window.require('electron')

function RemoveMappoolModal({
  tournament,
  localCollections,
  setLocalCollections,
  removeModalIsOpen,
  setRemoveModalIsOpen,
}) {
  /**
   * @type {[('tournament' | 'round' | 'mod' | 'beatmap'), Function]}
   */
  const [groupBySelection, setGroupBySelection] = useState('round')
  const [removeConfirmationMessage, setRemoveConfirmationMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [removeResultMessage, setRemoveResultMessage] = useState('')

  const submit = async () => {
    setRemoveResultMessage('')
    const osuIsRunning = await ipcRenderer.invoke('check-osu-running')
    if (osuIsRunning.error) {
      setRemoveConfirmationMessage("Just to be safe, don't import collections while osu is running!")
    } else if (osuIsRunning) {
      setRemoveConfirmationMessage(
        'It looks like osu! is currently running. Do not proceed if you have made any changes to your collections in game.'
      )
    } else {
      removeImportedMappool()
    }
  }

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
  const removeImportedMappool = async () => {
    setRemoveResultMessage('')
    setLoading(true)
    const removeResult = await ipcRenderer.invoke('remove-imported-tournament', tournament)
    if (removeResult?.error) {
      console.log(removeResult)
      setRemoveResultMessage(removeResult.error)
    } else {
      loadCollectionDb()
      const isOsuCurrentlyRunning = await ipcRenderer.invoke('check-osu-running')
      let message = `Collections successfully removed! `
      message +=
        isOsuCurrentlyRunning && !isOsuCurrentlyRunning.error
          ? '\nPlease restart osu! immediately for changes to take effect.'
          : '\nYou should see the changes the next time you open up osu!'
      setRemoveResultMessage(message)
    }

    setLoading(false)
  }

  const collectionsGroupedBy = getMappoolCollections(tournament)
  const previewCollections = collectionsGroupedBy
    ? Object.keys(collectionsGroupedBy)
        .map((key) => collectionsGroupedBy[key])
        .flat(1)
        .filter(({ name }) => localCollections.map(({ name }) => name).includes(name))
    : null

  return (
    <Modal show={removeModalIsOpen} onHide={() => setRemoveModalIsOpen(false)} size='xl' centered>
      <ModalBody className='px-5 py-4'>
        <Form>
          <div>
            <Title className='text-muted'>Remove mappool collections</Title>

            <ImportAndPreviewContainer>
              <MethodContainer>
                {!removeConfirmationMessage ? (
                  <div>
                    <Button disabled={!previewCollections?.length} onClick={submit} variant='primary'>
                      {loading ? (
                        <>
                          <Spinner
                            as='span'
                            animation='border'
                            size='sm'
                            role='status'
                            className='mx-2'
                            aria-hidden='true'
                          />
                          Removing...
                        </>
                      ) : (
                        'Remove collections'
                      )}
                    </Button>
                    <div className='mt-2' style={{ whiteSpace: 'pre' }}>
                      {removeResultMessage}
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className='d-flex'>
                      <Button onClick={removeImportedMappool} variant='warning' className='mr-2'>
                        Continue
                      </Button>
                      <Button onClick={() => setRemoveConfirmationMessage('')} variant='secondary'>
                        Cancel
                      </Button>
                    </div>
                    <div className='mt-2'>{removeConfirmationMessage}</div>
                  </div>
                )}
              </MethodContainer>
              <PreviewContainer>
                <h4>
                  Preview
                  <span className='text-muted ml-3'>
                    {`${previewCollections?.length} imported collection${
                      previewCollections?.length === 1 ? '' : 's'
                    } to be removed`}
                  </span>
                </h4>
                <CollectionWrapper>
                  {previewCollections?.map((collection, i) => {
                    const length = collection.beatmaps.length
                    return (
                      <CollectionRow $lightbg key={i}>
                        <div>
                          {collection.name}
                          <span className='text-muted ml-2'>
                            {length} {length === 1 ? 'beatmap' : 'beatmaps'}
                          </span>
                        </div>
                      </CollectionRow>
                    )
                  })}
                </CollectionWrapper>
              </PreviewContainer>
            </ImportAndPreviewContainer>
          </div>
        </Form>
      </ModalBody>
    </Modal>
  )
}

const Title = styled.h1`
  font-weight: 300;
  margin-bottom: 30px;
`

const ImportAndPreviewContainer = styled.div`
  height: 80vh;
  display: flex;
  flex-direction: column;
  gap: 30px;
  @media screen and (min-width: 1200px) {
    flex-direction: row;
  }
`

const MethodContainer = styled.div`
  @media screen and (min-width: 1200px) {
    flex-basis: 20%;
  }
`
const PreviewContainer = styled.div`
  width: 100%;
  overflow-y: auto;
`
const CollectionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`
const CollectionRow = styled(Card)`
  padding: 0.5rem;
  padding-left: 0.8rem;
  width: 100%;
`

export default RemoveMappoolModal
