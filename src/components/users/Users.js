import { useState, useEffect } from 'react';
import { Spinner, Pagination } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { getUsers } from '../../utils/api'
import { useQuery } from '../../utils/hooks';
import UserList from './UserList';

function Users() {

    const [loading, setLoading] = useState(true); // basically a flag
    const [userResults, setUserResults] = useState(null)
    const [page, setPage] = useState(0);
    const query = useQuery();
    const history = useHistory();

    // get query params on initial page load
    useEffect(() => {
        setPage(query.get('page') || 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // run this code when page changes
    useEffect(() => {
        if (page <= 0)
            return;
        getUsers(page).then(paginatedUserData => {
            setLoading(false);
            setUserResults(paginatedUserData);
        }).catch(err => {
            setLoading(false);
            console.log('Unable to fetch collections: ', err);
        });
    }, [page])

    const goToPage = (page) => {
        history.push(`/users?page=${page}`);
        setPage(page);
    }

    if (loading) {
        return (
            <div className="d-flex justify-content-center">
                <Spinner animation="border" />
            </div>
        )
    } else if (userResults && Array.isArray(userResults.users)) {
        const nextPage = userResults.nextPage;
        const lastPage = userResults.lastPage;
        return (
            <div>
                <h1>
                    Users
                </h1>
                <br/>
                <UserList users={userResults.users}></UserList>
                <div className="d-flex justify-content-center">
                    <Pagination className="text-center" size="lg">
                        <Pagination.First className={page > 1 ? '' : 'disabled'} onClick={() => goToPage(1)} />
                        <Pagination.Prev className={page > 1 ? '' : 'disabled'} onClick={() => goToPage(page - 1)} />
                        <Pagination.Item className='disabled'>{page}</Pagination.Item>
                        <Pagination.Next className={nextPage ? '' : 'disabled'} onClick={() => goToPage(nextPage)} />
                        <Pagination.Last className={nextPage && lastPage ? '' : 'disabled'} onClick={() => goToPage(lastPage)} />
                    </Pagination>
                </div>
            </div>
        )
    } else {
        return (
            <h1>
                No users
            </h1>
        )
    }
}

export default Users;