import React from 'react';
import { useState, useEffect } from 'react';
import { Spinner } from 'react-bootstrap';
import { Pagination } from 'react-bootstrap';
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
        const page = collectionPage.currentPage;
        const nextPage = collectionPage.nextPage;
        const lastPage = collectionPage.lastPage;
        return (
            <div>
                <br />
                <CollectionList collections={collectionPage.collections}></CollectionList>
                <div className="d-flex justify-content-center">
                    <Pagination className="text-center" size="lg">
                        {page > 1 && <Pagination.First onClick={() => goToPage(1)}/>}
                        {page > 1 && <Pagination.Prev onClick={() => goToPage(page - 1)}/>}
                        <Pagination.Item>{page}</Pagination.Item>
                        {nextPage && <Pagination.Next onClick={() => goToPage(nextPage)}/>}
                        {nextPage && lastPage && <Pagination.Last onClick={() => goToPage(lastPage)}/>}
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