// @ts-nocheck
import { useContext, useEffect, useRef, useState } from 'react'
import { Alert, Container, Spinner } from 'react-bootstrap'
import styled, { css, ThemeContext } from 'styled-components'
import { parseMappool, isValidHttpUrl } from 'utils/misc'
import { Button, Card, Form, FloatingLabel, FormControl, InputGroup } from '../bootstrap-osu-collector'
import MappoolEditor from '../tournaments/MappoolEditor'
import OrganizerIcon from '../tournaments/create/OrganizerIcon'

const mappoolTemplate = `# Lines beginning with '#' are ignored

# ⚠️ Make sure links are in order 
# eg. from top to bottom these are: NM1, NM2, NM3, NM4

[qualifiers.NM]
https://osu.ppy.sh/beatmapsets/1598211#osu/3264035
https://osu.ppy.sh/beatmapsets/1257558#osu/2613136
https://osu.ppy.sh/beatmapsets/1537691#osu/3144020
https://osu.ppy.sh/beatmapsets/1306570#osu/2823535

# ⚠️ You can also provide beatmap IDs instead of the full URL
# https://osu.ppy.sh/beatmapsets/1306570#osu/2823535 👈 only the last number!!!

[qualifiers.HD]
3263097
3263174

[qualifiers.HR]



[qualifiers.DT]



[qualifiers.FM]


# ⚠️ Feel free to add or remove sections as you please


[round of 16.NM]





[round of 16.HD]



[round of 16.HR]



[round of 16.DT]




[round of 16.FM]



[round of 16.TB]




[quarterfinals.NM]







[quarterfinals.HD]




[quarterfinals.HR]




[quarterfinals.DT]





[quarterfinals.FM]




[quarterfinals.TB]




[semifinals.NM]







[semifinals.HD]




[semifinals.HR]




[semifinals.DT]





[semifinals.FM]




[semifinals.TB]




[finals.NM]







[finals.HD]




[finals.HR]




[finals.DT]





[finals.FM]




[finals.TB]


[grand finals.NM]







[grand finals.HD]




[grand finals.HR]




[grand finals.DT]





[grand finals.FM]




[grand finals.TB]
`

