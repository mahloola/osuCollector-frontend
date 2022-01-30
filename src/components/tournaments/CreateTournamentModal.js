import { useContext } from 'react'
import FloatingLabel from 'react-bootstrap-floating-label'
import styled, { css, ThemeContext } from 'styled-components'
import { Modal, ModalBody, Form } from '../bootstrap-osu-collector'

function CreateTournamentModal({ showCreateTournamentModal, setShowCreateTournamentModal }) {
  const theme = useContext(ThemeContext)
  return (
    <Modal show={showCreateTournamentModal} onHide={() => setShowCreateTournamentModal(false)} size='xl' centered>
      <ModalBody className='px-5 py-4'>
        <h1 className='text-muted mb-4'>Create Tournament</h1>
        <Form>
          <h3>Details</h3>

          <S.FloatingLabel label='Tournament name' className='mb-3'>
            <Form.Control />
          </S.FloatingLabel>

          <S.FloatingLabel label='Tournament URL' className='mb-3'>
            <Form.Control />
          </S.FloatingLabel>

          <S.FloatingLabel label='Banner URL' className='mb-3'>
            <Form.Control />
          </S.FloatingLabel>

          <S.FloatingLabel label='Organizers'>
            <Form.Control />
          </S.FloatingLabel>
          <Form.Text muted className='mb-3'>
            Optional: Organizers have permission to make changes to this tournament
          </Form.Text>

          <Form.Group className='mb-3' controlId='exampleForm.ControlTextarea1'>
            <Form.Label className='text-muted'>Description</Form.Label>
            <Form.Control style={formControlStyle(theme)} as='textarea' rows={2} />
            <Form.Text muted className='mb-3'>
              Keep it short; for more information users should visit the tournament URL
            </Form.Text>
          </Form.Group>

          <h3>Mappool</h3>
          <Form.Text muted className='mb-3'>
            A mappool template is provided below. Please modify it to include the maps in the tournament.
          </Form.Text>
        </Form>
      </ModalBody>
    </Modal>
  )
}

const S = {}
S.FloatingLabel = styled(FloatingLabel)`
  ${({ theme }) =>
    theme.darkMode &&
    css`
      & > input {
        background-color: ${({ theme }) => theme.primary20};
        border-color: ${({ theme }) => theme.primary40};
        color: ${({ theme }) => theme.light};
        &:focus {
          background-color: ${({ theme }) => theme.primary20};
          border: 0;
          color: ${({ theme }) => theme.light};
        }
      }
      & > label {
        color: #6c757d;
      }
    `};
`

const formControlStyle = (theme) =>
  theme.darkMode
    ? {
        backgroundColor: theme.primary20,
        borderColor: theme.primary40,
        color: theme.light,
      }
    : {}

S.FormControl = styled(Form.Label)`
  ${({ theme }) =>
    theme.darkMode &&
    css`
      background-color: ${({ theme }) => theme.primary20};
      border-color: ${({ theme }) => theme.primary40};
      color: ${({ theme }) => theme.light};
      &:focus {
        background-color: ${({ theme }) => theme.primary20};
        border: 0;
        color: ${({ theme }) => theme.light};
      }
    `};
`

export default CreateTournamentModal
