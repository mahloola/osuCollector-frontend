import { useState } from 'react'
import { Button, Card, CardFooter, Modal } from '../bootstrap-osu-collector'
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'
import { ChatFill, FlagFill, HandThumbsUpFill } from 'react-bootstrap-icons'
import styled, { css } from 'styled-components'
import { Image } from 'react-bootstrap'
import moment from 'moment'
import * as api from '../../utils/api'
import './Comments.css'

const ClickableCard = styled(Card)`
  cursor: pointer;
  &:hover {
    ${(props) =>
      props.theme.darkMode
        ? css`
            background-color: ${(props) => props.theme.primary25};
          `
        : css`
            background-color: #eee;
          `}
  }
`

const ClickableCardFooter = styled(CardFooter)`
  cursor: pointer;
  &:hover {
    ${(props) =>
      props.theme.darkMode
        ? css`
            background-color: ${(props) => props.theme.primary25};
          `
        : css`
            background-color: #eee;
          `}
  }
`

const sortByLikes = (a, b) => (b.upvotes?.length || 0) - (a.upvotes?.length || 0)
const sortByDate = (a, b) => b.date._seconds - a.date._seconds

function Comment({ collectionId, comment, user }) {
  const [localLikeOffset, setlocalLikeOffset] = useState(undefined)
  const [locallyDeleted, setLocallyDeleted] = useState(false)
  const [reported, setReported] = useState(false)

  if (!comment) {
    return <div />
  }

  const relativeDate = moment.unix(comment.date._seconds).fromNow()

  const likeComment = (commentId) => {
    if (!user) {
      alert('You must be logged in to like comments')
      return
    }
    const remove =
      localLikeOffset === undefined
        ? comment.upvotes.includes(user.id)
        : localLikeOffset === -0.5 || localLikeOffset === 1 // wtf

    // update locally
    const newComment = { ...comment }
    const upvotes = new Set(newComment.upvotes)
    if (remove) {
      upvotes.delete(user.id)
    } else {
      upvotes.add(user.id)
    }
    newComment.upvotes = Array.from(upvotes)
    if (localLikeOffset === undefined) {
      setlocalLikeOffset(comment.upvotes.includes(user.id) ? -1 : 1)
    } else {
      // wtf
      setlocalLikeOffset(Math.abs(localLikeOffset) > 0.75 ? localLikeOffset / 2 : localLikeOffset * 2)
    }

    // update on server
    try {
      api.likeComment(collectionId, commentId, remove)
    } catch (err) {
      console.error(err)
    }
  }

  // delete comment
  const deleteComment = async () => {
    setLocallyDeleted(true)
    try {
      await api.deleteComment(collectionId, comment.id)
    } catch (err) {
      console.error(err)
    }
  }

  // post comment
  const reportComment = async () => {
    setReported(true)
    try {
      await api.reportComment(collectionId, comment.id)
    } catch (err) {
      console.error(err)
    }
  }

  if (locallyDeleted) {
    return <i className='text-muted'>comment deleted</i>
  }
  return (
    <div className='d-flex'>
      {/* commenter avatar */}
      <Image
        className='mr-3 mt-2 collection-card-uploader-avatar shadow-sm border'
        src={`https://a.ppy.sh/${comment.userId}`}
        roundedCircle
      />
      <div className='flex-fill'>
        {/* username & date */}
        <div className='d-flex justify-content-between'>
          <div>
            <small className='text-muted'>
              {' '}
              {comment.username} - {relativeDate}
            </small>
            {process.env.NODE_ENV === 'development' && <small className='text-muted'> - {comment.id}</small>}
          </div>
          {/* report or delete */}
          <div className='mr-4'>
            {comment.userId === user?.id ? (
              <small className='text-muted' style={{ cursor: 'pointer' }} onClick={deleteComment}>
                <u>delete</u>
              </small>
            ) : reported ? (
              <small className='text-muted'>reported!</small>
            ) : (
              <small className='text-muted' style={{ cursor: 'pointer' }} onClick={reportComment}>
                <FlagFill />
              </small>
            )}
          </div>
        </div>
        {/* comment text */}
        <div style={{ whiteSpace: 'pre-line' }}>{comment.message}</div>
        {/* likes */}
        <div className='d-flex text-secondary mt-1'>
          <small className='noselect' onClick={() => likeComment(comment.id)} style={{ cursor: 'pointer' }}>
            {localLikeOffset === undefined ? (
              <>
                {comment.upvotes.includes(user?.id) ? (
                  <HandThumbsUpFill className='mr-1' style={{ marginTop: -5, color: '#348dff' }} />
                ) : (
                  <HandThumbsUpFill className='mr-1' style={{ marginTop: -5 }} />
                )}
                {comment.upvotes?.length || 0}
              </>
            ) : (
              <>
                {localLikeOffset === -0.5 || localLikeOffset === 1 ? ( // wtf
                  <HandThumbsUpFill className='mr-1' style={{ marginTop: -5, color: '#348dff' }} />
                ) : (
                  <HandThumbsUpFill className='mr-1' style={{ marginTop: -5 }} />
                )}
                {(comment.upvotes?.length || 0) + (Math.abs(localLikeOffset) < 1 ? 0 : localLikeOffset) /* wtf */}
              </>
            )}
          </small>
        </div>
      </div>
    </div>
  )
}