// eslint-disable-next-line no-unused-vars
const owcText = `
[qualifiers.NM]
https://osu.ppy.sh/beatmapsets/1597778#osu/3263082
https://osu.ppy.sh/beatmapsets/1597785#osu/3263098
https://osu.ppy.sh/beatmapsets/1597860#osu/3263248
https://osu.ppy.sh/beatmapsets/1597801#osu/3263131

[qualifiers.HD]
https://osu.ppy.sh/beatmapsets/1597784#osu/3263097
https://osu.ppy.sh/beatmapsets/1597824#osu/3263174

[qualifiers.HR]
https://osu.ppy.sh/beatmapsets/1597607#osu/3262706
https://osu.ppy.sh/beatmapsets/1597825#osu/3263175

[qualifiers.DT]
https://osu.ppy.sh/beatmapsets/1597789#osu/3263112
https://osu.ppy.sh/beatmapsets/1597755#osu/3263028



[round of 32.NM]
https://osu.ppy.sh/beatmapsets/1604377#osu/3276259
https://osu.ppy.sh/beatmapsets/1604632#osu/3276724
https://osu.ppy.sh/beatmapsets/1268824#osu/2692632
https://osu.ppy.sh/beatmapsets/1604642#osu/3276740
https://osu.ppy.sh/beatmapsets/1257525#osu/2613076

[round of 32.HD]
https://osu.ppy.sh/beatmapsets/1604543#osu/3276559
https://osu.ppy.sh/beatmapsets/1604477#osu/3276441

[round of 32.HR]
https://osu.ppy.sh/beatmapsets/87547#osu/240689
https://osu.ppy.sh/beatmapsets/1514096#osu/3099848

[round of 32.DT]
https://osu.ppy.sh/beatmapsets/1604602#osu/3276673
https://osu.ppy.sh/beatmapsets/1604680#osu/3276823
https://osu.ppy.sh/beatmapsets/1381135#osu/3276774

[round of 32.FM]
https://osu.ppy.sh/beatmapsets/1604480#osu/3276444
https://osu.ppy.sh/beatmapsets/1348020#osu/2791506

[round of 32.TB]
https://osu.ppy.sh/beatmapsets/1604660#osu/3276769



[round of 16.NM]
https://osu.ppy.sh/beatmapsets/1610199#osu/3287700
https://osu.ppy.sh/beatmapsets/1610241#osu/3287781
https://osu.ppy.sh/beatmapsets/1610080#osu/3287483
https://osu.ppy.sh/beatmapsets/1610294#osu/3287875

[round of 16.HD]
https://osu.ppy.sh/beatmapsets/1610204#osu/3287711
https://osu.ppy.sh/beatmapsets/1610179#osu/3287656

[round of 16.HR]
https://osu.ppy.sh/beatmapsets/431697#osu/990396
https://osu.ppy.sh/beatmapsets/1610221#osu/3287751

[round of 16.DT]
https://osu.ppy.sh/beatmapsets/1610217#osu/3287743
https://osu.ppy.sh/beatmapsets/1609956#osu/3287252
https://osu.ppy.sh/beatmapsets/1464373#osu/3142329

[round of 16.FM]
https://osu.ppy.sh/beatmapsets/1362537#osu/2819029
https://osu.ppy.sh/beatmapsets/1610224#osu/3287758

[round of 16.TB]
https://osu.ppy.sh/beatmapsets/1610231#osu/3287767



[quarterfinals.NM]
https://osu.ppy.sh/beatmapsets/1616036#osu/3299389
https://osu.ppy.sh/beatmapsets/1616046#osu/3299406
https://osu.ppy.sh/beatmapsets/1616051#osu/3299411
https://osu.ppy.sh/beatmapsets/821587#osu/1722011
https://osu.ppy.sh/beatmapsets/1615076#osu/3297498
https://osu.ppy.sh/beatmapsets/1616052#osu/3299412

[quarterfinals.HD]
https://osu.ppy.sh/beatmapsets/881753#osu/1843575
https://osu.ppy.sh/beatmapsets/1262423#osu/2623967
https://osu.ppy.sh/beatmapsets/155749#osu/546944

[quarterfinals.HR]
https://osu.ppy.sh/beatmapsets/1267328#osu/2633812
https://osu.ppy.sh/beatmapsets/1615776#osu/3298820
https://osu.ppy.sh/beatmapsets/1063804#osu/2229381

[quarterfinals.DT]
https://osu.ppy.sh/beatmapsets/235836#osu/546514
https://osu.ppy.sh/beatmapsets/1616029#osu/3299371
https://osu.ppy.sh/beatmapsets/1543580#osu/3155184
https://osu.ppy.sh/beatmapsets/13994#osu/53340

[quarterfinals.FM]
https://osu.ppy.sh/beatmapsets/1616017#osu/3299353
https://osu.ppy.sh/beatmapsets/1616043#osu/3299402
https://osu.ppy.sh/beatmapsets/1616078#osu/3299463

[quarterfinals.TB]
https://osu.ppy.sh/beatmapsets/1616079#osu/3299464



[semifinals.NM]
https://osu.ppy.sh/beatmapsets/1621784#osu/3311170
https://osu.ppy.sh/beatmapsets/1621473#osu/3310526
https://osu.ppy.sh/beatmapsets/1621874#osu/3311309
https://osu.ppy.sh/beatmapsets/1621891#osu/3311337
https://osu.ppy.sh/beatmapsets/1621877#osu/3311312
https://osu.ppy.sh/beatmapsets/1621878#osu/3311313

[semifinals.HD]
https://osu.ppy.sh/beatmapsets/1621830#osu/3311238
https://osu.ppy.sh/beatmapsets/1621706#osu/3311073
https://osu.ppy.sh/beatmapsets/1084460#osu/2267887

[semifinals.HR]
https://osu.ppy.sh/beatmapsets/395846#osu/861381
https://osu.ppy.sh/beatmapsets/1621892#osu/3311344
https://osu.ppy.sh/beatmapsets/1621683#osu/3311036

[semifinals.DT]
https://osu.ppy.sh/beatmapsets/1271945#osu/2643135
https://osu.ppy.sh/beatmapsets/1621910#osu/3311366
https://osu.ppy.sh/beatmapsets/105686#osu/277274
https://osu.ppy.sh/beatmapsets/1621901#osu/3311356

[semifinals.FM]
https://osu.ppy.sh/beatmapsets/1622117#osu/3311891
https://osu.ppy.sh/beatmapsets/1621916#osu/3311383
https://osu.ppy.sh/beatmapsets/1621913#osu/3311375

[semifinals.TB]
https://osu.ppy.sh/beatmapsets/1621918#osu/3311391



[finals.NM]
https://osu.ppy.sh/beatmapsets/1288914#osu/2675756
https://osu.ppy.sh/beatmapsets/1627446#osu/3322513
https://osu.ppy.sh/beatmapsets/1627451#osu/3322521
https://osu.ppy.sh/beatmapsets/1627456#osu/3322526
https://osu.ppy.sh/beatmapsets/1627466#osu/3322566
https://osu.ppy.sh/beatmapsets/1627210#osu/3322093

[finals.HD]
https://osu.ppy.sh/beatmapsets/1382362#osu/2856086
https://osu.ppy.sh/beatmapsets/1627474#osu/3322576
https://osu.ppy.sh/beatmapsets/1267294#osu/2633747

[finals.HR]
https://osu.ppy.sh/beatmapsets/182815#osu/438187
https://osu.ppy.sh/beatmapsets/1431935#osu/2947341
https://osu.ppy.sh/beatmapsets/1627494#osu/3322603

[finals.DT]
https://osu.ppy.sh/beatmapsets/1614390#osu/3320894
https://osu.ppy.sh/beatmapsets/1627491#osu/3322598
https://osu.ppy.sh/beatmapsets/166062#osu/859667
https://osu.ppy.sh/beatmapsets/1627501#osu/3322610

[finals.FM]
https://osu.ppy.sh/beatmapsets/1627502#osu/3322611
https://osu.ppy.sh/beatmapsets/1271973#osu/2643166
https://osu.ppy.sh/beatmapsets/1627418#osu/3322445

[finals.TB]
https://osu.ppy.sh/beatmapsets/1627506#osu/3322616

[grand finals.NM]
https://osu.ppy.sh/beatmapsets/1633225#osu/3333705
https://osu.ppy.sh/beatmapsets/1633210#osu/3333669
https://osu.ppy.sh/beatmapsets/1633220#osu/3333699
https://osu.ppy.sh/beatmapsets/1633224#osu/3333703
https://osu.ppy.sh/beatmapsets/1633221#osu/3333700
https://osu.ppy.sh/beatmapsets/1633222#osu/3333701

[grand finals.HD]
https://osu.ppy.sh/beatmapsets/1538589#osu/3145691
https://osu.ppy.sh/beatmapsets/1633283#osu/3333793
https://osu.ppy.sh/beatmapsets/1633226#osu/3333706

[grand finals.HR]
https://osu.ppy.sh/beatmapsets/1504153#osu/3081546
https://osu.ppy.sh/beatmapsets/1631947#osu/3331199
https://osu.ppy.sh/beatmapsets/1633205#osu/3333660

[grand finals.DT]
https://osu.ppy.sh/beatmapsets/1633147#osu/3333570
https://osu.ppy.sh/beatmapsets/1633156#osu/3333586
https://osu.ppy.sh/beatmapsets/1633270#osu/3333770
https://osu.ppy.sh/beatmapsets/1633242#osu/3333734

[grand finals.FM]
https://osu.ppy.sh/beatmapsets/1633237#osu/3333729
https://osu.ppy.sh/beatmapsets/1633261#osu/3333760
https://osu.ppy.sh/beatmapsets/1245641#osu/3333738

[grand finals.TB]
https://osu.ppy.sh/beatmapsets/1633250#osu/3333745`

