/* eslint-disable no-unused-vars */
import MappoolBeatmap from './MappoolBeatmap'
import { calculateARWithDT, calculateARWithHR, calculateODWithDT, calculateODWithHR } from 'utils/diffcalc'
import { isEqual } from 'utils/misc'

function MappoolRound({ round, currentlyPlaying, setCurrentlyPlaying }) {
  const onPlayClick = (j, k) => {
    if (isEqual(currentlyPlaying, [round, j, k])) {
      setCurrentlyPlaying(null)
    } else {
      setCurrentlyPlaying([round, j, k])
    }
  }

  const onAudioEnd = () => {
    setCurrentlyPlaying(null)
  }

  return (
    <>
      {round.mods.map((mod, j) => (
        <div key={j}>
          {mod.maps.map((beatmap, k) => {
            let moddedBeatmap
            if (typeof beatmap === 'object') {
              moddedBeatmap = { ...beatmap }
              if (mod.mod.toLowerCase() === 'hr') {
                moddedBeatmap.cs = Math.round((beatmap.cs + 1.2) * 10) / 10
                moddedBeatmap.ar = Math.round(10 * calculateARWithHR(beatmap.ar)) / 10
                moddedBeatmap.accuracy = Math.round(10 * calculateODWithHR(beatmap.accuracy)) / 10
              }
              if (mod.mod.toLowerCase() === 'dt') {
                moddedBeatmap.ar = Math.round(10 * calculateARWithDT(beatmap.ar)) / 10
                moddedBeatmap.accuracy = Math.round(10 * calculateODWithDT(beatmap.accuracy)) / 10
                moddedBeatmap.bpm = Math.round(beatmap.bpm * 1.5)
              }
            }
            return (
              <MappoolBeatmap
                key={k}
                mod={mod.mod}
                modIndex={k + 1}
                beatmap={moddedBeatmap || beatmap}
                onPlayClick={() => onPlayClick(j, k)}
                onAudioEnd={onAudioEnd}
                className='mb-1'
                playing={isEqual(currentlyPlaying, [round, j, k])}
              />
            )
          })}
        </div>
      ))}
    </>
  )
}

export default MappoolRound
