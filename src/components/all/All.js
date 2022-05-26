import { useState, useEffect } from 'react'
import { Card, Container, Image } from '../bootstrap-osu-collector'
import { Search } from 'react-bootstrap-icons'
import { useHistory } from 'react-router-dom'
import { searchCollections } from '../../utils/api'
import { useQuery } from '../../utils/hooks'
import CollectionList from '../common/CollectionList'
import SortButton from '../common/SortButton'
import osuPng from '../common/mode-osu.png'
import taikoPng from '../common/mode-taiko.png'
import maniaPng from '../common/mode-mania.png'
import catchPng from '../common/mode-catch.png'
import { addFavouritedByUserAttribute } from '../../utils/misc'

function All({ searchText, setSearchText, user, setUser }) {
  const [collectionPage, setCollectionPage] = useState(null)
  const [collections, setCollections] = useState(new Array(18).fill(null))
  const [queryOpts, setQueryOpts] = useState(null)
  const query = useQuery()
  const history = useHistory()

  // get query params on initial page load
  useEffect(() => {
    setSearchText(query.get('search') || '')
    setQueryOpts({
      sortBy: query.get('sortBy') || '_text_match',
      orderBy: query.get('orderBy') || 'desc',
    })
  }, [])

  // Get first page of results
  useEffect(() => {
    if (searchText === null || queryOpts === null) {
      return
    }
    let cancel
    setCollectionPage(null)
    setCollections(new Array(18).fill(null))
    searchCollections(
      searchText,
      undefined, // retrieve first page
      18,
      queryOpts.sortBy,
      queryOpts.orderBy,
      (c) => (cancel = c)
    )
      .then((_collectionPage) => {
        setCollectionPage(_collectionPage)
        addFavouritedByUserAttribute(_collectionPage.collections, user)
        setCollections(_collectionPage.collections)
        const qs = []
        if (searchText !== null && searchText !== '') {
          qs.push(`search=${searchText}`)
        }
        if (queryOpts.sortBy) {
          qs.push(`sortBy=${queryOpts.sortBy}`)
        }
        if (queryOpts.orderBy) {
          qs.push(`orderBy=${queryOpts.orderBy}`)
        }
        history.push(`/all?${qs.join('&')}`)
      })
      .catch(console.error)
    return cancel
  }, [searchText, queryOpts])

  const setSortBy = (sortBy) => {
    if (queryOpts.sortBy === sortBy) {
      if (sortBy !== '_text_match') {
        setQueryOpts({
          ...queryOpts,
          orderBy: queryOpts.orderBy === 'asc' ? 'desc' : 'asc',
        })
      }
    } else {
      setQueryOpts({
        ...queryOpts,
        sortBy: sortBy,
        orderBy: 'desc',
        filterMin: undefined,
        filterMax: undefined,
      })
    }
  }

  const loadMore = async () => {
    try {
      const _collectionPage = await searchCollections(
        searchText,
        collectionPage.nextPageCursor,
        18,
        queryOpts.sortBy,
        queryOpts.orderBy
      )
      setCollectionPage(_collectionPage)
      addFavouritedByUserAttribute(_collectionPage.collections, user)
      setCollections([...collections, ..._collectionPage.collections])
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <Container className="pt-4">
      <div>
        <div className="d-flex justify-content-center">
          {searchText?.length > 0 && <h1> {searchText} </h1>}
        </div>
        <div className="d-flex justify-content-center align-items-center pb-4">
          <h3 className="my-0 mr-2">
            {' '}
            <Search />{' '}
          </h3>
          <h3 className="mb-0 mt-1"> {collectionPage?.results} results </h3>
        </div>
        {/* <Card className='p-4 mb-4'>
                    <h5> Filter by tags </h5>
                </Card> */}
        <Card className="shadow-lg">
          <Card.Header>
            <div className="d-flex flex-wrap">
              <div className="p-2 mr-4">Sort by:</div>
              {[
                ['_text_match', 'Relevance'],
                ['favourites', 'Favourites'],
                ['dateUploaded', 'Date'],
              ].map(([field, label]) => (
                <div key={field} className="p-1 mr-2">
                  <SortButton
                    className={undefined}
                    sortDirection={
                      queryOpts === null || queryOpts.sortBy !== field ? null : queryOpts.orderBy
                    }
                    onClick={() => setSortBy(field)}
                  >
                    {label}
                  </SortButton>
                </div>
              ))}
              {[
                ['osuCount', osuPng],
                ['taikoCount', taikoPng],
                ['maniaCount', maniaPng],
                ['catchCount', catchPng],
              ].map(([field, png]) => (
                <div key={field} className="p-1 mr-2">
                  <SortButton
                    className={undefined}
                    sortDirection={
                      queryOpts === null || queryOpts.sortBy !== field ? null : queryOpts.orderBy
                    }
                    onClick={() => setSortBy(field)}
                  >
                    <Image src={png} style={{ width: '16px', height: 'auto' }} className="mr-1" />
                  </SortButton>
                </div>
              ))}
            </div>
          </Card.Header>
          <Card.Body>
            <CollectionList
              collections={collections}
              setCollections={setCollections}
              hasMore={collectionPage?.hasMore}
              loadMore={loadMore}
              user={user}
              setUser={setUser}
            />
          </Card.Body>
        </Card>
      </div>
    </Container>
  )
}

export default All
