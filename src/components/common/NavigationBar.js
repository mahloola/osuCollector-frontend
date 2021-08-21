import { Nav, Navbar, Form, FormControl, Button, InputGroup, Card, Row, Col } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useState, useCallback } from 'react';
import UserBadge from './UserBadge';
import LoginButton from './LoginButton';
import Modal from './Modal';
import {useDropzone} from 'react-dropzone';
import { parseCollectionDb } from '../../utils/collectionsDb'
import * as api from '../../utils/api';
import './common.css';
import './uploadModal.css'

function NavigationBar({ user }) {

    const [uploadModalIsOpen, setUploadModalIsOpen] = useState(false);
    const [searchBarInput, setSearchBarInput] = useState('');
    const [collections, setCollections] = useState([]);
    const [selected, setSelected] = useState([]);
    const [file, setFile] = useState(null);
    const history = useHistory()

    const onDrop = useCallback((acceptedFiles) => {
        let file = acceptedFiles[0];
        setFile(file);
        console.log(file);
        let reader = new FileReader(); 
        reader.onload = async () => {
            console.log('reader');
            setCollections(parseCollectionDb(reader.result));
            console.log('collections', collections);
        }
        reader.readAsArrayBuffer(file);
    }, [])
    const { getRootProps, getInputProps, isDragActive } = useDropzone({onDrop});

    const searchSubmit = (event) => {
        event.preventDefault();
        history.push(`/all?search=${encodeURIComponent(searchBarInput)}`);
        window.location.reload()
        return false;
    }

    const handleChange = ({ target }) => {
        console.log('change');
        const { value, checked } = target;
        if(checked == true) {
            setSelected((old) => [...old, value]);
        } else {
            setSelected((old) => old.filter((col) => col != parseInt(value)));
        }
        console.log(selected);
    }

    const checkAll = () => {
        console.log('checkAll');
        if(selected.length == collections.length) {
            setSelected([]);
        } else {
            setSelected(collections.map((col, index) => index));
        }
        console.log(selected);
    }

    const submit = async () => {
        console.log('submit');
        const selectedCollections = collections.filter((col, index) => selected.includes(index.toString()));
        console.log(selectedCollections);
        const result = await api.uploadCollections(selectedCollections);
        console.log(result);
    }

    return (
        <div>
            <Navbar bg='dark' variant='dark' expand='md'>
                <LinkContainer to='/'>
                    <Navbar.Brand>osu!Collector</Navbar.Brand>
                </LinkContainer>
                <Navbar.Toggle aria-controls='basic-navbar-nav' />
                <Navbar.Collapse id='basic-navbar-nav' className='justify-content-between'>
                    <Nav>
                        <LinkContainer to='/recent'>
                            <Nav.Link>Recent</Nav.Link>
                        </LinkContainer>

                        <LinkContainer to='/popular?range=alltime'>
                            <Nav.Link>Popular</Nav.Link>
                        </LinkContainer>

                        <LinkContainer to='/users'>
                            <Nav.Link>Users</Nav.Link>
                        </LinkContainer>

                        <LinkContainer to='/subscribe'>
                            <Nav.Link>Subscribe</Nav.Link>
                        </LinkContainer>

                    </Nav>
                    
                    <Form onSubmit={searchSubmit} className='mx-4 w-25'>
                        <InputGroup>
                            <FormControl
                                onChange={(e) => setSearchBarInput(e.target.value)}
                                type='search'
                                style={{borderTopLeftRadius: 10, borderBottomLeftRadius: 10}}
                                placeholder='tech, sotarks, camellia'/>
                            <Button
                                type='submit'
                                variant={searchBarInput.trim() === '' ? 'outline-primary' : 'primary'}
                                {...{disabled: searchBarInput.trim() === ''}}>
                                Search
                            </Button>
                        </InputGroup>
                    </Form>

                    <div>
                        {/* TODO: check if user is logged in */}
                        <Button className="mx-3" onClick={() => setUploadModalIsOpen(true)}> Upload </Button>

                        {user ? <UserBadge user={user}/> : user === null ? <LoginButton/> : null}
                        {/* 
                            Design plan:
                            log in button on the top right when not signed in
                            when signed in, display username + avatar with a dropdown menu 
                            dropdown menu includes 'my profile', log out, etc 
                        */}
                    </div>
                </Navbar.Collapse>
            </Navbar>
            <Modal className="upload-modal" open={uploadModalIsOpen} onClose={() => setUploadModalIsOpen(false)} >
                <h3>1. Open <a href='https://osu.ppy.sh/wiki/en/osu%21_File_Formats/Db_%28file_format%29#collection.db'>collection.db</a></h3>
                collection.db is a file that contains all of your osu! collections. It is located in your osu! install folder. Example: 
                <pre className='bg-light my-2 py-1 px-3'><code>
                    C:\Users\jun\AppData\Local\osu!\collection.db
                </code></pre>
                <br></br>
                <Form>
                    <div className="dragon-drop" {...getRootProps()}>
                        <input {...getInputProps()} />
                        {
                            file != null ? 
                                file.name 
                                :
                                isDragActive ?
                                    <p>Drop the file here ...</p> 
                                    :
                                    <p>Choose a file or drag it here.</p>
                        }
                    </div>
                    <br/>
                    { collections.length > 0 && 
                        <div>
                            <h3>2. Select which collections to upload</h3>
                            <div className='mb-3' style={{height: 500, overflowY: 'scroll'}}>
                                {collections.map((collection, index) => 
                                    <Card key={index} className='shadow-sm mx-3 my-2 py-2 px-4'>
                                        <Row>
                                            <Col>
                                                {collection.name}
                                            </Col>
                                            <Col>
                                                20 beatmaps
                                            </Col>
                                            <Col xs={1}>
                                                <Form.Check checked={selected.find(value => parseInt(value) == index) !== undefined} value={index} onChange={handleChange}/>
                                            </Col>
                                        </Row>
                                    </Card>
                                )}
                            </div>
                            <br></br>
                            <div className="upload-buttons">
                                <Button onClick={checkAll}>{ selected.length == collections.length ? 'Deselect All' : 'Select All'}</Button>
                                {/* <Button variant='secondary'>Cancel</Button> */}
                                <Button onClick={submit}>Upload</Button>
                            </div>
                        </div>
                    }
                </Form>
            </Modal>
        </div>
    )
}

// NavigationBar.propTypes = {
//     searchText: PropTypes.string,
//     setSearchText: PropTypes.func.isRequired
// }
NavigationBar.propTypes = {
    user: PropTypes.object,
}

export default NavigationBar;