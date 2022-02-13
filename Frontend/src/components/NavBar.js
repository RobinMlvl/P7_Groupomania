import "../css/Components.css";
import navIcon from "../assets/icon-left-font.svg";
import { ReactComponent as Logo } from "../assets/user-circle-solid.svg";
import { ReactComponent as Arrow } from "../assets/arrow-left-solid.svg";
import { useNavigate } from "react-router-dom";

function NavBar(props) {
  let navigate = useNavigate();
  let profile = props.profile;
  let returnBack = props.returnBack;
  return (
    <header>
      <nav>
        <img src={navIcon} alt="logo Groupomania" />
        {returnBack && (
          <Arrow onClick={() => navigate("/feed")} className="arrow" />
        )}
        {profile && (
          <Logo onClick={() => navigate("/profile")} className="profile" />
        )}
      </nav>
    </header>
  );
}

export default NavBar;
