import { Redirect } from 'react-router-dom'
import { Button, Table } from 'react-bootstrap';
import PropTypes from 'prop-types';

const BeatmapList = ({ beatmaps }) => {
    return (
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>Artist - Title</th>
                    <th>Difficulty</th>
                    <th>Star Rating</th>
                    <th>Links</th>
                </tr>
            </thead>
            <tbody>
                {beatmaps.map(function (beatmap) {
                    return (
                        <tr key={beatmap.id} onClick={() => { <Redirect to="osu.ppy.sh" /> }}>
                            <td>{beatmap.beatmapset.artist} - {beatmap.beatmapset.title}</td>
                            <td>[{beatmap.version}]</td>
                            <td>{beatmap.difficulty_rating}</td>
                            <td>
                                <Button variant='outline-secondary' size='sm' href={`https://osu.ppy.sh/b/${beatmap.id}`}>Website</Button>{' '}
                                <Button variant='outline-primary' size='sm' href={`osu://b/${beatmap.id}`}>Direct</Button>
                            </td>
                        </tr>
                    )
                })}
            </tbody>
        </Table>
    )
}

BeatmapList.propTypes = {
    beatmaps: PropTypes.arrayOf(PropTypes.object)
}

export default BeatmapList;