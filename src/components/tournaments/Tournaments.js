import { Alert, Button, Card, Container, Form, FormControl, InputGroup } from 'components/bootstrap-osu-collector'
import { useEffect, useState } from 'react'
import { Plus, Search } from 'react-bootstrap-icons'
import { LinkContainer } from 'react-router-bootstrap'
import styled, { css } from 'styled-components'
import { getTournaments } from 'utils/api'
import TournamentList from './TournamentList'

function Tournaments() {
  const [tournamentPage, setTournamentPage] = useState(null)
  const [tournaments, setTournaments] = useState(new Array(18).fill(null))
  const [error, setError] = useState(null)
  const loadMore = () => {
    alert('loadMore')
  }

  const [searchBarInput, setSearchBarInput] = useState('')
  const searchSubmit = (event) => {
    event.preventDefault()
    alert(searchBarInput)
    return false
  }

  useEffect(() => {
    let cancel
    getTournaments((c) => (cancel = c))
      .then((_tournamentPage) => {
        setTournamentPage(_tournamentPage)
        setTournaments(_tournamentPage.tournaments)
      })
      .catch(setError)
    return cancel
  }, [])

  return (
    <>
      <Container className='pt-4'>
        <Card className='shadow-lg'>
          <Card.Body>
            <div className='d-flex justify-content-between align-items-end mb-3'>
              <h2 className='my-2 ml-3 mb-0 mr-4'>Tournaments</h2>
              <LinkContainer to='tournaments/create'>
                <S.CreateButton>
                  <h4 className='my-2 mx-3 text-muted'>
                    <Plus size={28} />
                    <span className='mr-2'>create a tournament</span>
                  </h4>
                </S.CreateButton>
              </LinkContainer>
            </div>
            <Form onSubmit={searchSubmit} className='ml-3 me-auto'>
              <InputGroup>
                <S.FormControl
                  onChange={(e) => setSearchBarInput(e.target.value)}
                  type='search'
                  placeholder='Search for tournaments...'
                />
                <Button type='submit' variant='primary'>
                  <Search />
                </Button>
              </InputGroup>
            </Form>
            {error ? (
              <Alert variant='danger'>
                <p>Sorry, an error occurred with the server. Please try refreshing the page. Error details:</p>
                <p>{error.toString()}</p>
              </Alert>
            ) : (
              <TournamentList tournaments={tournaments} hasMore={tournamentPage?.hasMore} loadMore={loadMore} />
            )}
          </Card.Body>
        </Card>
      </Container>
    </>
  )
}

const S = {}
S.FormControl = styled(FormControl)`
  ${({ theme }) =>
    theme.darkMode &&
    css`
      background-color: ${({ theme }) => theme.primary20};
      border-color: ${({ theme }) => theme.primary40};
      color: ${({ theme }) => theme.light};
      &:focus {
        background-color: ${({ theme }) => theme.primary20};
        border: 0;
        color: #fff;
      }
    `};
`

S.CreateButton = styled.button`
  background-color: transparent;
  color: inherit;
  border: none;
  padding: 0;
  font: inherit;
  cursor: pointer;
  outline: inherit;

  &:hover {
    background-color: #8a8a8a28;
    border-radius: 9999px;
  }
`

export default Tournaments
