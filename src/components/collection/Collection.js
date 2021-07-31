import React from 'react';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Card, Table, Spinner } from 'react-bootstrap';
import { Redirect } from 'react-router-dom'
import { getCollection, getCollectionBeatmaps } from '../../utils/api';

function Collection() {

    let { id } = useParams();
    const [collection, setCollection] = useState(null);
    const [beatmaps, setBeatmaps] = useState(null);
    const [loading, setLoading] = useState(true);

    // GET collection
    useEffect(() => {
        getCollection(id)
            .then(data => {
                setLoading(false);
                setCollection(data);
            })
            .catch(err => console.log('Unable to fetch collections: ', err));
    }, [])

    // GET collection beatmaps
    useEffect(() => {
        getCollectionBeatmaps(id)
            .then(data => {
                setLoading(false);
                setBeatmaps(data);
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
                                Uploaded by {collection.uploader}
                                <br />
                                {collection.beatmaps.length} maps
                            </h3>
                        </Card.Subtitle>
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