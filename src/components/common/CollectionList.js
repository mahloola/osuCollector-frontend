import { useHistory } from 'react-router';
import { Table } from 'react-bootstrap';
import PropTypes from 'prop-types';

const CollectionList = ({ collections }) => {
    const history = useHistory();

    return (
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Collection</th>
                    <th>Uploader</th>
                    <th>Favourites</th>
                    <th>Beatmap Count</th>
                </tr>
            </thead>
            <tbody>
                {
                    collections.map((collections) => (
                        <tr key={collections.id} onClick={() => { history.push(`/collections/${collections.id}`) }}>
                            <td>{collections.id}</td>
                            <td>{collections.name}</td>
                            <td>{collections.uploader.username}</td>
                            <td>{collections.favourites}</td>
                            <td>{collections.beatmapCount}</td>
                        </tr>
                    ))
                }
            </tbody>
        </Table>
    )
}

CollectionList.propTypes = {
    collections: PropTypes.arrayOf(PropTypes.object)
}

export default CollectionList;