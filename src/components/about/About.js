import { Card } from 'react-bootstrap';

function About() {
    return (
        <div>
            <Card>
                <Card.Body>
                    <Card.Title>
                        <h1>
                            About
                        </h1>
                    </Card.Title>
                    <Card.Subtitle>
                        <h5>
                        The idea of osu!collector is to allow osu! players to perform CRUD operations (Create, Read, Update, Delete) on beatmap collections.
                        <br/>
                        Currently there is little support for collection sharing/editing (they are encoded into one collections.db file).
                        <br/>
                        osu!collector is run by <a href="https://twitter.com/mahloola" style={{textDecoration: "none"}}>myself</a> (mahloola) working on the front end and <a href="https://twitter.com/FunOrange42" style={{textDecoration: "none"}}>FunOrange</a> working on the back end.
                        <br/>
                        I sure hope we can finish this in a reasonable amount of time 😭
                        </h5>
                        
                    </Card.Subtitle>
                </Card.Body>
            </Card>
        </div>
    )
}

export default About;