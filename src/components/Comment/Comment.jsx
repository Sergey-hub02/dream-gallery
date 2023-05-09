import React from "react";
import "./Comment.css";


/**
 * Комментарий
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
export const Comment = props => {
  return (
      <div className="Comment py-3 px-4 mb-2">
        <header className="comment-header">
          <h5 className="mb-1 fw-bold">{props.creator.username} ({props.creator.email})</h5>
          <div>Опубликовано: {props.createdAt}</div>
        </header>

        <div className="comment-content pt-2">{props.content}</div>
      </div>
  );
}
