import { Alert, Button, Card, Container, Form, FormControl, InputGroup } from 'components/bootstrap-osu-collector'
import { useEffect, useRef, useState } from 'react'
import { Plus, Search } from 'react-bootstrap-icons'
import { LinkContainer } from 'react-router-bootstrap'
import styled, { css } from 'styled-components'
import { useRecentTournaments, useSearchTournaments } from 'utils/api'
import TournamentList from './TournamentList'
import { useQuery } from '../../utils/hooks'
import { useHistory } from 'react-router-dom'

/**
 * @typedef {Object} TournamentsQueryParams
 * @property {string} search
 */

function Tournaments() {
  const query = useQuery()
  const usingSearch = !!query.get('search')
  const history = useHistory()
  const {
    recentTournaments,
    recentTournamentsError,
    isValidating: recentIsValidating,
    currentPage: currentRecentPage,
    setCurrentPage: setCurrentRecentPage,
    hasMore: recentHasMore,
  } = useRecentTournaments({ fetchCondition: !usingSearch })
  const {
    searchTournaments,
    searchTournamentsError,
    isValidating: searchIsValidating,
    currentPage: currentSearchPage,
    setCurrentPage: setCurrentSearchPage,
    hasMore: searchHasMore,
  } = useSearchTournaments({ search: query.get('search'), fetchCondition: usingSearch })

  const loadMore = () => {
    if (usingSearch) {
      setCurrentSearchPage(currentSearchPage + 1)
    } else {
      setCurrentRecentPage(currentRecentPage + 1)
    }
  }

  const [searchBarInput, setSearchBarInput] = useState('')
  useEffect(() => {
    setSearchBarInput(query.get('search'))
  }, [query.get('search')])
  const typingTimeoutRef = useRef(null)
  const handleSearchOnChange = (e) => {
    setSearchBarInput(e.target.value)
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
    typingTimeoutRef.current = setTimeout(() => {
      const params = new URLSearchParams({ search: e.target.value.trim() })
      history.replace({ pathname: location.pathname, search: e.target.value ? params.toString() : undefined })
    }, 300)
  }

  const error = recentTournamentsError || searchTournamentsError
  return (
    <Container className='pt-4'>
      <Card className='shadow-lg'>
        <Card.Body>
          <Alert variant='info' className='text-center'>
            This feature is still a work in progress, however feel free to poke around.
          </Alert>
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
          <Form onSubmit={() => {}} className='ml-3 me-auto'>
            <InputGroup>
              <S.FormControl
                value={searchBarInput}
                onChange={handleSearchOnChange}
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
              <p>Sorry, there was an error retrieving tournaments. Please try refreshing the page. Error details:</p>
              <p>{error.toString()}</p>
            </Alert>
          ) : (
            <TournamentList
              tournaments={usingSearch ? searchTournaments : recentTournaments}
              hasMore={usingSearch ? searchHasMore : recentHasMore}
              loadMore={loadMore}
            />
          )}
        </Card.Body>
      </Card>
    </Container>
  )
}

const S = {}
S.FormControl = styled(FormControl)`
  ${({ theme }) =>
    theme.darkMode &&
    css`
      background-color: ${({ theme }) => theme.primary20};
      border-color: ${({ theme }) => theme.primary40};
      color: #f8f8f2;
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
