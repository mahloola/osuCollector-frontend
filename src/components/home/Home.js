import './Home.css';
import { parseCollectionDb } from '../../utils/collectionsDb'
import * as api from '../../utils/api';
import { Button } from 'react-bootstrap';
import { node } from 'prop-types';

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

async function getOwnUser() {
    console.log(await api.getOwnUser())
}

function Home() {

    return (
        <div>
            <h1>
                News
            </h1>
            <br/>
            <div className="news">
                <h3>
                    We are going live.
                </h3>
                <h6>
                    Hey guys what&apos;s up guys back at it again at Krispy Kreme!
                </h6>
                <div className="text-muted date">
                    July 25, 2021
                </div>
            </div>
            <div className="news">
                <h3>
                    kjjkj
                </h3>
                <h6>
                    Congratulations! If you&apos;re reading this you lost the game.
                </h6>
                <div className="text-muted date">
                    July 25, 2021
                </div>
            </div>
            {process.env.NODE_ENV !== 'production' &&
            <>
                <input type="file" accept=".db" className="file-input" onChange={onCollectionDbSelected}/>
                <Button onClick={getOwnUser}>api.getOwnUser</Button>
            </>
            }
        </div>

    )
}

export default Home;