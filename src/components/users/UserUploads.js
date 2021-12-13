import { useState, useEffect } from 'react';
import { Card, Container, Image } from '../bootstrap-osu-collector';
import CollectionList from '../common/CollectionList';
import * as api from '../../utils/api'
import ReactPlaceholder from 'react-placeholder/lib';

function UserUploads() {

    const [user, setUser] = useState(null);
    const [collections, setCollections] = useState(new Array(3).fill(null));

    // run this code on initial page load
    useEffect(async () => {

        // get user id from path, eg. /users/123/uploads
        const match = window.location.pathname.match(/\/users\/(\d+)\/uploads/g)
        if (!match) {
            alert('User not found.')
            return
        }
        const userId = Number(match[0].replace('/users/', '').replace('/uploads', '').trim())

        // get user from database
        const user = await api.getUser(userId)
        if (user)
            setUser(user)
        else
            alert(`user with id ${userId} not found`)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // get collections when user changes
    useEffect(() => {
        if (!user)
            return
        let cancel
        api.getUserUploads(user.id, c => cancel = c).then(collections => {
            setCollections(collections)
        }).catch(console.log)
        return cancel
    }, [user])

    return (
        <Container className='pt-4'>
            <Card className='shadow-lg'>
                <Card.Body>
                    <div className='ml-2'>
                        <div className="d-flex justify-content-left align-items-center p-2 pb-0 mb-2" >
                            <ReactPlaceholder
                                ready={user}
                                showLoadingAnimation
                                type='round'
                                className='mr-3'
                                style={{ width: '48px', height: '48px' }}
                            >
                                <Image
                                    className='mr-3 border border-light shadow-sm'
                                    src={`https://a.ppy.sh/${user?.id}`}
                                    roundedCircle
                                    style={{
                                        width: '48px',
                                        height: '48px'
                                    }}
                                />
                            </ReactPlaceholder>
                            <ReactPlaceholder
                                ready={user}
                                showLoadingAnimation
                                type='rect'
                                style={{ width: '300px', height: '40px' }}
                            >
                                <h1 className='mb-0'> {user?.osuweb?.username}&apos;s Uploads </h1>
                            </ReactPlaceholder>
                        </div>
                        <ReactPlaceholder
                            ready={collections.length !== 0 && collections[0] !== null}
                            showLoadingAnimation
                            type='rect'
                            className='ml-2 mb-0 mt-3'
                            style={{ width: '140px', height: '30px' }}
                        >
                            <h4 className='ml-2 mb-0 mt-3'> {collections.length} collections </h4>
                        </ReactPlaceholder>
                    </div>
                    <CollectionList
                        collections={collections}
                        hasMore={false}
                        loadMore={() => 0}
                    />
                </Card.Body>
            </Card>
        </Container>
    )
}

export default UserUploads;