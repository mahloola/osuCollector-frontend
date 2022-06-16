import { useState } from 'react'
import styled from 'styled-components'
import { getMappoolCollections } from 'utils/misc'
import { Button, Card, Form, Modal, ModalBody } from '../bootstrap-osu-collector'
import { LinkContainer } from 'react-router-bootstrap'

function PreviewRemoveMappoolModal({ tournament, show, hide }) {
  const collectionsGroupedBy = getMappoolCollections(tournament)
  const previewCollections = collectionsGroupedBy
    ? Object.keys(collectionsGroupedBy)
        .map((key) => collectionsGroupedBy[key])
        .flat(1)
    : null

  const [renderOverlay, setRenderOverlay] = useState(false)
  const [previewOverlayIsOpaque, setPreviewOverlayIsOpaque] = useState(false)
  const togglePreviewMessage = () => {
    if (renderOverlay) {
      // hide
      setPreviewOverlayIsOpaque(false)
      setTimeout(() => setRenderOverlay(false), 150)
    } else {
      // show
      setRenderOverlay(true)
      setPreviewOverlayIsOpaque(false)
      setTimeout(() => setPreviewOverlayIsOpaque(true), 0)
    }
  }

  return (
    <Modal show={show} onHide={hide} size='xl' centered>
      {renderOverlay && (
        <PreviewOverlay isVisible={previewOverlayIsOpaque}>
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
            <Title className='text-muted'>Remove mappool collections (preview)</Title>

            <ImportAndPreviewContainer>
              <MethodContainer>
                <div>
                  <Button disabled={!previewCollections?.length} onClick={togglePreviewMessage} variant='primary'>
                    Remove collections
                  </Button>
                </div>
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

export default PreviewRemoveMappoolModal
