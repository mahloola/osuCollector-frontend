import { useState, useEffect } from 'react';
import { Spinner, Pagination, Button, ButtonGroup } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom';
import { getPopularCollections } from '../../utils/api'
import { useQuery } from '../../utils/hooks';
import CollectionList from '../common/CollectionList';

function Popular() {

    const [loading, setLoading] = useState(true); // basically a flag
    const [collectionPage, setCollectionPage] = useState(null);
    const [dateRange, setDateRange] = useState('alltime');
    const [page, setPage] = useState(0);
    const query = useQuery();
    const history = useHistory();

    // get query params on initial page load
    useEffect(() => {
        setDateRange(query.get('range') || 'alltime');
        setPage(query.get('page') || 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // run this code when page changes
    useEffect(() => {
        if (page <= 0)
            return;
        getPopularCollections(dateRange, page)
            .then(collectionPage => {
                setLoading(false);
                setCollectionPage(collectionPage);
            }).catch(err => {
                setLoading(false);
                console.log('Unable to fetch collections: ', err);
            });
    }, [page, dateRange])

    const goToPage = (dateRange, page) => {
        history.push(`/popular?range=${dateRange}&page=${page}`);
        setPage(page);
    }

    if (loading) {
        return (
            <div className="d-flex justify-content-center">
                <Spinner animation="border" />
            </div>
        )
    } else if (collectionPage && Array.isArray(collectionPage.collections)) {
        const nextPage = collectionPage.nextPage;
        const lastPage = collectionPage.lastPage;
        return (
            <div>
                <h1>
                    Popular Collections
                </h1>
                <ButtonGroup className='mb-3'>
                    <Link to='/popular?range=today'>
                        <Button size='sm' variant='outline-secondary'>today</Button>
                    </Link>
                    <Link to='/popular?range=week'>
                        <Button size='sm' variant='outline-secondary'>this week</Button>
                    </Link>
                    <Link to='/popular?range=month'>
                        <Button size='sm' variant='outline-secondary'>this month</Button>
                    </Link>
                    <Link to='/popular?range=year'>
                        <Button size='sm' variant='outline-secondary'>this year</Button>
                    </Link>
                    <Link to='/popular?range=alltime'>
                        <Button size='sm' variant='outline-secondary'>ALL TIME</Button>
                    </Link>
                </ButtonGroup>
                <br/>
                <CollectionList collections={collectionPage.collections}></CollectionList>
                <div className="d-flex justify-content-center">
                    <Pagination className="text-center" size="lg">
                        <Pagination.First className={page > 1 ? '' : 'disabled'} onClick={() => goToPage(dateRange, 1)} />
                        <Pagination.Prev className={page > 1 ? '' : 'disabled'} onClick={() => goToPage(dateRange, page - 1)} />
                        <Pagination.Item className='disabled'>{page}</Pagination.Item>
                        <Pagination.Next className={nextPage ? '' : 'disabled'} onClick={() => goToPage(dateRange, nextPage)} />
                        <Pagination.Last className={nextPage && lastPage ? '' : 'disabled'} onClick={() => goToPage(dateRange, lastPage)} />
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

export default Popular;