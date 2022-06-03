import { useHistory } from 'react-router-dom'
import TournamentForm from './TournamentForm'
import * as api from '../../utils/api'
import { useState } from 'react'

function CreateTournament() {
  const history = useHistory()
  const [submitLoading, setSubmitLoading] = useState(false)
  const createTournament = async (createTournamentDto) => {
    try {
      setSubmitLoading(true)
      const newTournament = await api.createTournament(createTournamentDto)
      setSubmitLoading(false)
      localStorage.removeItem('Create Tournament Draft')
      history.push(`/tournaments/${newTournament.id}`)
    } catch (err) {
      setSubmitLoading(false)
      alert(err.message)
    }
  }
  return (
    <TournamentForm
      title='Create Tournament'
      onSubmit={createTournament}
      submitLoading={submitLoading}
      saveDraft={true}
      tournament={undefined}
    />
  )
}

export default CreateTournament
