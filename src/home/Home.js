import React from 'react';
import { useState, useEffect, useHistory } from 'react';
import { Spinner, Table } from 'react-bootstrap';
import { Pagination } from 'react-bootstrap';

function Home() {

    const [loading, setLoading] = useState(true); // basically a flag
    const [collections, setCollections] = useState(null);
    const [page, setPage] = useState(1);
    const perPage = 10;

    // run this code block when the second parameter (page) changes in value
    useEffect(() => {
        setLoading(true);
        // heroku API request (ITS SO SLOW)
        fetch('https://osucollectorapi.herokuapp.com/api/collections')
            .then(res => res.json())
            .then(data => {
                setLoading(false);
                setCollections(data);
                console.log(collections);
            })
            .catch(err => console.log('Unable to fetch collections: ', err));
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
        if (collections) {
            return (
                <div>
                    <br />
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Collection</th>
                                <th>Uploader</th>
                                <th>Beatmap Count</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                collections.map((collections) => (
                                    <tr key={collections._id}>
                                        <td>{collections._id}</td>
                                        <td>{collections.name}</td>
                                        <td>{collections.uploader}</td>
                                        <td>{(collections.beatmaps).length}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </Table>
                    <div class="d-flex justify-content-center">
                        <Pagination class="text-center" size="lg">
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
            <div class="d-flex justify-content-center">
                <Spinner animation="border" />
            </div>
        )
    }
}

export default Home;