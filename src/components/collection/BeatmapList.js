import { Redirect } from 'react-router-dom'
import { Button, Table } from 'react-bootstrap';

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
                        <tr onClick={() => { <Redirect to="osu.ppy.sh" /> }}>
                            <td>{beatmap.beatmapset.artist} - {beatmap.beatmapset.title}</td>
                            <td>[{beatmap.version}]</td>
                            <td>{beatmap.difficulty_rating}</td>
                            <td>
                                <Button variant='outline-secondary' href={`https://osu.ppy.sh/b/${beatmap.id}`}>Website</Button>{' '}
                                <Button variant='outline-primary' href={`osu://b/${beatmap.id}`}>Direct</Button>
                            </td>
                        </tr>
                    )
                })}
            </tbody>
        </Table>
    )
}
export default BeatmapList;