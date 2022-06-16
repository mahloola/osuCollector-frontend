import { useState } from 'react'
import styled from 'styled-components'
import { getMappoolCollections } from 'utils/misc'
import { Button, Card, Form, Modal, ModalBody } from '../bootstrap-osu-collector'
import { LinkContainer } from 'react-router-bootstrap'

function ImportMappoolPreviewModal({ show, hide, tournament }) {
  /**
   * @type {[('tournament' | 'round' | 'mod' | 'beatmap'), Function]}
   */
  const [groupBySelection, setGroupBySelection] = useState('round')
  const previewCollections = getMappoolCollections(tournament, groupBySelection)
  const [instantlyShowPreviewMessage, setInstantlyShowPreviewMessage] = useState(false)
  const [previewMessageIsVisible, setPreviewMessageIsVisible] = useState(false)

  const togglePreviewMessage = () => {
    if (instantlyShowPreviewMessage) {
      // hide
      setPreviewMessageIsVisible(false)
      setTimeout(() => setInstantlyShowPreviewMessage(false), 150)
    } else {
      // show
      setInstantlyShowPreviewMessage(true)
      setPreviewMessageIsVisible(false)
      setTimeout(() => setPreviewMessageIsVisible(true), 0)
      // setTimeout(() => setPreviewMessageIsVisible(true), 150)
    }
  }

  return (
    <Modal show={show} onHide={hide} size='xl' centered>
      {instantlyShowPreviewMessage && (
        <PreviewOverlay isVisible={previewMessageIsVisible}>
          <div className='horizontalStrip'>
            <h3>You are previewing an osu!Collector Desktop feature!</h3>
            <div className='d-flex gap-3'>
              <Button variant='secondary' onClick={togglePreviewMessage}>
                Cancel
              </Button>
              <LinkContainer to='/client'>
                <Button>Get osu!Collector Desktop</Button>
              </LinkContainer>
            </div>
          </div>
        </PreviewOverlay>
      )}
      <ModalBody className='px-5 py-4'>
        <Form>
          <div>
            <Title className='text-muted'>Import mappool collections (preview)</Title>

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
                <Button variant='primary' onClick={togglePreviewMessage}>
                  Import to osu!
                </Button>
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
const PreviewOverlay = styled.div`
  position: absolute;
  top: 69px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: calc(100% - 69px);
  z-index: 2;
  background-color: rgba(255, 255, 255, 0.2);
  transition: opacity 0.15s ease-in-out;
  opacity: ${({ isVisible }) => (isVisible ? '1' : '0')};
  .horizontalStrip {
    display: flex;
    flex-direction: column;
    gap: 16px;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 160px;
    color: white;
    /* background: linear-gradient(
      0deg,
      rgba(2, 0, 36, 0) 0%,
      rgba(0, 0, 0, 0.8015581232492998) 20%,
      rgba(0, 0, 0, 0.8) 80%,
      rgba(0, 0, 0, 0) 100%
    ); */
    background-color: rgba(0, 0, 0, 0.8);
    -webkit-box-shadow: 0px 0px 15px 5px #000;
    box-shadow: 0px 0px 15px 5px #000;
  }
`

export default ImportMappoolPreviewModal
