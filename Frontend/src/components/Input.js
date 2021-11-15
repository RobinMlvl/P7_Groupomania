import "../css/Components.css";

function InputComp(props) {
    let value = props.value;
    let type = props.type;
    let setValue = props.setValue;
    let setActiveValue = props.setActiveValue;
    let activeValue = props.activeValue;
    let placeHolder = props.placeHolder;

    let handleChange = (text, setInput, setActive) => {
        setInput(text);
        if (text !== "") {
          setActive(true);
        } else {
          setActive(false);
        }
      };

  return (
    <div className="float-label">
            <input
              type={type}
              value={value}
              onChange={(e) =>
                handleChange(e.target.value, setValue, setActiveValue)
              }
            />
            <label className={activeValue ? "Active" : ""}>{placeHolder}</label>
          </div>
  );
}

export default InputComp;
