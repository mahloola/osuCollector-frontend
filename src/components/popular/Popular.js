import { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom';
import { Card, Button, Container } from '../bootstrap-osu-collector'
import { getPopularCollections } from '../../utils/api'
import { useQuery } from '../../utils/hooks'
import CollectionList from '../common/CollectionList';

function Popular() {

    const [range, setRange] = useState('alltime')
    const [collectionPage, setCollectionPage] = useState(null)
    const [collections, setCollections] = useState(new Array(18).fill(null))
    const query = useQuery()
    const history = useHistory()

    useEffect(() => {
        const queryParamRange = query.get('range')
        if (queryParamRange) {
            setRange(queryParamRange)
        }
    }, [])

    useEffect(() => {
        // retrieve the first page of results after date range is changed
        getPopularCollections(range, undefined, 18).then(_collectionPage => {
            setCollectionPage(_collectionPage)
            setCollections(_collectionPage.collections)
        })
            .catch(err => {
                console.log('Unable to fetch popular collections: ', err)
                // An error occurred with the server. Please try refreshing the page
                getPopularCollections(range, undefined, 18).then(_collectionPage => {
                    setCollectionPage(_collectionPage)
                    setCollections(_collectionPage.collections)
                })
                    .catch(err => {
                        console.log('Unable to fetch popular collections: ', err)
                    })
            })
    }, [range])

    const loadMore = async () => {
        try {
            const _collectionPage = await getPopularCollections(range, collectionPage.nextPageCursor, 18)
            setCollectionPage(_collectionPage)
            setCollections([...collections, ..._collectionPage.collections])
        } catch (err) {
            console.log(err)
        }
    }

    const dateRanges = [
        { range: 'today', label: 'today' },
        { range: 'week', label: 'this week' },
        { range: 'month', label: 'this month' },
        { range: 'year', label: 'this year' },
        { range: 'alltime', label: 'all time' }
    ]

    return (
        <Container className='pt-4'>
            <Card className='shadow-lg'>
                <Card.Body>
                    <div className="d-flex justify-content-left align-items-center p-2 pb-0" >
                        <h2 className='mt-2 ml-2 mr-5'>
                            <i className="fas fa-fire mr-3" style={{ color: 'orange' }} />
                            Popular Collections
                        </h2>
                        <div>
                            {dateRanges.map((opt, i) =>
                                <Button
                                    key={i}
                                    className='mx-1'
                                    disabled={range === opt.range}
                                    onClick={() => {
                                        setCollectionPage(null)
                                        setCollections(new Array(18).fill(null))
                                        history.push(`/popular?range=${opt.range}`)
                                        setRange(opt.range)
                                    }}
                                    variant={range === opt.range ? 'danger' : 'outline-secondary'}
                                >
                                    {opt.label}
                                </Button>
                            )}
                        </div>
                    </div>
                    <CollectionList
                        collections={collections}
                        hasMore={collectionPage?.hasMore}
                        loadMore={loadMore}
                    />
                </Card.Body>
            </Card>
        </Container>
    )
}

export default Popular