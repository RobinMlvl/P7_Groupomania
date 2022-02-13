import NavBar from "../components/NavBar";
import logo from "../assets/icons8-user-50.png";
import { ReactComponent as Like } from "../assets/thumbs-up-regular.svg";
import { ReactComponent as Dislike } from "../assets/thumbs-down-regular.svg";
import { ReactComponent as Plus } from "../assets/plus-solid.svg";
import { ReactComponent as RightArrow } from "../assets/arrow-right-solid.svg";
import { ReactComponent as Delete } from "../assets/trash-alt-solid.svg";
import { useEffect, useState } from "react";
import ModalPost from "../components/ModalPost";

import Axios from "axios";

import "../css/Home.css";

function Feed() {
  let [modalState, setModalState] = useState(false);
  let [modalState2, setModalState2] = useState(false);
  let [post, setPost] = useState();
  let [user, setUser] = useState();
  let [myData, setData] = useState();

  let [modifyItem, setModifyItem] = useState();

  let token = localStorage.getItem("token");

  const refreshFeed = () => {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    Axios.get("http://localhost:5000/feed/allFeed", { headers }).then((res) => {
      setPost(res.data);
    });
  };

  let sendLike = (props, id) => {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    Axios.put(
      "http://localhost:5000/feed/like",
      { number: props, id: id },
      { headers }
    ).then((res) => {
      refreshFeed();
    });
  };

  let sendComment = (props, id) => {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    Axios.put(
      "http://localhost:5000/feed/comment",
      { comment: props, id: id },
      { headers }
    ).then((res) => {
      refreshFeed();
    });
  };

  let handleDelete = (id) => {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    Axios.delete(`http://localhost:5000/feed/deletepost/${id}`, {
      headers,
    }).then((res) => {
      refreshFeed();
    });
  };

  let handleModify = (item) => {
    setModifyItem(item);
    setModalState2(true);
  };

  // actif code: 1 like => 2 dislike => 0 neutral
  // send like code : 1 add like => 2 add dislike => 3 add like delete dislike => 4 add dislike delete like => 5 delete like => 6 delte dislike
  const handleLike = (type, id, stat) => {
    if (type === "like" && stat === 1) {
      sendLike(5, id);
    } else if (type === "like" && stat === 0) {
      sendLike(1, id);
    } else if (type === "like" && stat === 2) {
      sendLike(3, id);
    } else if (type === "dislike" && stat === 0) {
      sendLike(2, id);
    } else if (type === "dislike" && stat === 2) {
      sendLike(6, id);
    } else if (type === "dislike" && stat === 1) {
      sendLike(4, id);
    }
  };

  const deleteComment = (props, item, postId) => {
    let comment = JSON.parse(item.comment);
    let filter = comment.filter((el) => el.comment !== props.comment);

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    Axios.put(
      "http://localhost:5000/feed/deletecomment",
      {comment: filter, postId},
      { headers }
    ).then((res) => {
      refreshFeed();
    });
  };

  useEffect(() => {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    Axios.get("http://localhost:5000/feed/allFeed", { headers }).then((res) => {
      setPost(res.data);
    });
    Axios.get("http://localhost:5000/auth/alluser").then((res) => {
      setUser(res.data);
    });
    Axios.get("http://localhost:5000/auth/oneuser", { headers }).then((res) => {
      setData(res.data[0]);
    });
  }, [token]);

  return (
    <>
      <NavBar profile={true} />
      <main className="background">
        {modalState && (
          <ModalPost setModalState={setModalState} refresh={refreshFeed} />
        )}
        {modalState2 && (
          <ModalPost
            setModalState2={setModalState2}
            refresh={refreshFeed}
            modify={true}
            item={modifyItem}
          />
        )}
        <div className="add-post" onClick={() => setModalState(true)}>
          <Plus className="plus-design" color="white" />
          <h1>Add a post !</h1>
        </div>
        {post &&
          post
            .slice(0)
            .reverse()
            .map((item) => {
              let date = item.date;
              let postId = item.id;
              let arrayLiked = JSON.parse(item.userLiked);
              let arrayDisliked = JSON.parse(item.userDisliked);

              if (user && myData) {
                let userIndex = user.filter(
                  (el) => el.id === Number(item.userId)
                );
                let IdexArrayLiked = arrayLiked.findIndex(
                  (el) => el === myData.id
                );
                let IdexArrayDisliked = arrayDisliked.findIndex(
                  (el) => el === myData.id
                );

                let stat;
                if (IdexArrayLiked === -1 && IdexArrayDisliked === -1) {
                  stat = 0;
                } else if (IdexArrayLiked !== -1 && IdexArrayDisliked === -1) {
                  stat = 1;
                } else if (IdexArrayLiked === -1 && IdexArrayDisliked !== -1) {
                  stat = 2;
                }
                let comment;

                let commentParse = JSON.parse(item.comment);
                return (
                  <div className="post-design" key={Math.random()}>
                    <div className="top-post">
                      <div className="flexbox-horizontal">
                        {userIndex[0].photo ? (
                          <img
                            src={userIndex[0].photo}
                            alt="profile of person"
                            className="profile-photo2"
                          />
                        ) : (
                          <img
                            src={logo}
                            alt="profile of person"
                            className="profile-photo"
                          />
                        )}
                        <div className="flexbox-colunm margin-left">
                          <p className="name">{userIndex[0].username}</p>
                          <p className="date">{date}</p>
                        </div>
                      </div>
                      {(myData.id === Number(item.userId) ||
                        myData.admin === 1) && (
                        <div className="groupeMod">
                          <p onClick={() => handleDelete(item.id)}>Delete</p>
                          <p onClick={() => handleModify(item)}>Modify</p>
                        </div>
                      )}
                    </div>
                    <p className="top-text">{item.text}</p>
                    {item.image && (
                      <img
                        src={item.image}
                        alt="profile of person"
                        className="post-image"
                      />
                    )}
                    <div className="flexbox-horizontal center-flex">
                      <div
                        className={
                          IdexArrayLiked !== -1
                            ? "actif flexbox-horizontal"
                            : "like flexbox-horizontal"
                        }
                      >
                        <Like
                          onClick={() => handleLike("like", postId, stat)}
                          color=""
                        />
                      </div>
                      <div>
                        <p>{item.liked}</p>
                      </div>
                      <div
                        className={
                          IdexArrayDisliked !== -1
                            ? "actif flexbox-horizontal"
                            : "like flexbox-horizontal"
                        }
                      >
                        <Dislike
                          onClick={() => handleLike("dislike", postId, stat)}
                          color=""
                        />
                      </div>
                      <div>
                        <p>{item.disliked}</p>
                      </div>
                    </div>
                    <hr />
                    <p className="comment-title">Commentary</p>
                    <div className="input-comment">
                      <input
                        type="text"
                        value={comment}
                        placeholder="Comment this post !"
                        onChange={(event) => {
                          comment = event.target.value;
                        }}
                      />
                      <RightArrow
                        className="rightArrow"
                        onClick={() => sendComment(comment, postId)}
                      />
                    </div>

                    {/*  Comentary */}

                    {commentParse.length > 0 ? (
                      commentParse
                        .slice(0)
                        .reverse()
                        .map((test) => {
                          let commentIndex = user.filter(
                            (el) => el.id === Number(test.userId)
                          );
                          return (
                            <div key={Math.random()} className="block-comment">
                              {commentIndex[0] !== undefined ? (
                                <img
                                  src={commentIndex[0].photo}
                                  alt="profile of person"
                                  className="comment-photo2"
                                />
                              ) : (
                                <img
                                  src={logo}
                                  alt="profile of person"
                                  className="comment-photo"
                                />
                              )}
                              <div className="block-commentdiv">
                                {commentIndex[0] === undefined ? (
                                  <p>user deleted</p>
                                ) : (
                                  <p>{commentIndex[0].username}</p>
                                )}
                                <p>{test.comment}</p>
                                {myData.id === test.userId &&
                                  <div className="divDelete" onClick={() => deleteComment(test, item, postId)}>
                                  <p>Delete</p>
                                  <Delete className="icondelete"/>
                                  </div>
                                }
                              </div>
                            </div>
                          );
                        })
                    ) : (
                      <p>No comments</p>
                    )}
                  </div>
                );
              } else {
                return <p key={Math.random()}>loader</p>;
              }
            })}
      </main>
    </>
  );
}

export default Feed;
