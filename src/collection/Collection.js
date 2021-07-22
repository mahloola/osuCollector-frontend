import React from 'react';
import { useParams } from 'react-router-dom';
import { useState } from 'react';

function Collection() {

    let { id } = useParams();
    const [collection, setCollection] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // heroku API request (ITS SO SLOW)
    fetch('https://osucollectorapi.herokuapp.com/api/collections/{id}')
        .then(res => res.json())
        .then(data => {
            setLoading(false);
            setCollection(data);
            console.log(collection);
        })
        .catch(err => console.log('Unable to fetch collections: ', err));
    

    return (
        <div>
            <h1>
                Hello World!
                <br />
                {id}
            </h1>
        </div>
    )
}

export default Collection;