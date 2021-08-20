import { Redirect } from 'react-router-dom'
import { Button, Table } from 'react-bootstrap';
import PropTypes from 'prop-types';

const BeatmapList = ({ beatmaps }) => {

    return (
        <Table striped bordered hover>
            <thead>
                <tr>
                    
                    <th> {/* beatmap thumbnail */}</th>
                    <th>Title</th>
                    <th>Difficulty</th>
                    <th>Star Rating</th>
                    <th>Links</th>
                </tr>
            </thead>
            <tbody>
                {beatmaps.map(beatmap => 
                    <tr key={beatmap.id} onClick={() => { <Redirect to="osu.ppy.sh" /> }}>
                        <img
                            src={beatmap.beatmapset.covers.card}
                            className='p-0'
                            style={{objectFit: 'cover', width: '100%', height: 44}}/>
                        <td>{beatmap.beatmapset.artist} - {beatmap.beatmapset.title}</td>
                        <td>[{beatmap.version}]</td>
                        <td>{beatmap.difficulty_rating}</td>
                        <td className="d-flex flex-row">
                            <Button variant='outline-secondary' className='mx-1' size='sm' href={`https://osu.ppy.sh/b/${beatmap.id}`}>Website</Button>{' '}
                            <Button variant='outline-primary' className='mx-1' size='sm' href={`osu://b/${beatmap.id}`}>Direct</Button>
                        </td>
                    </tr>
                )}
            </tbody>
        </Table>
    )
}

BeatmapList.propTypes = {
    beatmaps: PropTypes.arrayOf(PropTypes.object)
}

export default BeatmapList;