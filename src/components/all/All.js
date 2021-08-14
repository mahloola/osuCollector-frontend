import { useState, useEffect } from 'react';
import { Spinner, Pagination } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { searchCollections } from '../../utils/api'
import { useQuery } from '../../utils/hooks';
import CollectionList from '../common/CollectionList';

function All({ searchText }) {

    const [loading, setLoading] = useState(true); // basically a flag
    const [collectionPage, setCollectionPage] = useState(null);
    const [page, setPage] = useState(0);
    const query = useQuery();
    const history = useHistory();

    // get query params on initial page load
    useEffect(() => {
        setPage(query.get('page') || 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // run this code when searchText or page changes
    useEffect(() => {
        if (page <= 0)
            return;

        setLoading(true)
        searchCollections(searchText, page).then(collectionPage => {
            setLoading(false);
            setCollectionPage(collectionPage);
            if (searchText.trim() === '') {
                history.push(`/all?page=${page}`)
            } else {
                history.push(`/all?search=${encodeURIComponent(searchText)}&page=${page}`)
            }
        }).catch(err => {
            setLoading(false);
            console.log('Unable to fetch collections: ', err);
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, searchText])

    const goToPage = (searchText, page) => {
        history.push(`/all?search=${encodeURIComponent(searchText)}&page=${page}`);
        setPage(page);
    }

    if (loading) {
        return (
            <div>
                <h1 className='font-italic'>
                    {searchText}
                </h1>
                <div className="d-flex justify-content-center">
                    <Spinner animation="border" />
                </div>
            </div>
        )
    } else if (collectionPage && Array.isArray(collectionPage.collections)) {
        const nextPage = collectionPage.nextPage;
        const lastPage = collectionPage.lastPage;
        return (
            <div>
                <h1 className='font-italic'>
                    {searchText}
                </h1>
                <br/>
                <CollectionList collections={collectionPage.collections}></CollectionList>
                <div className="d-flex justify-content-center">
                    <Pagination className="text-center" size="lg">
                        <Pagination.First className={page > 1 ? '' : 'disabled'} onClick={() => goToPage(searchText, 1)} />
                        <Pagination.Prev className={page > 1 ? '' : 'disabled'} onClick={() => goToPage(searchText, page - 1)} />
                        <Pagination.Item className='disabled'>{page}</Pagination.Item>
                        <Pagination.Next className={nextPage ? '' : 'disabled'} onClick={() => goToPage(searchText, nextPage)} />
                        <Pagination.Last className={nextPage && lastPage ? '' : 'disabled'} onClick={() => goToPage(searchText, lastPage)} />
                    </Pagination>
                </div>
            </div>
        )
    } else {
        return (
            <h1>
                No collections found!
            </h1>
        )
    }
}

export default All;