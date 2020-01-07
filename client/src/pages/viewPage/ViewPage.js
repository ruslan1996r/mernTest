import React, { useEffect, useState, Fragment } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

import {
  getPostById,
  deletePostById,
  updatePost
} from "../../redux/post-reducer";
import "./index.scss";

const ViewPage = props => {
  let paramId = props.match.params.id;
  //edit mode
  const [edit, setEdit] = useState(false);
  //input state
  const [title, setTitle] = useState(null);
  const [content, setContent] = useState(null);
  const [cover, setCover] = useState(null);
  //file state
  const [file, setFile] = useState("");
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");

  const updateExistingPost = e => {
    e.preventDefault();
    props
      .updatePost(
        title,
        content,
        props.userData.data.cover,
        props.userData.data.covername,
        cover,
        paramId
      )
      .then(() => props.history.push("/main"));
  };

  const saveCover = e => {
    e.preventDefault();
    setCover(e.target.files);

    //Show image
    let reader = new FileReader();
    let newFile = e.target.files[0];
    reader.onloadend = () => {
      setFile(newFile);
      setImagePreviewUrl(reader.result);
    };
    newFile && reader.readAsDataURL(newFile);
  };

  let $imagePreview = null;
  if (imagePreviewUrl) {
    $imagePreview = <img src={imagePreviewUrl} />;
  } else {
    $imagePreview = <React.Fragment />;
  }

  useEffect(() => {
    props.getPostById(paramId);
  }, [paramId]);

  const getTime = date => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];
    let minutes = new Date(date).getMinutes();
    let hours = new Date(date).getHours();
    let day = new Date(date).getDay();
    let month = months[new Date(date).getMonth()];
    return <span>{`${day} ${month} at ${minutes}:${hours}`}</span>;
  };
  const deletePost = id => {
    props.deletePostById(id).then(() => props.history.push("/main"));
  };

  if (!props.userData || !props.currentUser) {
    return <div>LOADING...</div>;
  }
  const { data } = props.userData;

  let userInfo = (
    <div className="user__form">
      <h2>{data.title}</h2>
      <img src={data.cover} alt={data.covername} />
      <p>{data.content}</p>
      <p>The post was created: {getTime(data.date)}</p>
    </div>
  );

  let editInfo = (
    <Fragment>
      <h2>Update Post</h2>
      <div className="edit">
        <form onSubmit={updateExistingPost} className="edit__form">
          <div className="edit__form-field">
            <label htmlFor="title">Title</label>
            <input
              //defaultValue={data.title}
              placeholder="Enter new title"
              id="title"
              type="text"
              name="title"
              required
              onChange={e => setTitle(e.target.value)}
            />
          </div>
          <div className="edit__form-field">
            <label htmlFor="content">Content</label>
            <textarea
              placeholder="Enter new content"
              id="content"
              type="text"
              name="content"
              //defaultValue={data.content}
              required
              onChange={e => setContent(e.target.value)}
            />
          </div>
          <div className="edit__form-field">
            <label htmlFor="cover">Select avatar</label>
            <input
              type="file"
              name="cover"
              id="cover"
              required
              onChange={e => saveCover(e)}
            />
          </div>

          <button type="submit" value="create post">
            Update post
          </button>
        </form>
        {$imagePreview}
      </div>
    </Fragment>
  );

  return (
    <div className="view">
      {edit ? editInfo : userInfo}
      {props.currentUser.data._id === data.owner && (
        <div className="view__owner">
          <button onClick={() => deletePost(data._id)}>Delete post</button>
          <button onClick={() => setEdit(!edit)}>
            {edit ? "Close edit" : "Edit post"}
          </button>
        </div>
      )}
    </div>
  );
};
let mapStateToProps = state => {
  return {
    userData: state.postReducer.currentPost,
    currentUser: state.authReducer.userData
  };
};

export default withRouter(
  connect(mapStateToProps, { getPostById, deletePostById, updatePost })(
    ViewPage
  )
);
