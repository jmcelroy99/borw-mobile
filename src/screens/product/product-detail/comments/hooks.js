import { useState, useEffect } from 'react';

const useCommentsFacade = (listComments) => {
  const [comment, setComment] = useState('')
  const [comments, setComments] = useState([])
  const [isExpand, setExpand] = useState(false)

  const _onChangeComment = value => {
      setComment(value)
  }

  useEffect(() => {
    if (listComments) {
      if (listComments.length > 5) {
        const firstBatch = listComments.slice(0, 5)
        setComments(firstBatch)
      } else {
        setComments(listComments)
      }
    }
  }, [listComments])

  const _onShowAllComments = () => {
    setComments(listComments)
    setExpand(true)
  }

  const _onCollapse = () => {
    setComments(listComments.slice(0, 5))
    setExpand(false)
  }

  return {
    comment,
    comments,
    isExpand,
    _onShowAllComments,
    _onChangeComment,
    _onCollapse,
  }
}

export {
  useCommentsFacade
}