import React, { useEffect } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Link } from "react-router-dom";

import { getAllPosts } from "../../redux/post-reducer";
import "./index.scss";

const MainPage = props => {
  useEffect(() => {
    props.getAllPosts();
  }, []);

  const openPost = id => props.history.push(`/view/${id}`);

  if (!props.userData) {
    return <div>LOADING...</div>;
  }
  return (
    <div className="main">
      <h1>POSTS</h1>
      <div className="main__posts">
        {props.userData.map(post => {
          return (
            <div key={post._id} className="main__posts-elem">
              <img src={post.cover} alt={post.covername} />
              <div className="hover-area" onClick={() => openPost(post._id)}>
                <p>{post.title}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
let mapStateToProps = state => {
  return {
    userData: state.postReducer.allPosts.data
  };
};

export default withRouter(connect(mapStateToProps, { getAllPosts })(MainPage));
