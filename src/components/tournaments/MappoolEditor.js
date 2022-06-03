/* eslint-disable no-unused-vars */
import { useContext, useState } from 'react'
import { Form } from '../bootstrap-osu-collector'
import styled, { css, ThemeContext } from 'styled-components'

function MappoolEditor({ mappoolText, setMappoolText, mappoolError }) {
  const theme = useContext(ThemeContext)

  return (
    <>
      <Form.Control
        style={formControlStyle(theme, mappoolError)}
        as='textarea'
        spellCheck={false}
        rows={mappoolText.split(/\r\n|\r|\n/).length}
        onChange={(e) => {
          e.target.style.height = ''
          e.target.style.height = e.target.scrollHeight + 3 + 'px'
          setMappoolText(e.target.value)
        }}
        value={mappoolText}
        isInvalid={mappoolError}
      />
      <Form.Control.Feedback type='invalid'>
        <span style={{ fontSize: 17 }}>{mappoolError}</span>
      </Form.Control.Feedback>
    </>
  )
}

const formControlStyle = (theme, isInvalid) => ({
  width: '100%',
  borderRadius: '5px',
  ...(theme.darkMode && {
    backgroundColor: theme.primary20,
    borderColor: isInvalid ? '#dc3545' : theme.primary40,
    color: theme.light,
  }),
})

export default MappoolEditor
