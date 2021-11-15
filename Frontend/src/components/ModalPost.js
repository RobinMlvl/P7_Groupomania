/* eslint-disable jsx-a11y/img-redundant-alt */
import { useRef, useState } from "react";

import "../css/Components.css";
import { ReactComponent as Plus } from "../assets/times-solid.svg";
import { ReactComponent as ImageLogo } from "../assets/images-solid.svg";

import Axios from "axios";

function ModalPost(props) {
  let setModalState = props.setModalState;
  let user = JSON.parse(localStorage.getItem("user"));
  let token = localStorage.getItem("token");

  const inputFile = useRef(null);
  let [imagePost, setImagePost] = useState();
  let [textPost, setTextPost] = useState("");

  const onButtonClick = () => {
    inputFile.current.click();
  };

  const handleSend = () => {
    const data = new FormData();
    data.append("image", imagePost);
    data.append("text", textPost);

    const headers = {
      Authorization: `Bearer ${token}`,
    };
    console.log(data.get("image"));
    Axios.post("http://localhost:5000/feed/send", data, { headers }).then(
      (res) => {
        console.log(res.data);
      }
    );
  };

  return (
    <div className="modal">
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
      </div>
    </div>
  );
}

export default ModalPost;
