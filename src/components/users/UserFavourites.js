import { useState, useEffect } from 'react';
import { Spinner } from 'react-bootstrap';
import { getUserFavourites } from '../../utils/api'
import CollectionList from '../common/CollectionList';
import * as api from '../../utils/api'

function UserFavourites() {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [collections, setCollections] = useState(null);

    // run this code on initial page load
    useEffect(async () => {

        // get user id from path, eg. /users/123/favourites
        const match = window.location.pathname.match(/^\/users\/(\d+)\/favourites/g)
        if (!match) { 
            alert('User not found.')
            setLoading(false)
            return
        }
        const userId = Number(match[0].replace('/users/', '').replace('/favourites', '').trim())

        // get user from database
        const user = await api.getUser(userId)
        if (user)
            setUser(user)
        else
            alert(`user with id ${userId} not found`)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // run this code when page changes
    useEffect(() => {
        if (!user)
            return;
        getUserFavourites(user.id)
            .then(collections => {
                setLoading(false);
                setCollections(collections);
            }).catch(err => {
                setLoading(false);
                console.log('Unable to fetch collections: ', err);
            });
    }, [user])

    if (loading) {
        return (
            <div className="d-flex justify-content-center">
                <Spinner animation="border" />
            </div>
        )
    }
    if (collections && Array.isArray(collections)) {
        return (
            <div>
                <h1>
                    {user.osuweb.username}&apos;s Favourites
                </h1>
                <br/>
                <CollectionList collections={collections}></CollectionList>
            </div>
        )
    }
    return (
        <h1>
            No collections found!
        </h1>
    )
}

export default UserFavourites;