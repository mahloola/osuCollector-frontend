import React from 'react';
import { useParams } from 'react-router-dom';

function Collection() {

    let { id } = useParams();

    return (
        <div>
            <h1>
                Hello World!
                <br/>
                {id}
            </h1>
        </div>
    )
}

export default Collection;