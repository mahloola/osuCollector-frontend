import { useState } from 'react'
import { Button, Card } from '../bootstrap-osu-collector'
import styled, { css } from 'styled-components'
import './EditableTextbox.css'

const ClickableCard = styled(Card)`
  ${(props) =>
    props.$isClickable &&
    css`
      cursor: pointer;
      &:hover {
        background-color: ${(props) => (props.theme.darkMode ? '#ffffff20' : '#00000020')};
      }
    `}
`

function EditableTextbox({ value, isEditable, submit }) {
  const [editing, setEditing] = useState(false)
  const [unsavedValue, setUnsavedValue] = useState(value)

  const startEdit = () => {
    if (isEditable) {
      setEditing(true)
    }
  }

  const cancelEdit = () => {
    setEditing(false)
  }

  const finishEdit = () => {
    setEditing(false)
    submit(unsavedValue)
  }

  if (editing) {
    return (
      <div>
        <textarea
          className='p-2 mb-1'
          value={unsavedValue}
          maxLength={3000}
          onChange={(event) => setUnsavedValue(event.target.value)}
          style={{
            minHeight: '142px',
            width: '100%',
            boxSizing: 'border-box',
          }}
        />
        <div className='d-flex justify-content-end mb-3'>
          <Button size='sm' variant='secondary' className='mr-2' onClick={cancelEdit}>
            Cancel
          </Button>
          <Button size='sm' onClick={finishEdit}>
            Save
          </Button>
        </div>
      </div>
    )
  } else {
    return (
      <ClickableCard
        className='p-2 mt-2 mb-4'
        $isClickable={isEditable}
        style={{ minHeight: '176px' }}
        onClick={startEdit}
        $lightbg
      >
        {value ? (
          <div style={{ whiteSpace: 'pre-line' }}>{value}</div>
        ) : (
          <small className='text-muted'>
            {' '}
            <i>no description</i>{' '}
          </small>
        )}
      </ClickableCard>
    )
  }
}

export default EditableTextbox
