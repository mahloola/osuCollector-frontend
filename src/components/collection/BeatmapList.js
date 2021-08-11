import { Redirect } from 'react-router-dom'
import { Table } from 'react-bootstrap';

const BeatmapList = ({ beatmaps }) => {
    return (
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Artist - Title</th>
                    <th>Difficulty</th>
                    <th>Star Rating</th>
                </tr>
            </thead>
            <tbody>
                {beatmaps.map(function (beatmap, i) {
                    return (
                        <tr onClick={() => { <Redirect to="osu.ppy.sh" /> }}>
                            <td>{i + 1}</td>
                            <td>{beatmap.beatmapset.artist} - {beatmap.beatmapset.title}</td>
                            <td>{beatmap.version}</td>
                            <td>{beatmap.difficulty_rating}</td>
                        </tr>
                    )
                })}
            </tbody>
        </Table>
    )
}
export default BeatmapList;