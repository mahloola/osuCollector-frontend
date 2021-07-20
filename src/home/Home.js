import React from 'react';
import { useState } from 'react';
import { Spinner, Table } from 'react-bootstrap';

function Home() {

    const [loading, setLoading] = useState(true); // basically a flag
    const [collections, setCollections] = useState(null);

    // heroku API request
    fetch('https://osucollectorapi.herokuapp.com/api/collections') 
        .then(res => res.json())
        .then(data => {
            setLoading(false);
            setCollections(data);
            console.log(collections);
        })
        .catch(err => console.log('Unable to fetch collections: ', err));

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