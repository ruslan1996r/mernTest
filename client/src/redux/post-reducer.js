import { customAxios } from "../api/customAxios";

//ACTION TYPES
const GET_ALL_POSTS = "GET_ALL_POSTS";
const GET_MY_POSTS = "GET_MY_POSTS";
const GET_POST_BYID = "GET_POST_BYID";

//REDUCERS
let initialState = {
  allPosts: [],
  myPosts: [],
  currentPost: null
};

const postsReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case GET_ALL_POSTS: {
      return {
        ...state,
        allPosts: payload
      };
    }
    case GET_MY_POSTS: {
      return {
        ...state,
        myPosts: payload
      };
    }
    case GET_POST_BYID: {
      return {
        ...state,
        currentPost: payload
      };
    }
    default:
      return state;
  }
};

//ACTIONS
export const allPosts = posts => ({
  type: GET_ALL_POSTS,
  payload: posts
});

export const getPost = post => ({
  type: GET_POST_BYID,
  payload: post
});

export const getMyPosts = userId => ({
  type: GET_MY_POSTS,
  payload: userId
});

//THUNKS
export const createPost = (title, content, cover) => {
  const formData = new FormData();
  formData.append("title", title);
  formData.append("content", content);
  formData.append("cover", cover[0], cover[0]["filename"]);

  return async dispatch => {
    await customAxios.post("/post/create", formData);
  };
};

export const updatePost = (
  title,
  content,
  oldcover,
  oldcovername,
  cover,
  postId
) => {
  const formData = new FormData();
  formData.append("title", title);
  formData.append("content", content);
  formData.append("oldcover", oldcover);
  formData.append("oldcovername", oldcovername);
  //Если файл есть, добавь в форм дату и обнови пост. Если файла нет, сделай запрос без него
  if (cover.length > 0 && cover !== undefined) {
    formData.append("cover", cover[0], cover[0]["filename"]);
  }
  return async dispatch => {
    await customAxios.put(`/post/update/${postId}`, formData);
  };
};

export const getAllPosts = () => {
  return async dispatch => {
    let response = await customAxios.get("/post/");
    dispatch(allPosts(response.data));
  };
};

export const deletePostById = id => {
  return async dispatch => {
    await customAxios.delete(`/post/delete/${id}`);
  };
};

export const getPostById = id => {
  return async dispatch => {
    let response = await customAxios.get(`/post/${id}`);
    dispatch(getPost(response.data));
  };
};

export const getAllMyPosts = () => {
  return async dispatch => {
    let response = await customAxios.get("/post/myPosts");
    dispatch(getMyPosts(response.data));
  };
};

export default postsReducer;
