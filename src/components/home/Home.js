import { useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';
//import { Card, Col, Container, Row } from 'react-bootstrap';
import * as api from '../../utils/api'
import './Home.css';

function Home() {
    const [metadata, setMetadata] = useState(null);

    useEffect(async () => {
        setMetadata(await api.getMetadata());
    }, [])

    return (
        <div>
            <div id="bg-hero">
                <div id="osu-bg-hero">
                    osu!
                </div>
                Collector
            </div>
            <div id="hero">
                <div id="osu-hero">
                    osu!
                </div>
                Collector
            </div>


            <div id="footer">
                <div id="footerUsers">
                    {metadata ?
                        <div id="footerUsersHeader">
                            {metadata.userCount}
                        </div>
                        :
                        <div id="footerUsersHeader">
                            <Spinner animation="border" />
                        </div>
                    }
                    <div id="footerUsersSubheader">
                        Users
                    </div>
                </div>
                <div id="footerCollections">
                    {metadata ?
                        <div id="footerCollectionsHeader">
                            {metadata.totalCollections}
                        </div>
                        :
                        <div id="footerCollectionsHeader">
                            <Spinner animation="border" />
                        </div>
                    }
                    <div id="footerCollectionsSubheader">
                        Collections
                    </div>
                </div>

            </div>

        </div>
    )
}

export default Home;