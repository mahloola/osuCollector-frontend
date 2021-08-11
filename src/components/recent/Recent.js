import React from 'react';
import { useState, useEffect } from 'react';
import { Spinner } from 'react-bootstrap';
import { Pagination } from 'react-bootstrap';
import { getRecentCollections } from '../../utils/api'
import CollectionList from '../common/CollectionList';

function Recent() {

    const [loading, setLoading] = useState(true); // basically a flag
    const [collections, setCollections] = useState(null);
    const [page, setPage] = useState(1);

    // run this code when on initial page load
    useEffect(() => {
        console.log('onload')
    })

    // run this code block when the second parameter (page) changes in value
    useEffect(() => {
        setLoading(true);
        // GET recent collections
        getRecentCollections(page)
            .then(data => {
                setLoading(false);
                setCollections(data.collections);
            }).catch(err =>
                console.log('Unable to fetch collections: ', err)
            );
    }, [page])

    function previousPage() {
        if (page > 1) {
            setPage(page - 1);
        }
    }

    function nextPage() {
        setPage(page + 1);
        console.log(page);
    }

    if (!loading) {
        if (Array.isArray(collections)) {
            return (
                <div>
                    <br />
                    <CollectionList collections={collections}></CollectionList>
                    <div className="d-flex justify-content-center">
                        <Pagination className="text-center" size="lg">
                            {/* <Pagination.First onClick={setPage(1)}/> */}
                            <Pagination.Prev onClick={previousPage} />
                            <Pagination.Item>{page}</Pagination.Item>
                            <Pagination.Next onClick={nextPage} />
                            {/* <Pagination.Last onClick={setPage(5)}/> */}
                        </Pagination>
                    </div>
                </div>
            )
        }
        else {
            return (
                <h1>
                    No collections found!
                </h1>
            )
        }
    }
    else {
        return (
            <div className="d-flex justify-content-center">
                <Spinner animation="border" />
            </div>
        )
    }
}

export default Recent;