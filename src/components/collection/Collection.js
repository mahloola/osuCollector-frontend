import React from 'react';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Card, Table, Spinner, Button } from 'react-bootstrap';
import { Redirect } from 'react-router-dom'
import * as api from '../../utils/api';

function Collection() {

    let { id } = useParams();
    const [collection, setCollection] = useState(null);
    const [beatmaps, setBeatmaps] = useState(null);
    const [loading, setLoading] = useState(true);

    // GET collection
    useEffect(() => {
        api.getCollection(id)
            .then(data => {
                setLoading(false);
                setCollection(data);
            })
            .catch(err => console.log('Unable to fetch collections: ', err));
    }, [])

    // GET collection beatmaps
    useEffect(() => {
        api.getCollectionBeatmaps(id)
            .then(data => {
                setLoading(false);
                setBeatmaps(data.beatmaps);
                console.log(beatmaps);
            })
            .catch(err => console.log('Unable to fetch collections: ', err));
    }, []);



    if (!loading) {
        if (collection != null && beatmaps != null) {
            return (
                <div>
                    <Card style={{ padding: "20px" }}>
                        <Card.Title>
                            <h1>
                                {collection.name}
                            </h1>
                        </Card.Title>
                        <Card.Subtitle class="d-flex justify-content-between">
                            <h3>
                                Uploaded by {collection.uploader.username}
                                <br />
                                {collection.beatmapCount} maps
                            </h3>
                        </Card.Subtitle>
                        {/*TODO: change this; this is only for testing*/}
                        <Button
                            onClick={async () => api.favouriteCollection(collection.id)}
                            variant="outline-primary">
                            Add to favourites
                        </Button>
                        <Button
                            onClick={async () => api.unfavouriteCollection(collection.id)}
                            variant="outline-danger">
                            Remove from favourites
                        </Button>
                        {/* MAPS */}
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Artist - Title</th>
                                    <th>Difficulty</th>
                                    <th>Star Rating</th>
                                </tr>
                            </thead>
                            <tbody>
                                {beatmaps.map(function (beatmap, i) {
                                    return (
                                        <tr onClick={() => { <Redirect to="osu.ppy.sh" /> }}>
                                            <td>{i + 1}</td>
                                            <td>{beatmap.beatmapset.artist} - {beatmap.beatmapset.title}</td>
                                            <td>{beatmap.version}</td>
                                            <td>{beatmap.difficulty_rating}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </Table>
                    </Card>
                    <br /><br />
                </div>
            )
        }
        else {
            return (
                <div>
                    <div class="d-flex justify-content-center">
                        <Spinner animation="border" />
                    </div>
                </div>
            )
        }
    }
    else {
        return (
            <div>
                {/* Data not found! */}
            </div>

        )
    }
}

export default Collection;