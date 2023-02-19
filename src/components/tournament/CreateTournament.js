import { useHistory } from 'react-router-dom'
import TournamentForm from './TournamentForm'
import * as api from '../../utils/api'
import { useState } from 'react'
import { useSWRConfig } from 'swr'

function CreateTournament() {
  const { cache } = useSWRConfig()
  const history = useHistory()
  const [submitLoading, setSubmitLoading] = useState(false)
  const createTournament = async (createTournamentDto) => {
    try {
      setSubmitLoading(true)
      const newTournament = await api.createTournament(createTournamentDto)
      setSubmitLoading(false)
      localStorage.removeItem('Create Tournament Draft')
      // window.location.href = `/tournaments/${newTournament.id}`
      // @ts-ignore/next-line
      cache.clear()
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
