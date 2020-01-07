import React, { useEffect } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { logoutUser } from "../../redux/auth-reducer";
import { getAllMyPosts } from "../../redux/post-reducer";
import "./index.scss";

const ProfilePage = ({
  userData,
  logoutUser,
  getAllMyPosts,
  myPosts,
  history
}) => {
  useEffect(() => {
    getAllMyPosts();
  }, []);

  const openPost = id => history.push(`/view/${id}`);

  if (!myPosts) {
    return <div>LOADING...</div>;
  }

  return (
    <div className="profile">
      <h2>My profile</h2>
      <div className="profile__container">
        <div className="profile__info">
          <p>{userData.email}</p>
          <img src={userData.cover} alt={userData.covername} />
          <button onClick={() => logoutUser()}>Logout</button>
        </div>
        <div className="profile__posts">
          <h3>My posts</h3>
          {myPosts.length === 0 ? (
            <p>This user has not yet created posts</p>
          ) : (
            myPosts.map(post => {
              return (
                <div key={post._id} className="profile__posts-elem">
                  <img
                    src={post.cover}
                    alt={post.covername}
                    onClick={() => openPost(post._id)}
                  />
                  <p>{post.title}</p>
                  <p>{post.content}</p>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

let mapStateToProps = state => {
  return {
    userData: state.authReducer.userData.data,
    myPosts: state.postReducer.myPosts.data
  };
};

export default withRouter(
  connect(mapStateToProps, { logoutUser, getAllMyPosts })(ProfilePage)
);
