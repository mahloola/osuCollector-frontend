import { useState, useEffect } from 'react';
import { Card, Alert, Container } from '../bootstrap-osu-collector';
import { getRecentCollections } from '../../utils/api'
import CollectionList from '../common/CollectionList';

function Recent() {

    const [collectionPage, setCollectionPage] = useState(null);
    const [collections, setCollections] = useState(new Array(18).fill(null));
    const [error, setError] = useState(null)

    useEffect(() => {
        getRecentCollections(undefined, 18)
            .then(_collectionPage => {
                setCollectionPage(_collectionPage)
                setCollections(_collectionPage.collections)
            })
            .catch(err => {
                setError(err)
            })
    }, [])

    const loadMore = async () => {
        try {
            const _collectionPage = await getRecentCollections(collectionPage.nextPageCursor, 18)
            setCollectionPage(_collectionPage)
            setCollections([...collections, ..._collectionPage.collections])
        } catch (err) {
            setError(err)
        }
    }

    return (
        <Container className='pt-4'>
            <Card className='shadow-lg'>
                <Card.Body>
                    <h2 className='my-2 ml-3'>
                        Recent Collections
                    </h2>
                    {error ?
                        <Alert variant='danger'>
                            <p>
                                Sorry, an error occurred with the server. Please try refreshing the page. Error details:
                            </p>
                            <p>{error.toString()}</p>
                        </Alert>
                        :
                        <CollectionList
                            collections={collections}
                            hasMore={collectionPage?.hasMore}
                            loadMore={loadMore}
                        />
                    }
                </Card.Body>
            </Card>
        </Container>
    )
}

export default Recent;