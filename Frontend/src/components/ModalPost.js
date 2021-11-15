/* eslint-disable jsx-a11y/img-redundant-alt */
import { useRef, useState } from "react";

import "../css/Components.css";
import { ReactComponent as Plus } from "../assets/times-solid.svg";
import { ReactComponent as ImageLogo } from "../assets/images-solid.svg";

function ModalPost(props) {
  let setModalState = props.setModalState;
  let user = JSON.parse(localStorage.getItem("user"));

  const inputFile = useRef(null);
  let [test, setTest] = useState();

  const onButtonClick = () => {
   inputFile.current.click();
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
          <textarea className="modal-input" />
          {test && <img src={URL.createObjectURL(test)} alt="post picture pick"/>}
          <input type='file' id='file' ref={inputFile} style={{display: 'none'}} onChange={(event) => setTest(event.target.files[0])}/>
          <div className="addimage-div" onClick={onButtonClick}>
        {!test ? <p>Add image</p> : <p>Change image</p>}
            <ImageLogo className="image-logo"/>
          </div>
          <div className="send-post">
            <h3>Send</h3>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalPost;
