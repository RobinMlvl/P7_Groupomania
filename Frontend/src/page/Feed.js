import NavBar from "../components/NavBar";
import logo from "../assets/IMG_0567.jpg";
import { ReactComponent as Like } from "../assets/thumbs-up-regular.svg";
import { ReactComponent as Dislike } from "../assets/thumbs-down-regular.svg";
import { ReactComponent as Plus } from "../assets/plus-solid.svg";
import { useState } from "react";
import ModalPost from "../components/ModalPost";


import "../css/Home.css";

function Feed() {
  let post = [
    {
      userId: "J2YG3GHY",
      name: "mitchell",
      profileUrl: logo,
      imageUrl: "../assets/icon.svg",
      content: "bloclskdfjdokodfodfjjfjjfjjsjskejkdjjfjjfjosj",
      dateCreated: "12 jan 2021",
    },
    {
      userId: "J2YGdqdffHY",
      name: "robert",
      profileUrl: logo,
      imageUrl: "../assets/icon.svg",
      content:
        "bloclskdfjsfvd dfgdb dgv sdw b bgb bfgdokodfodfjjfjjfjjsjskejkdjjfjjfjosj",
      dateCreated: "12 jan 2021",
    },
    {
      userId: "J2YG3GHY",
      name: "lusas",
      profileUrl: logo,
      imageUrl: "../assets/icon.svg",
      content:
        "bloclskdzfcfe  cqecq cscf cvf  s gv v g vdvgdfjdokodfodfjjfjjfjjsjskejkdjjfjjfjosj",
      dateCreated: "12 jan 2021",
      like: 4,
      dislike: 7,
      likeUser: ["tete", "gege"],
      dislikeUser: ["teeefefte", "gegeffe"],
      comments: [{userId: 'tre234', content: 'testststd'}]
    },
  ];

  let [modalState, setModalState] = useState(false);

  return (
    <>
      <NavBar />
      <main className="background">
      {modalState && <ModalPost setModalState={setModalState}/>}
        <div className="add-post" onClick={() => setModalState(true)}>
          <Plus className='plus-design' color="white"/>
            <h1>Add a post !</h1>
        </div>
        {post.map((item) => {
          return (
            <div className="post-design" key={Math.random()}>
              <div className="flexbox-horizontal">
                <img
                  src={item.profileUrl}
                  alt="profile of person"
                  className="profile-photo"
                />
                <div className="flexbox-colunm margin-left">
                  <p className="name">{item.name}</p>
                  <p className="date">{item.dateCreated}</p>
                </div>
              </div>
              <p>{item.content}</p>
              <div className='flexbox-horizontal center-flex'>
                <div className='flexbox-horizontal'>
                  <Like className="like" color="black" />
                  <p className='margin-left'>{item.like}</p>
                </div>
                <div className='flexbox-horizontal'>
                  <Dislike className="like" color="black" />
                  <p className='margin-left'>{item.dislike}</p>
                </div>
              </div>
              <hr/>
              {item.comments ? item.comments.map((test) => {
                  return <p key={test}>{test.content}</p>
              }) : <p>No comments</p>}
            </div>
          );
        })}
      </main>
    </>
  );
}

export default Feed;
