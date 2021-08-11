import { useState, useEffect } from 'react';
import { Spinner, Pagination } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { getRecentCollections } from '../../utils/api'
import { useQuery } from '../../utils/hooks';
import CollectionList from '../common/CollectionList';

function Recent() {

    const [loading, setLoading] = useState(true); // basically a flag
    const [collectionPage, setCollectionPage] = useState(null);
    const [page, setPage] = useState(0);
    const query = useQuery();
    const history = useHistory();

    // run this code on initial page load
    useEffect(() => {
        // get page from query params
        setPage(query.get('page') || 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // run this code when page changes
    useEffect(() => {
        if (page <= 0)
            return;
        getRecentCollections(page)
            .then(collectionPage => {
                setLoading(false);
                setCollectionPage(collectionPage);
            }).catch(err => {
                setLoading(false);
                console.log('Unable to fetch collections: ', err);
            });
    }, [page])


    const goToPage = (page) => {
        history.push(`/recent?page=${page}`);
        setPage(page);
    }

    if (loading) {
        return (
            <div className="d-flex justify-content-center">
                <Spinner animation="border" />
            </div>
        )
    }
    if (collectionPage && Array.isArray(collectionPage.collections)) {
        const nextPage = collectionPage.nextPage;
        const lastPage = collectionPage.lastPage;
        return (
            <div>
                <h1>
                    Recent Collections
                </h1>
                <br/>
                <CollectionList collections={collectionPage.collections}></CollectionList>
                <div className="d-flex justify-content-center">
                    <Pagination className="text-center" size="lg">
                        <Pagination.First className={page > 1 ? '' : 'disabled'} onClick={() => goToPage(1)} />
                        <Pagination.Prev className={page > 1 ? '' : 'disabled'} onClick={() => goToPage(page - 1)} />
                        <Pagination.Item className='disabled'>{page}</Pagination.Item>
                        <Pagination.Next className={nextPage ? '' : 'disabled'} onClick={() => goToPage(nextPage)} />
                        <Pagination.Next className={nextPage && lastPage ? '' : 'disabled'} onClick={() => goToPage(lastPage)} />
                    </Pagination>
                </div>
            </div>
        )
    }
    return (
        <h1>
            No collections found!
        </h1>
    )
}

export default Recent;