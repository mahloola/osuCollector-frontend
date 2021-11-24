import { useState } from 'react';
import { Button, Card, Modal } from '../bootstrap-osu-collector';
import { ChatFill } from 'react-bootstrap-icons'
import styled, { css } from 'styled-components'
import { Image } from 'react-bootstrap';

const CommentsPreviewCard = styled(Card)`
    &:hover {
        ${props => props.theme.darkMode ? css`
            background-color: ${props => props.theme.primary25}
        ` : css`
            background-color: #eee
        `}
    }
`

function Comments({ comments, user }) {

    const [commentsModalIsOpen, setCommentsModalIsOpen] = useState(false);
    const [unsavedComment, setUnsavedComment] = useState('')

    const submitComment = () => {
        console.log('comment submitted')
        setCommentsModalIsOpen(false)
    }

    return (
        <>
            <CommentsPreviewCard
                className='p-2 mt-4 shadow'
                style={{ cursor: 'pointer' }}
                onClick={() => {
                    if (!user) {
                        alert('You must be logged in to comment');
                        return;
                    }
                    setCommentsModalIsOpen(true)
                }}
            >
                {comments ?
                    comments.slice(0, 3).map((comment, index) =>
                        <div key={index} className='d-flex'>
                            <Image className='collection-card-uploader-avatar shadow-sm border mr-3' src={`https://a.ppy.sh/${user.id}`} roundedCircle />
                        </div>
                    )
                    :
                    <div className='d-flex justify-content-center align-items-center'>
                        <h3 className='text-muted mr-2'>
                            <ChatFill />
                        </h3>
                        <p className='mb-0 text-muted'>No comments. Leave a comment!</p>
                    </div>
                }

            </CommentsPreviewCard>

            {/* full comments view */}
            <Modal
                show={commentsModalIsOpen}
                onHide={() => setCommentsModalIsOpen(false)}
                size='lg'
                centered
            >
                {comments?.length > 0 &&
                    <>
                        <div></div>
                        <hr />
                    </>
                }
                <div className='p-3'>
                    <h5 className='mb-3'>Leave a comment</h5>
                    <div className='d-flex'>
                        <div className=''>
                            {user?.id && <Image className='collection-card-uploader-avatar shadow-sm border mr-3' src={`https://a.ppy.sh/${user.id}`} roundedCircle />}
                        </div>
                        <div className='flex-fill'>
                            <textarea
                                className='p-2 mb-2'
                                value={unsavedComment}
                                maxLength={3000}
                                onChange={event => setUnsavedComment(event.target.value)}
                                style={{
                                    minHeight: '80px',
                                    width: '100%',
                                    boxSizing: 'border-box'
                                }}
                            />
                            <div className='d-flex justify-content-end mb-0'>
                                <Button
                                    onClick={submitComment}
                                >
                                    <div className='d-flex justify-content-center align-items-center'>
                                        <ChatFill className='mr-2' />
                                        Comment
                                    </div>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    )
}

export default Comments
