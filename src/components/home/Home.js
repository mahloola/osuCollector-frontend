import React from 'react';
import './Home.css';
import { parseCollectionDb } from '../../utils/collectionsDb'
import * as api from '../../utils/api';

function onCollectionDbSelected(e) {
    const file = e.target.files[0];
    if (file.name !== 'collection.db') {
      console.log('Error: user did not select a collection.db file');
      return;
    }
    let reader = new FileReader(); 
    reader.onload = async () => {
        const collections = parseCollectionDb(reader.result);
        console.log(collections);
        const result = await api.uploadCollections(collections);
        console.log(result);
    }
    reader.readAsArrayBuffer(file);
}

function Home() {

    return (
        <div>
            <h1>
                News
            </h1>
            <br />
            <div class="news">
                <h3>
                    We are going live.
                </h3>
                <h6>
                    Hey guys what's up guys back at it again at Krispy Kreme!
                </h6>
                <div class="text-muted date">
                    July 25, 2021
                </div>
            </div>
            <div class="news">
                <h3>
                    kjjkj
                </h3>
                <h6>
                    Congratulations! If you're reading this you lost the game.
                </h6>
                <div class="text-muted date">
                    July 25, 2021
                </div>
            </div>
            <input type="file" accept=".db" class="file-input" onChange={onCollectionDbSelected}/>
        </div>

    )
}

export default Home;