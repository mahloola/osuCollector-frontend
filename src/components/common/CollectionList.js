import { useHistory } from 'react-router';
import { Table } from 'react-bootstrap';
import PropTypes from 'prop-types';
import './CollectionList.css';

const CollectionList = ({ collections }) => {
    const history = useHistory();

    return (
        <Table bordered hover>
            <thead>
                <tr>
                    <th>Collection</th>
                    <th>Uploader</th>
                    <th>Favourites</th>
                    <th>Beatmap Count</th>
                </tr>
            </thead>
            <tbody>
                {
                    collections.map((collection) => (
                        <tr key={collection.id} onClick={() => { history.push(`/collections/${collection.id}`) }}>
                            <td>{collection.name}</td>
                            <td>{collection.uploader.username}{collection.uploader.rank && ` (#${collection.uploader.rank})`}</td>
                            <td>{collection.favourites} {collection.favouritedByUser && '❤️'}</td>
                            <td>{collection.beatmapCount}</td>
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