function Comments({ collectionId, comments, user, refreshCollection }) {
  const [commentsModalIsOpen, setCommentsModalIsOpen] = useState(false)
  const [sortCommentsBy, setSortCommentsBy] = useState('likes')
  const [unsavedComment, setUnsavedComment] = useState('')
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [posting, setPosting] = useState(false)

  const postComment = async () => {
    if (posting) {
      return
    }
    if (!user) {
      alert('You must be logged in to comment')
      return
    }
    // check for duplicates
    const duplicateFound = comments?.find(
      (comment) => comment.userId === user.id && comment.message.trim() === unsavedComment.trim()
    )
    if (duplicateFound) {
      alert("don't send the same comment twice")
      return
    }

    setPosting(true)
    try {
      await api.postComment(collectionId, unsavedComment)
      setPosting(false)
    } catch (err) {
      alert(err)
      setPosting(false)
    }
    setCommentsModalIsOpen(false)
    setShowSuccessModal(true)
    refreshCollection()
  }

  const hideModal = () => {
    setCommentsModalIsOpen(false)
    refreshCollection()
  }

  return (
    <>
      {comments?.length > 0 ? (
        <Card className='p-0 mt-4 shadow'>
          <div className='px-3 pt-2 pb-2'>
            {/* top rated comment */}
            <Comment collectionId={collectionId} comment={comments.sort(sortByLikes)[0]} user={user} />
          </div>
          <ClickableCardFooter onClick={() => setCommentsModalIsOpen(true)}>
            <div className='text-center'>View all {comments.length} comment(s)</div>
          </ClickableCardFooter>
        </Card>
      ) : (
        <ClickableCard
          className='mt-4 p-2'
          onClick={() => {
            if (!user && (!comments || comments.length === 0)) {
              alert('You must be logged in to comment')
              return
            }
            setCommentsModalIsOpen(true)
          }}
        >
          <div className='d-flex justify-content-center align-items-center'>
            <h3 className='text-muted mr-2'>
              <ChatFill />
            </h3>
            <p className='mb-0 text-muted'>No comments. Leave a comment!</p>
          </div>
        </ClickableCard>
      )}

      {/* full comments view */}
      <Modal show={commentsModalIsOpen} onHide={hideModal} size='lg' centered>
        <div className='px-4 py-3 d-flex flex-column' style={{ maxHeight: '93vh' }}>
          {/* comments */}
          {comments?.length > 0 && (
            <>
              <div className='flex-fill overflow-auto mb-3'>
                <div className='mb-2 d-flex justify-content-between'>
                  <h5 className='mr-2'>
                    {comments?.length} Comment{comments?.length > 1 && 's'}
                  </h5>
                  <DropdownButton className='mt-1 mr-1' variant='secondary' size='sm' title='Sort by'>
                    <Dropdown.Item active={sortCommentsBy === 'likes'} onClick={() => setSortCommentsBy('likes')}>
                      Likes
                    </Dropdown.Item>
                    <Dropdown.Item active={sortCommentsBy === 'date'} onClick={() => setSortCommentsBy('date')}>
                      Recent
                    </Dropdown.Item>
                  </DropdownButton>
                </div>
                {comments.sort(sortCommentsBy === 'likes' ? sortByLikes : sortByDate).map((comment, index) => {
                  const last = index === comments.length - 1
                  return (
                    <div key={index}>
                      <Comment collectionId={collectionId} comment={comment} user={user} />
                      {!last && <hr className='my-3 text-secondary' />}
                    </div>
                  )
                })}
              </div>
              <hr className='mt-0 mb-3' />
            </>
          )}
          {/* post comment */}
          <div>
            <h5 className='mb-3'>Leave a comment</h5>
            <div className='d-flex'>
              <div className=''>
                {user?.id && (
                  <Image
                    className='collection-card-uploader-avatar shadow-sm border mr-3'
                    src={`https://a.ppy.sh/${user.id}`}
                    roundedCircle
                  />
                )}
              </div>
              <div className='flex-fill'>
                <textarea
                  className='p-2 mb-2'
                  value={unsavedComment}
                  maxLength={200}
                  onChange={(event) => setUnsavedComment(event.target.value)}
                  style={{
                    minHeight: '80px',
                    width: '100%',
                    boxSizing: 'border-box',
                  }}
                />
                <div className='d-flex justify-content-end mb-0'>
                  <Button onClick={postComment} disabled={posting}>
                    <div className='d-flex justify-content-center align-items-center'>
                      <ChatFill className='mr-2' />
                      Comment
                    </div>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
      <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)} size='sm' centered>
        <div className='p-4 text-center'>Comment posted!</div>
      </Modal>
    </>
  )
}

export default Comments
