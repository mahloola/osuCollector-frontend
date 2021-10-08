import { Container, Row } from 'react-bootstrap';
import Collection from './CollectionCard';
import PropTypes from 'prop-types';
import './CollectionList.css';

const CollectionList = ({ collections }) => {

    return (

        <Container className="collection-list-container">
            <Row>
            {
                collections.map((collection) => (
                    <Collection key={collection.id} collection={collection}></Collection>
                ))
            }
            </Row>
        </Container>

    )
}

CollectionList.propTypes = {
    collections: PropTypes.arrayOf(PropTypes.object)
}

export default CollectionList;