import { useHistory, useParams } from 'react-router-dom'
import TournamentForm from './TournamentForm'
import * as api from '../../utils/api'
import { useEffect, useState } from 'react'

function EditTournament() {
  let { id } = useParams()
  const history = useHistory()
  const [submitLoading, setSubmitLoading] = useState(false)
  const [tournament, setTournament] = useState(null)

  useEffect(() => {
    let cancel
    // GET tournament
    api
      .getTournament(id, (c) => (cancel = c))
      .then((tournament) => {
        setTournament(tournament)
      })
      .catch(console.error)
    return cancel
  }, [id])

  const editTournament = async (createTournamentDto) => {
    try {
      setSubmitLoading(true)
      const newTournament = await api.editTournament(id, createTournamentDto)
      setSubmitLoading(false)
      history.push(`/tournaments/${newTournament.id}`)
    } catch (err) {
      setSubmitLoading(false)
      alert(err.message)
    }
  }
  return (
    <TournamentForm
      title='Edit Tournament'
      onSubmit={editTournament}
      submitLoading={submitLoading}
      saveDraft={false}
      tournament={tournament}
    />
  )
}

export default EditTournament
