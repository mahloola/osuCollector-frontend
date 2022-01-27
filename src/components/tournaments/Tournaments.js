import { Alert, Card, Container } from 'components/bootstrap-osu-collector'
import { useEffect, useState } from 'react';
import { getTournaments } from 'utils/api';
import TournamentList from './TournamentList'

function Tournaments() {


    const [tournamentPage, setTournamentPage] = useState(null);
    const [tournaments, setTournaments] = useState(new Array(18).fill(null));
    const [error, setError] = useState(null)
    const loadMore = () => {
        alert('loadMore')
    }

    useEffect(() => {
        let cancel
        getTournaments(c => cancel = c).then(_tournamentPage => {
            setTournamentPage(_tournamentPage)
            setTournaments(_tournamentPage.tournaments)
        }).catch(setError)
        return cancel
    }, [])

    return (
        <Container className='pt-4'>
            <Card className='shadow-lg'>
                <Card.Body>
                    <h2 className='my-2 ml-3'>
                        Tournaments
                    </h2>
                    {error ?
                        <Alert variant='danger'>
                            <p>
                                Sorry, an error occurred with the server. Please try refreshing the page. Error details:
                            </p>
                            <p>{error.toString()}</p>
                        </Alert>
                        :
                        <TournamentList
                            tournaments={tournaments}
                            hasMore={tournamentPage?.hasMore}
                            loadMore={loadMore}
                        />
                    }
                </Card.Body>
            </Card>
        </Container>
    )
}

export default Tournaments
