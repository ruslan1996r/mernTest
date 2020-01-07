import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

import { createPost } from "../../redux/post-reducer";
import "./index.scss";

const CreatePage = props => {
  const [title, setTitle] = useState(null);
  const [content, setContent] = useState(null);
  const [cover, setCover] = useState(null);

  const [file, setFile] = useState("");
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");

  const createNewPost = e => {
    e.preventDefault();
    props
      .createPost(title, content, cover)
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

  //Image component
  let $imagePreview = null;
  if (imagePreviewUrl) {
    $imagePreview = <img className="imagePreview" src={imagePreviewUrl} />;
  } else {
    $imagePreview = <React.Fragment />;
  }
  return (
    <div className="create">
      <h2>Create Page</h2>
      <div className="create__container">
        <form onSubmit={createNewPost}>
          <div className="create__field">
            <label htmlFor="title">Title</label>
            <input
              placeholder="Enter title"
              id="title"
              type="text"
              name="title"
              required
              onChange={e => setTitle(e.target.value)}
            />
          </div>
          <div className="create__field">
            <label htmlFor="content">Content</label>
            <textarea
              placeholder="Enter content"
              id="content"
              type="text"
              name="content"
              required
              onChange={e => setContent(e.target.value)}
            />
          </div>
          <div className="create__field">
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
            Create post
          </button>
        </form>
        {$imagePreview}
      </div>
    </div>
  );
};

export default withRouter(connect(null, { createPost })(CreatePage));
