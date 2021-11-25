import { useState } from 'react';
import { Button, Card, CardFooter, Modal } from '../bootstrap-osu-collector';
import { ChatFill, HandThumbsUpFill } from 'react-bootstrap-icons'
import styled, { css } from 'styled-components'
import { Image } from 'react-bootstrap';
import moment from 'moment'

const CommentsPreviewCard = styled(Card)`
    &:hover {
        ${props => props.theme.darkMode ? css`
            background-color: ${props => props.theme.primary25}
        ` : css`
            background-color: #eee
        `}
    }
`

function Comment({ comment, user }) {
    const relativeDate = moment.unix(comment.date._seconds).fromNow()

    const likeComment = commentId => {
        if (!user) {
            alert('You must be logged in to like comments')
            return
        }
        console.log('comment liked: ' + commentId)
    }

    return <div className='d-flex'>
        {/* user avatar */}
        <Image className='mr-3 mt-2 collection-card-uploader-avatar shadow-sm border' src={`https://a.ppy.sh/${comment.userId}`} roundedCircle />
        <div className='flex-fill'>
            {/* username & date */}
            <small className='text-muted'> {comment.username} - {relativeDate} </small>
            {/* comment text */}
            <div style={{ whiteSpace: 'pre-line' }}>{comment.message}</div>
            {/* likes */}
            <div className='d-flex text-sm text-secondary mt-1' onClick={() => likeComment(comment.id)}>
                <small>
                    <HandThumbsUpFill className='mr-1' style={{marginTop: -5}}/>
                    {comment.likes?.length || 0}
                </small>
            </div>
        </div>
    </div>
}

function Comments({ comments, user }) {

    const [commentsModalIsOpen, setCommentsModalIsOpen] = useState(false);
    const [unsavedComment, setUnsavedComment] = useState('')

    const postComment = () => {
        if (!user) {
            alert('You must be logged in to comment')
            return
        }
        console.log('comment posted')
        setCommentsModalIsOpen(false)
    }

    return (
        <>
            <CommentsPreviewCard
                className='p-0 mt-4 shadow'
                style={{ cursor: 'pointer' }}
                onClick={() => {
                    if (!user && (!comments || comments.length === 0)) {
                        alert('You must be logged in to comment');
                        return;
                    }
                    setCommentsModalIsOpen(true)
                }}
            >
                {comments ?
                    <div>
                        <div className='px-3 pt-2 pb-3'>
                            {comments.slice(0, 3).map((comment, index) => {
                                const last = index === comments.length - 1
                                return <>
                                    <Comment key={index} comment={comment} user={user} />
                                    {!last && <hr className='my-1' />}
                                </>
                            })}
                        </div>
                        <CardFooter>
                            <div className='text-center'>View all {comments.length} comment(s)</div>
                        </CardFooter>
                    </div>
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
                        {comments.slice(0, 3).map((comment, index) => {
                            const last = index === comments.length - 1
                            return <>
                                <Comment key={index} comment={comment} user={user} />
                                {last && <hr className='my-1' />}
                            </>
                        })}
                        <hr className='my-4' />
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
                                    onClick={postComment}
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
