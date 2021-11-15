import "../css/Components.css";
import navIcon from "../assets/icon-left-font.svg";

function NavBar() {
  return (
    <header>
      <nav>
        <img src={navIcon} alt="logo Groupomania" />
      </nav>
    </header>
  );
}

export default NavBar;
