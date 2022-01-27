/* eslint-disable no-unused-vars */
// @ts-nocheck
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Container } from '../bootstrap-osu-collector';
import Alert from 'react-bootstrap/Alert'
import * as api from '../../utils/api';

function Tournament() {

    let { id } = useParams()
    const [tournament, setTournament] = useState(undefined)
    const [favourited, setFavourited] = useState(false)
    const [favourites, setFavourites] = useState(0)
    const [currentlyPlaying, setCurrentlyPlaying] = useState(null)

    // run this code on initial load
    const refreshTournament = (cancelCallback = undefined) => {
        // GET tournament
        api.getTournament(id, cancelCallback).then(tournament => {
            setTournament(tournament)
            setFavourited(tournament.favouritedByUser)
            setFavourites(tournament.favourites)
        }).catch(console.log)
    }
    useEffect(() => {
        let cancel
        refreshTournament(c => cancel = c)
        return cancel
    }, [])

    // message modal
    const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState(false)
    const [deleting, setDeleting] = useState(false)

    const deleteTournament = async () => {
        setDeleting(true)
        const result = await api.deleteTournament(tournament.id)
        setDeleting(false)
        setShowDeleteConfirmationModal(false)
        if (result) {
            setTournamentSuccessfullyDeleted(true)
        } else {
            alert('Delete failed. Check console for more info.')
        }
    }

    const [tournamentSuccessfullyDeleted, setTournamentSuccessfullyDeleted] = useState(false)
    if (tournamentSuccessfullyDeleted) {
        return (
            <Alert variant="danger">
                <Alert.Heading className='text-center m-0'>Tournament deleted</Alert.Heading>
            </Alert>
        )
    }

    if (tournament === null) {
        return (
            <h1>
                Tournament not found!
            </h1>
        )
    }
    return (
        <Container className='pt-4'>
            {/* collection metadata */}
            {/* beatmaps */}
        </Container>
    )
}

export default Tournament;