function TournamentForm({ title, onSubmit, submitLoading, saveDraft, tournament }) {
  const theme = useContext(ThemeContext)

  const tournamentDraft = JSON.parse(localStorage.getItem('Create Tournament Draft'))

  const [organizer, setOrganizer] = useState('')
  const [organizers, setOrganizers] = useState(tournamentDraft?.organizers || [])
  const [mappoolText, setMappoolText] = useState(
    tournamentDraft?.mappoolText || (tournament === null ? '' : mappoolTemplate)
  )
  // const [mappoolText, setMappoolText] = useState(owcText)

  const [error, setError] = useState(false)
  const [tournamentNameError, setTournamentNameError] = useState('')
  const [tournamentURLError, setTournamentURLError] = useState('')
  const [bannerURLError, setBannerURLError] = useState('')
  const [downloadUrlError, setDownloadURLError] = useState('')
  const [organizerError, setOrganizerError] = useState('')
  const [mappoolError, setMappoolError] = useState('')
  const [submitButtonClicked, setSubmitButtonClicked] = useState(false)

  const [seconds, setSeconds] = useState(0)
  const formRef = useRef(null)
  useEffect(() => {
    let interval = null
    if (seconds === 0 && saveDraft) {
      const tournamentDraft = JSON.parse(localStorage.getItem('Create Tournament Draft'))
      if (tournamentDraft) {
        console.log('tournament draft loaded')
        formRef.current[0].value = tournamentDraft.tournamentName
        formRef.current[1].value = tournamentDraft.tournamentURL
        formRef.current[2].value = tournamentDraft.bannerURL
        formRef.current[5].value = tournamentDraft.description
        setMappoolText(tournamentDraft.mappoolText)
      }
    } else if (seconds % 5 === 0 && seconds !== 0 && saveDraft) {
      const tournamentName = formRef.current[0].value.trim()
      const tournamentURL = formRef.current[1].value.trim()
      const bannerURL = formRef.current[2].value.trim()
      const description = formRef.current[5].value.trim()
      const tournamentDraft = {
        tournamentName,
        tournamentURL,
        description,
        organizers,
        bannerURL,
        mappoolText,
      }
      localStorage.setItem('Create Tournament Draft', JSON.stringify(tournamentDraft))
      console.log('tournament draft saved')
    }
    interval = setInterval(() => {
      setSeconds((prev) => prev + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [seconds])

  useEffect(() => {
    if (!tournament) {
      return
    }
    formRef.current[0].value = tournament.name
    formRef.current[1].value = tournament.link
    formRef.current[2].value = tournament.banner
    formRef.current[5].value = tournament.description
    const lines = []
    for (const round of tournament.rounds) {
      for (const mod of round.mods) {
        lines.push(`[${round.round}.${mod.mod}]`)
        for (const beatmap of mod.maps) {
          lines.push(beatmap.url || `https://osu.ppy.sh/b/${beatmap}`)
        }
        lines.push('')
      }
    }
    setMappoolText(lines.join('\n'))
    setOrganizers(tournament.organizers.map((user) => user.id))
  }, [tournament])

  const submit = async (event) => {
    event.preventDefault()
    if (!submitButtonClicked) {
      console.log('Enter key ignored')
      setSubmitButtonClicked(false)
      return
    }
    setSubmitButtonClicked(false)
    const tournamentName = event.currentTarget[0].value.trim()
    const tournamentURL = event.currentTarget[1].value.trim()
    const bannerURL = event.currentTarget[2].value.trim()
    const downloadURL = event.currentTarget[3].value.trim()
    const description = event.currentTarget[6].value.trim()

    let error = false
    setTournamentNameError('')
    setTournamentURLError('')
    setBannerURLError('')
    setMappoolError('')

    if (!tournamentName) {
      setTournamentNameError('Required')
      error = true
    }

    const allowedUrlPatterns = [/^https:\/\/(\w+\.)?ppy\.sh\//, /^https:\/\/docs\.google\.com\//]
    if (!tournamentURL) {
      setTournamentURLError('Required')
      error = true
    } else if (allowedUrlPatterns.some((pattern) => pattern.test(tournamentURL))) {
      setTournamentURLError('Only osu.ppy.sh forum or google doc links or are accepted')
    }

    if (downloadURL && !isValidHttpUrl(downloadURL)) {
      setDownloadURLError('Invalid URL')
      error = true
    }

    if (bannerURL !== '' && !/^https:\/\/i\.ppy.sh\//.test(bannerURL)) {
      setBannerURLError(
        'For security reasons, only URLs originating from https://i.ppy.sh are accepted. Please use the "Copy image address" method described below.'
      )
      error = true
    }

    const { rounds, error: mappoolError } = parseMappool(mappoolText)

    if (mappoolError) {
      setMappoolError(mappoolError)
      error = true
    }

    setError(error)
    if (error) {
      return
    }

    const createTournamentDto = {
      name: tournamentName,
      link: tournamentURL,
      description: description,
      organizers: organizers,
      banner: bannerURL,
      downloadUrl: downloadURL,
      rounds: rounds,
    }
    console.log('createTournamentDto', createTournamentDto)
    onSubmit(createTournamentDto)
  }

  const addOrganizer = () => {
    setOrganizer('')
    const organizerId = Number(organizer)
    if (!organizers.includes(organizerId)) {
      setOrganizers((organizers) => organizers.concat(organizerId))
    }
  }

  const organizerKeyPress = (e) => {
    console.log('organizerKeyPress')
    if (e.charCode === 13) {
      addOrganizer()
    }
  }
  return (
    <Container className='pt-4'>
      <Card className='px-5 py-4'>
        <Form onSubmit={submit} ref={formRef} className='pb-5'>
          <h1 className='text-muted mb-4'>{title}</h1>

          <Form.Group className='mb-3'>
            <Form.Label>Tournament name</Form.Label>
            <FormControl isInvalid={tournamentNameError} />
            <Form.Control.Feedback type='invalid'>{tournamentNameError}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className='mb-3'>
            <Form.Label>Tournament URL</Form.Label>
            <FormControl isInvalid={tournamentURLError} />
            <Form.Control.Feedback type='invalid'>{tournamentURLError}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className='mb-3'>
            <Form.Label>
              Banner URL <small className='ml-2 text-muted'>only https://i.ppy.sh allowed</small>
            </Form.Label>
            <FormControl isInvalid={bannerURLError} />
            <Form.Control.Feedback type='invalid'>{bannerURLError}</Form.Control.Feedback>
            <Form.Text muted>
              You can get the banner URL by going to the tournament forum page, right clicking the banner image, and
              clicking &quot;Copy image address&quot;
            </Form.Text>
          </Form.Group>

          <Form.Group className='mb-3'>
            <Form.Label>
              Mappool Download URL <small className='ml-2 text-muted'>Optional</small>
            </Form.Label>
            <FormControl isInvalid={downloadUrlError} />
            <Form.Control.Feedback type='invalid'>{downloadUrlError}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className='mb-3'>
            <Form.Label>Tournament Organizers</Form.Label>
            <div className='d-flex'>
              <InputGroup hasValidation className='mr-4' style={{ width: 366 }}>
                <S.InputGroupText>https://osu.ppy.sh/users/</S.InputGroupText>
                <FormControl
                  placeholder='2051389'
                  value={organizer}
                  onKeyPress={organizerKeyPress}
                  onChange={(e) => {
                    const value = e.target.value.trim()
                    setOrganizer(value)
                    if (value === '' || /^\d+$/.test(value)) {
                      setOrganizerError('')
                    } else {
                      setOrganizerError('Invalid user ID')
                    }
                  }}
                  isInvalid={organizerError}
                />
                <Button variant='primary' disabled={organizerError} onClick={addOrganizer}>
                  Add
                </Button>
                <Form.Control.Feedback type='invalid'>
                  <span style={{ paddingLeft: 208 }}>{organizerError}</span>
                </Form.Control.Feedback>
              </InputGroup>
              {organizers.map((organizerId) => (
                <div className='d-flex mr-2' key={organizerId}>
                  <OrganizerIcon
                    organizerId={organizerId}
                    onClick={() => setOrganizers((organizers) => organizers.filter((id) => id !== organizerId))}
                    roundedCircle
                  />
                </div>
              ))}
            </div>
            <Form.Text muted>Optional: Organizers have permission to make changes to this tournament</Form.Text>
          </Form.Group>

          <Form.Group className='mb-3'>
            <Form.Label>Description</Form.Label>
            <Form.Control style={textareaFormControlStyle(theme)} as='textarea' rows={2} />
            <Form.Text muted className='mb-3'>
              Keep it short; for more information users should visit the tournament URL
            </Form.Text>
          </Form.Group>

          <h3 className='mb-0'>Mappool</h3>
          <Form.Text muted className='my-2'>
            A mappool template is provided below. Please modify it to include the maps in the tournament.
          </Form.Text>
          <MappoolEditor mappoolText={mappoolText} setMappoolText={setMappoolText} mappoolError={mappoolError} />
          {error && (
            <Alert className='mt-4 mb-0' variant='danger'>
              Please fix the above errors and try again
            </Alert>
          )}
          <Button disabled={submitLoading} className='mt-4 w-100' size='lg' variant='primary' type='submit'>
            <h3 onClick={() => setSubmitButtonClicked(true)} className='mb-0 py-2'>
              {submitLoading ? <Spinner animation='border' /> : 'Submit'}
            </h3>
          </Button>
        </Form>
      </Card>
    </Container>
  )
}

const S = {}
S.InputGroupText = styled(InputGroup.Text)`
  ${({ theme }) =>
    theme.darkMode &&
    css`
      background-color: ${({ theme }) => theme.primary10};
      border-color: ${({ theme }) => theme.primary40};
      color: #6c757d;
    `}
`

S.FloatingLabel = styled(FloatingLabel)`
  ${({ theme }) =>
    theme.darkMode &&
    css`
      & > input {
        background-color: ${({ theme }) => theme.primary20};
        border-color: ${({ theme }) => theme.primary20};
        color: #f8f8f2;
        &:focus {
          background-color: ${({ theme }) => theme.primary20};
          border-color: ${({ theme }) => theme.primary20};
          color: #f8f8f2;
        }
      }
    `};
`

const textareaFormControlStyle = (theme) =>
  theme.darkMode
    ? {
        backgroundColor: theme.primary20,
        borderColor: theme.primary40,
        color: '#f8f8f2',
      }
    : {}

export default TournamentForm
