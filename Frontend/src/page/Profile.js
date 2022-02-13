import { useState, useEffect, useRef } from "react";
import Axios from "axios";
import NavBar from "../components/NavBar";
import { useNavigate } from "react-router-dom";
import "../css/Profile.css";
import { ReactComponent as Logo } from "../assets/user-circle-solid.svg";

function Profile() {
  let navigate = useNavigate();
  let [userProfile, setProfile] = useState();
  let [imageProfile, setImageProfile] = useState(false);
  let [change, setChange] = useState();

  const inputFile = useRef(null);

  let token = localStorage.getItem("token");

  let logOut = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  let addImg = () => {
    inputFile.current.click();
    setChange(true);
  };

  let deleteUser = () => {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    Axios.delete("http://localhost:5000/auth/deleteuser", { headers }).then(
      (res) => {
        console.log(res);
        logOut();
      }
    );
  };

  useEffect(() => {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    Axios.get("http://localhost:5000/auth/oneuser", { headers }).then((res) => {
      setProfile(res.data[0]);
    });
  }, [token]);

  const handleSend = () => {
    const data = new FormData();
    data.append("image", imageProfile);

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    Axios.put("http://localhost:5000/auth/updateuser", data, { headers }).then(
      (res) => {
        console.log(res.data);
setChange(false);      }
    );
  };


  return (
    <>
      <NavBar returnBack={true} />
      {userProfile && (
        <div className="center">
          <div className="card">
          <h1>My Profile</h1>
          <hr/>
            { imageProfile ? (
                <img
                  src={URL.createObjectURL(imageProfile)}
                  alt="profile pick"
                  className="background-profile"
                />
              ) : userProfile.photo ? (
              <img src={userProfile.photo} alt="profile" className="background-profile"/>
            ) :  (
              <div className="background-profile">
                <Logo />
              </div>
            )}
            <div className="add-image" onClick={addImg}>
            {imageProfile ||  userProfile.photo ? <p>Change picture profile</p> : <p>Add picture profile</p>}
            </div>
            <input
              type="file"
              name="image"
              ref={inputFile}
              style={{ display: "none" }}
              onChange={(event) => setImageProfile(event.target.files[0])}
            />
            <p onClick={() => console.log(userProfile)}>
             {userProfile.username}
            </p>
            <p>{userProfile.email}</p>
            {imageProfile && change && (
              <div className="save" onClick={() => handleSend()}>
                <p>Save</p>
              </div>
            )}
          </div>
          <div className="logout">
            <p onClick={logOut}>Logout</p>
          </div>

          <div className="delete" onClick={deleteUser}>
            <p>Delete account</p>
          </div>
        </div>
      )}
    </>
  );
}

export default Profile;
