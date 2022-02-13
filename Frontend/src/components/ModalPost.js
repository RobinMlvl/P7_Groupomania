/* eslint-disable jsx-a11y/img-redundant-alt */
import { useRef, useState, useEffect } from "react";

import "../css/Components.css";
import { ReactComponent as Plus } from "../assets/times-solid.svg";
import { ReactComponent as ImageLogo } from "../assets/images-solid.svg";

import Axios from "axios";

function ModalPost(props) {
  let setModalState = props.setModalState;
  let setModalState2 = props.setModalState2;
  let refresh = props.refresh;
  let modify = props.modify;
  let modifyItem = props.item;

  console.log(modifyItem);

  let user = JSON.parse(localStorage.getItem("user"));
  let token = localStorage.getItem("token");

  const inputFile = useRef(null);
  let [imagePost, setImagePost] = useState();
  let [textPost, setTextPost] = useState("");

  const onButtonClick = () => {
    inputFile.current.click();
  };

useEffect(() => {
  if (modify) {
    setTextPost(modifyItem.text);
    setImagePost(modifyItem.image);
  }
}, [modify, modifyItem])

  const handleSend = (id) => {
    const data = new FormData();
    data.append("image", imagePost);
    data.append("text", textPost);

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    if (modify) {
      Axios.put(`http://localhost:5000/feed/update/${id}`, data, { headers }).then(
      (res) => {
        setModalState2(false);
        refresh();
      }
    );
    } else {
      Axios.post("http://localhost:5000/feed/send", data, { headers }).then(
        (res) => {
          setModalState(false);
          refresh();
        }
      );
    }
  };

  return (
    <div className="modal">
      {modify ? <div className="window-modal">
        <div className="title">
          <h1 onClick={() => console.log(user)}>Update a post</h1>
          <Plus className="plusSvg" onClick={() => setModalState2(false)} />
        </div>
        <hr />
        <div className="center-post">
          <textarea
            className="modal-input"
            value={textPost}
            onChange={(event) => {
              setTextPost(event.target.value);
              console.log(typeof(imagePost) === "string");
            }}
          />
          {imagePost && (
            <img className="modal-image" src={modify && typeof(imagePost) === "string" ? imagePost : URL.createObjectURL(imagePost)} alt="post picture pick"/>
          )}
          <input
            type="file"
            name="image"
            ref={inputFile}
            style={{ display: "none" }}
            onChange={(event) => setImagePost(event.target.files[0])}
          />
          <div className="addimage-div" onClick={onButtonClick}>
            {!imagePost ? <p>Add image</p> : <p>Change image</p>}
            <ImageLogo className="image-logo" />
          </div>
          <div className="send-post" onClick={() => handleSend(modifyItem.id)}>
            <h3>Update</h3>
          </div>
        </div>
      </div> 
      
      : 
      
      <div className="window-modal">
      <div className="title">
        <h1 onClick={() => console.log(user)}>add a post</h1>
        <Plus className="plusSvg" onClick={() => setModalState(false)} />
      </div>
      <hr />
      <div className="center-post">
        <textarea
          className="modal-input"
          value={textPost}
          onChange={(event) => {
            setTextPost(event.target.value);
          }}
        />
        {imagePost && (
          <img src={URL.createObjectURL(imagePost)} alt="post picture pick" />
        )}
        <input
          type="file"
          name="image"
          ref={inputFile}
          style={{ display: "none" }}
          onChange={(event) => setImagePost(event.target.files[0])}
        />
        <div className="addimage-div" onClick={onButtonClick}>
          {!imagePost ? <p>Add image</p> : <p>Change image</p>}
          <ImageLogo className="image-logo" />
        </div>
        <div className="send-post" onClick={handleSend}>
          <h3>Send</h3>
        </div>
      </div>
    </div>}
    </div>
  );
}

export default ModalPost;
