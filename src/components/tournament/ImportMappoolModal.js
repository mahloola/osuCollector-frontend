import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { getMappoolCollections } from 'utils/misc'
import { Badge, Button, Card, Form, Modal, ModalBody, Spinner } from '../bootstrap-osu-collector'

const { ipcRenderer } = window.require('electron')

function ImportMappoolModal({ tournament, importModalIsOpen, setImportModalIsOpen }) {
  /**
   * @type {[('tournament' | 'round' | 'mod' | 'beatmap'), Function]}
   */
  const [groupBySelection, setGroupBySelection] = useState('round')
  const [importConfirmationMessage, setImportConfirmationMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [importResultMessage, setImportResultMessage] = useState('')

  const submit = async () => {
    setImportResultMessage('')
    const osuIsRunning = await ipcRenderer.invoke('check-osu-running')
    if (osuIsRunning.error) {
      setImportConfirmationMessage("Just to be safe, don't import collections while osu is running!")
    } else if (osuIsRunning) {
      setImportConfirmationMessage(
        'It looks like osu! is currently running. Do not proceed if you have made any changes to your collections in game.'
      )
    } else {
      importTournament()
    }
  }

  const importTournament = async () => {
    setImportConfirmationMessage('')
    setImportResultMessage('')
    setLoading(true)
    const importResult = await ipcRenderer.invoke('import-tournament', tournament, groupBySelection)
    if (importResult?.error) {
      console.log(importResult)
      setImportResultMessage(importResult.error)
    } else {
      const isOsuCurrentlyRunning = await ipcRenderer.invoke('check-osu-running')
      let message = 'Collection successfully imported!'
      message +=
        isOsuCurrentlyRunning && !isOsuCurrentlyRunning.error
          ? '\nPlease restart osu! immediately for changes to take effect.'
          : '\nYou should see the collection the next time you open up osu!'

      if (importResult.missingBeatmapsets.length) {
        message += `\n\nYou may still need to download an estimated ${importResult.missingBeatmapsets} missing mapsets.`
      }
      setImportResultMessage(message)
    }

    setLoading(false)
  }

  const previewCollections = getMappoolCollections(tournament, groupBySelection)

  const showImportButton = !importConfirmationMessage

  return (
    <Modal show={importModalIsOpen} onHide={() => setImportModalIsOpen(false)} size='xl' centered>
      <ModalBody className='px-5 py-4'>
        <Form>
          <div>
            <Title className='text-muted'>Import mappool collections</Title>

            <ImportAndPreviewContainer>
              <MethodContainer>
                <h4>Import Method</h4>
                <Form className='ml-2 mt-3 mb-4'>
                  {[
                    { label: 'One single collection', value: 'tournament' },
                    { label: 'Group by round', value: 'round' },
                    { label: 'Group by mod', value: 'mod' },
                    { label: 'One collection per beatmap', value: 'beatmap' },
                  ].map(({ label, value }, i) => (
                    <Form.Check
                      key={i}
                      checked={groupBySelection === value}
                      onChange={() => setGroupBySelection(value)}
                      type='radio'
                      label={label}
                    />
                  ))}
                </Form>
                {showImportButton && (
                  <div>
                    <Button onClick={submit} variant='primary'>
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
                          Importing...
                        </>
                      ) : (
                        'Import to osu!'
                      )}
                    </Button>
                    <div className='mt-2' style={{ whiteSpace: 'pre' }}>
                      {importResultMessage}
                    </div>
                  </div>
                )}
                {importConfirmationMessage && (
                  <div>
                    <div className='d-flex'>
                      <Button onClick={importTournament} variant='warning' className='mr-2'>
                        Continue
                      </Button>
                      <Button onClick={() => setImportConfirmationMessage('')} variant='secondary'>
                        Cancel
                      </Button>
                    </div>
                    <div className='mt-2'>{importConfirmationMessage}</div>
                  </div>
                )}
              </MethodContainer>
              <PreviewContainer>
                <h4>
                  Preview
                  <span className='text-muted ml-3'>
                    {`${previewCollections?.length} collection${
                      previewCollections?.length === 1 ? '' : 's'
                    } to be imported`}
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
    flex-basis: 33%;
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

export default ImportMappoolModal
