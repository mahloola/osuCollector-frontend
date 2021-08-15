import { useParams, useHistory } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Card, Pagination, Spinner, Button } from 'react-bootstrap';
import * as api from '../../utils/api';
import { useQuery } from '../../utils/hooks';
import BeatmapList from './BeatmapList';

function Collection() {

    let { id } = useParams();
    const [collection, setCollection] = useState(null);
    const [page, setPage] = useState(0);
    const [beatmapPage, setBeatmapPage] = useState(null);
    const [loading, setLoading] = useState(true);
    const query = useQuery();
    const history = useHistory();

    // run this code on initial load
    useEffect(() => {
        // GET collection
        api.getCollection(id).then(collection => {
            setCollection(collection);
            // get page from query params
            setPage(query.get('page') || 1);
        }).catch(err => {
            console.log('Unable to fetch collections: ', err)
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // GET beatmaps
    useEffect(() => {
        if (page <= 0)
            return
        api.getCollectionBeatmaps(id, page).then(beatmapPage => {
            setLoading(false);
            setBeatmapPage(beatmapPage);
        }).catch(err => {
            console.log('Unable to fetch collections: ', err)
        });
    }, [id, page]);

    const goToPage = (page) => {
        history.push(`/collections/${id}?page=${page}`);
        setPage(page);
    }

    if (loading) {
        return (
            <div>
                <div className="d-flex justify-content-center">
                    <Spinner animation="border" />
                </div>
            </div>
        )
    }

    if (!collection) {
        return (
            <h1>
                Collection not found!
            </h1>
        )
    }

    const nextPage = beatmapPage ? beatmapPage.nextPage : 0;
    const lastPage = beatmapPage ? beatmapPage.lastPage : 0;
    return (
        <div>
            <Card style={{ padding: "20px" }}>
                <Card.Title>
                    <h1>
                        {collection.name}
                    </h1>
                </Card.Title>
                <Card.Subtitle className="d-flex justify-content-between">
                    <h3>
                        Uploaded by {collection.uploader.username}
                        <br/>
                        {collection.beatmapCount} maps {collection.unsubmittedBeatmapCount > 0 ? `(${collection.unsubmittedBeatmapCount} unsubmitted diffs not shown)` : ''}
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
                {beatmapPage ? (
                    <>
                        <BeatmapList beatmaps={beatmapPage.beatmaps}></BeatmapList>
                        <div className="d-flex justify-content-center">
                            <Pagination className="text-center" size="lg">
                                <Pagination.First className={page > 1 ? '' : 'disabled'} onClick={() => goToPage(1)} />
                                <Pagination.Prev className={page > 1 ? '' : 'disabled'} onClick={() => goToPage(page - 1)} />
                                <Pagination.Item className='disabled'>{page}</Pagination.Item>
                                <Pagination.Next className={nextPage ? '' : 'disabled'} onClick={() => goToPage(nextPage)} />
                                <Pagination.Last className={nextPage && lastPage  ? '' : 'disabled'} onClick={() => goToPage(lastPage)} />
                            </Pagination>
                        </div>
                    </>
                ) : (
                    <div>
                        <div className="d-flex justify-content-center">
                            <Spinner animation="border" />
                        </div>
                    </div>
                )}
            </Card>
            <br/><br/>
        </div>
    )
}

export default Collection;