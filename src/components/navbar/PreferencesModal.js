/* eslint-disable no-unused-vars */
import { Button, Col, Form, FormControl, InputGroup, Row } from '../bootstrap-osu-collector'
import Modal from 'react-bootstrap/Modal'
import { useEffect, useState } from 'react'
import path from 'path'
import { InfoCircleFill, Plus } from 'react-bootstrap-icons'
import { OverlayTrigger, Popover, PopoverTitle, PopoverContent } from 'react-bootstrap'
import { FaTrash } from 'react-icons/fa'
const { ipcRenderer } = window.require('electron')

// eslint-disable-next-line no-unused-vars
function PreferencesModal({ preferences, preferencesModalIsOpen, setPreferencesModalIsOpen }) {
  const [unsavedPreferences, setUnsavedPreferences] = useState({
    osuInstallDirectory: '',
    usingCustomSongsDirectory: false,
    osuSongsDirectory: '',
    osuSongsSymlinks: [],
    downloadToSongsDirectory: true,
    downloadDirectoryOverride: '',
    importedCollectionNameFormat: 'o!c - ${uploader} - ${collectionName}',
    minimizeToTray: false,
    notifyOnDownloadsComplete: false,
    useHttp: false,
  })

  const onPreferencesChanged = () => {
    setUnsavedPreferences({
      osuInstallDirectory: preferences?.osuInstallDirectory || '',
      usingCustomSongsDirectory: preferences ? preferences.usingCustomSongsDirectory : false,
      osuSongsDirectory: preferences?.osuSongsDirectory || '',
      osuSongsSymlinks: preferences?.osuSongsSymlinks || [],
      downloadToSongsDirectory: preferences ? preferences.downloadToSongsDirectory : true,
      downloadDirectoryOverride: preferences?.downloadDirectoryOverride || '',
      importedCollectionNameFormat:
        preferences?.importedCollectionNameFormat || 'o!c - ${uploader} - ${collectionName}',
      minimizeToTray: preferences?.minimizeToTray || false,
      notifyOnDownloadsComplete: preferences?.notifyOnDownloadsComplete || false,
      useHttp: preferences?.useHttp || false,
    })
  }
  useEffect(onPreferencesChanged, [preferences])

  // osu install folder
  const setInstallFolder = (folder) => {
    // can't properly detect OS here, need to manually determine which slash to use
    const match = folder.match(/^.*?(\\|\/)/)
    const sep = match ? match[1] : '\\'

    const osuSongsDirectory = unsavedPreferences.usingCustomSongsDirectory
      ? unsavedPreferences.osuSongsDirectory
      : folder.replace(/(\\|\/)$/, '') + sep + 'Songs'
    setUnsavedPreferences({
      ...unsavedPreferences,
      osuInstallDirectory: folder,
      osuSongsDirectory: osuSongsDirectory,
    })
  }

  const openInstallFolderClicked = async () => {
    const folder = await ipcRenderer.invoke('open-folder-dialog', {
      title: 'Select osu! install folder',
      defaultPath: unsavedPreferences.osuInstallDirectory || '/',
      properties: ['openDirectory'],
    })
    if (folder) {
      setInstallFolder(folder)
    }
  }

  // songs folder
  const differentLocationChecked = async (e) => {
    if (e.target.checked) {
      setUnsavedPreferences({
        ...unsavedPreferences,
        usingCustomSongsDirectory: e.target.checked,
        osuSongsSymlinks: unsavedPreferences.osuSongsSymlinks?.length ? unsavedPreferences.osuSongsSymlinks : [''],
      })
    } else {
      setUnsavedPreferences({
        ...unsavedPreferences,
        usingCustomSongsDirectory: e.target.checked,
        osuSongsDirectory: path
          .join(unsavedPreferences.osuInstallDirectory, 'Songs')
          .replace(/\//g, await ipcRenderer.invoke('path-sep'))
          .replace(/\\\\/g, await ipcRenderer.invoke('path-sep')),
      })
    }
  }

  const songsFolderChanged = (e) => {
    setUnsavedPreferences({
      ...unsavedPreferences,
      osuSongsDirectory: e.target.value,
    })
  }
  const symlinkChanged = (e, index) => {
    setUnsavedPreferences(() => {
      const current = { ...unsavedPreferences }
      current.osuSongsSymlinks[index] = e.target.value
      return current
    })
  }
  const symlinkAdd = (e) => {
    setUnsavedPreferences((prev) => {
      const current = { ...prev }
      current.osuSongsSymlinks.push('')
      return current
    })
  }

  const openSymlinkFolderClicked = async (i) => {
    const folder = await ipcRenderer.invoke('open-folder-dialog', {
      title: 'Select songs folder',
      defaultPath: unsavedPreferences.osuSongsDirectory || '/',
      properties: ['openDirectory'],
    })
    if (folder !== null) {
      setUnsavedPreferences((prev) => {
        const current = { ...prev }
        current.osuSongsSymlinks[i] = folder
        return current
      })
    }
  }

  const deleteSymlinkClicked = (i) => {
    setUnsavedPreferences((prev) => {
      const current = { ...prev }
      current.osuSongsSymlinks.splice(i, 1)
      return current
    })
  }

  const openSongsFolderClicked = async () => {
    const folder = await ipcRenderer.invoke('open-folder-dialog', {
      title: 'Select songs folder',
      defaultPath: unsavedPreferences.osuSongsDirectory || '/',
      properties: ['openDirectory'],
    })
    if (folder !== null) {
      setUnsavedPreferences({
        ...unsavedPreferences,
        osuSongsDirectory: folder,
      })
    }
  }

  // Downloads folder
  const downloadToSongsFolderChecked = (e) => {
    setUnsavedPreferences({
      ...unsavedPreferences,
      downloadToSongsDirectory: e.target.checked,
    })
  }

  const downloadFolderChanged = (e) => {
    setUnsavedPreferences({
      ...unsavedPreferences,
      downloadDirectoryOverride: e.target.value,
    })
  }

  const importedCollectionNameFormatChanged = (e) => {
    setUnsavedPreferences({
      ...unsavedPreferences,
      importedCollectionNameFormat: e.target.value,
    })
  }

  const minimizeToTrayChanged = (e) => {
    setUnsavedPreferences({
      ...unsavedPreferences,
      minimizeToTray: e.target.checked,
    })
  }

  const notifyOnDownloadsCompleteChanged = (e) => {
    setUnsavedPreferences({
      ...unsavedPreferences,
      notifyOnDownloadsComplete: e.target.checked,
    })
  }

  const useHttpChanged = (e) => {
    setUnsavedPreferences({
      ...unsavedPreferences,
      useHttp: e.target.checked,
    })
  }

  const openDownloadsFolderClicked = async () => {
    const folder = await ipcRenderer.invoke('open-folder-dialog', {
      title: 'Select downloads folder',
      properties: ['openDirectory'],
    })
    if (folder !== null) {
      unsavedPreferences.downloadDirectoryOverride = folder
      setUnsavedPreferences({
        ...unsavedPreferences,
        downloadDirectoryOverride: folder,
      })
    }
  }

  const applyClicked = () => {
    ipcRenderer.invoke('apply-preferences', unsavedPreferences)
    setPreferencesModalIsOpen(false)
  }

  const showLogsClicked = () => {
    ipcRenderer.invoke('show-logs')
  }

  const openDevToolsClicked = () => {
    ipcRenderer.invoke('open-dev-tools')
  }

  return (
    <Modal
      show={preferencesModalIsOpen}
      onHide={() => setPreferencesModalIsOpen(false)}
      size='xl'
      centered={true}
      scrollable={true}
    >
      <Modal.Header closeButton>
        <Modal.Title>Preferences</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group as={Row} className='my-2'>
            <Form.Label column sm='3' className='text-right'>
              osu! Install Folder
            </Form.Label>
            <Col sm='9'>
              <InputGroup>
                <Form.Control
                  value={unsavedPreferences.osuInstallDirectory}
                  onChange={(e) => setInstallFolder(e.target.value)}
                  isInvalid={unsavedPreferences.osuInstallDirectory === ''}
                />
                <Button onClick={openInstallFolderClicked} variant='outline-secondary' size='sm'>
                  Open Folder...
                </Button>
              </InputGroup>
            </Col>
          </Form.Group>

          <div style={{ minHeight: 76 }}>
            <>
              <Form.Group as={Row} className='my-2'>
                <Form.Label column sm='3' className='text-right'>
                  Songs Folder{unsavedPreferences.usingCustomSongsDirectory && '(s)'}
                </Form.Label>
                <Col sm='9'>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <InputGroup>
                      {unsavedPreferences.usingCustomSongsDirectory && (
                        <InputGroup.Text id='basic-addon1'>Main Songs Folder</InputGroup.Text>
                      )}
                      <Form.Control
                        value={unsavedPreferences.osuSongsDirectory}
                        onChange={songsFolderChanged}
                        readOnly={!unsavedPreferences.usingCustomSongsDirectory}
                      />
                      {unsavedPreferences.usingCustomSongsDirectory && (
                        <Button onClick={openSongsFolderClicked} variant='outline-secondary' size='sm'>
                          Open Folder...
                        </Button>
                      )}
                    </InputGroup>
                    {unsavedPreferences.usingCustomSongsDirectory && (
                      <>
                        {unsavedPreferences.osuSongsSymlinks.map((symlink, i) => (
                          <InputGroup key={i}>
                            <InputGroup.Text id='basic-addon1'>symlink</InputGroup.Text>
                            <Form.Control value={symlink} onChange={(e) => symlinkChanged(e, i)} />
                            <Button onClick={() => openSymlinkFolderClicked(i)} variant='outline-secondary' size='sm'>
                              Open Folder...
                            </Button>
                            <Button onClick={() => deleteSymlinkClicked(i)} variant='outline-danger' size='sm'>
                              <FaTrash />
                            </Button>
                          </InputGroup>
                        ))}
                        <div>
                          <Button variant='outline-primary' onClick={symlinkAdd}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                              <Plus size={22} />
                              Add symlink
                            </div>
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </Col>
              </Form.Group>
              <Row className='mb-3'>
                <Col sm='3'></Col>
                <Col sm='9'>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Form.Check
                      id='diff-location-checkbox'
                      type='checkbox'
                      label='I am using symlinks'
                      checked={unsavedPreferences.usingCustomSongsDirectory}
                      onChange={differentLocationChecked}
                    />
                    <OverlayTrigger
                      placement='top'
                      trigger='hover'
                      overlay={
                        <Popover id='popover-basic' style={{ maxWidth: '400px' }}>
                          <PopoverContent>
                            <div>
                              You need to specify all symlink folders in order to prevent osu!Collector from downloading
                              duplicate beatmaps.
                            </div>
                            <br />
                            <div>Here is a typical setup:</div>
                            <code>Main ------ C:\Users\Jun\AppData\Local\osu!\Songs</code>
                            <br />
                            <code>symlink --- D:\Songs</code>
                            <br />
                            <code>symlink --- E:\Songs</code>
                          </PopoverContent>
                        </Popover>
                      }
                    >
                      <InfoCircleFill className='ml-2 text-primary' style={{ cursor: 'pointer' }} />
                    </OverlayTrigger>
                  </div>
                </Col>
              </Row>
            </>

            <Form.Group as={Row} className='my-2'>
              <Form.Label column sm='3' className='text-right'>
                Download Location
              </Form.Label>
              <Col sm='9'>
                <InputGroup>
                  <Form.Control
                    value={
                      unsavedPreferences.downloadToSongsDirectory
                        ? unsavedPreferences.osuSongsDirectory
                        : unsavedPreferences.downloadDirectoryOverride
                    }
                    onChange={downloadFolderChanged}
                    readOnly={unsavedPreferences.downloadToSongsDirectory}
                  />
                  <Button onClick={openDownloadsFolderClicked} variant='outline-secondary' size='sm'>
                    Open Folder...
                  </Button>
                </InputGroup>
              </Col>
            </Form.Group>
            <Row className='mb-3'>
              <Col sm='3'></Col>
              <Col sm='9' className='d-flex align-items-center'>
                <Form.Check
                  id='download-to-songs-folder-checkbox'
                  type='checkbox'
                  label='Download to songs folder'
                  checked={unsavedPreferences.downloadToSongsDirectory}
                  onChange={downloadToSongsFolderChecked}
                />
              </Col>
            </Row>

            <Form.Group as={Row} className='my-2'>
              <Form.Label column sm='3' className='text-right'>
                <div className='d-flex align-items-center justify-content-end'>
                  Imported Collection Name
                  <OverlayTrigger
                    placement='top'
                    trigger='hover'
                    overlay={
                      <Popover id='popover-basic'>
                        <PopoverTitle as='h3'>Variables you can use</PopoverTitle>
                        <PopoverContent>
                          <div>
                            <code>{'${uploader}'}</code> = uploader name
                          </div>
                          <div>
                            <code>{'${collectionName}'}</code> = collection name
                          </div>
                        </PopoverContent>
                      </Popover>
                    }
                  >
                    <InfoCircleFill className='ml-2 text-primary' style={{ cursor: 'pointer' }} />
                  </OverlayTrigger>
                </div>
              </Form.Label>
              <Col sm='9'>
                <InputGroup>
                  <Form.Control
                    value={unsavedPreferences.importedCollectionNameFormat}
                    onChange={importedCollectionNameFormatChanged}
                  />
                </InputGroup>
              </Col>
            </Form.Group>
          </div>

          <Form.Group as={Row} className='my-2'>
            <Form.Label column sm='3' className='text-right'>
              Minimize to System Tray
            </Form.Label>
            <Col sm='9' className='d-flex align-items-center'>
              <Form.Check
                id='download-to-songs-folder-checkbox'
                type='checkbox'
                checked={unsavedPreferences.minimizeToTray}
                onChange={minimizeToTrayChanged}
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} className='my-2'>
            <Form.Label column sm='3' className='text-right'>
              Download Complete Notification
            </Form.Label>
            <Col sm='9' className='d-flex align-items-center'>
              <Form.Check
                id='download-to-songs-folder-checkbox'
                type='checkbox'
                checked={unsavedPreferences.notifyOnDownloadsComplete}
                onChange={notifyOnDownloadsCompleteChanged}
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} className='my-2'>
            <Form.Label column sm='3' className='text-right'>
              Download using HTTP
            </Form.Label>
            <Col sm='9' className='d-flex align-items-center'>
              <Form.Check
                id='download-to-songs-folder-checkbox'
                type='checkbox'
                checked={unsavedPreferences.useHttp}
                onChange={useHttpChanged}
              />
            </Col>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button className='text-secondary' size='sm' variant='link' onClick={showLogsClicked}>
          Show logs
        </Button>
        <Button className='text-secondary' size='sm' variant='link' onClick={openDevToolsClicked}>
          Open Chrome DevTools
        </Button>
        <Button onClick={() => setPreferencesModalIsOpen(false)} variant='secondary'>
          Cancel
        </Button>
        <Button onClick={applyClicked}>Apply</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default PreferencesModal
