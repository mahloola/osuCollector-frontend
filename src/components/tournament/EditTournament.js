import { useHistory, useParams } from 'react-router-dom'
import TournamentForm from './TournamentForm'
import * as api from '../../utils/api'
import { useEffect, useState } from 'react'

function EditTournament() {
  // @ts-ignore
  const { id } = useParams()
  const { tournament, mutateTournament } = api.useTournament(id)
  const history = useHistory()
  const [submitLoading, setSubmitLoading] = useState(false)

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
    mutateTournament()
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
