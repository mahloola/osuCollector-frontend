import osuPng from './mode-osu.png'
import taikoPng from './mode-taiko.png'
import maniaPng from './mode-mania.png'
import catchPng from './mode-catch.png'
import { Image } from '../bootstrap-osu-collector'
import styled, { css } from 'styled-components'

const ModeImage = styled(Image)`
  width: 18px;
  height: auto;
  ${(props) =>
    props.theme.darkMode
      ? css`
          filter: invert(1) opacity(${(props) => (props.muted ? '10%' : '100%')});
        `
      : css`
          filter: invert(0) opacity(${(props) => (props.muted ? '20%' : '100%')});
        `}
`

const ModeLabel = styled.small`
  ${(props) =>
    props.theme.darkMode
      ? css`
          color: ${(props) => (props.muted ? '#444' : '#ccc')};
        `
      : css`
          color: ${(props) => (props.muted ? '#ccc' : '#000')};
        `}
`

function ModeCounters({ collection, className }) {
  return (
    <div className={className}>
      <div className="d-flex align-items-center">
        {[
          [osuPng, 'osu'],
          [taikoPng, 'taiko'],
          [maniaPng, 'mania'],
          [catchPng, 'fruits'],
        ].map(([modePng, mode]) => {
          let muted = true
          if (collection.modes && collection.modes[mode]) {
            muted = false
          }
          return (
            <div key={mode} className="d-flex align-items-center mr-3">
              <ModeImage src={modePng} size={20} className="mr-1" muted={muted} />
              <ModeLabel muted={muted}>{muted ? 0 : collection.modes[mode]}</ModeLabel>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ModeCounters
