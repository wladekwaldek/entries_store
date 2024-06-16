import { useNavigate } from "react-router-dom";
import { backgroundColor, main_color, text_color } from "../constants/Colors";
import { LegacyRef, MutableRefObject, RefObject } from "react";
import { FileAddOutlined } from "@ant-design/icons";

type Props = {
  text?: string;
  back?: () => void;
  input?: boolean;
  inputValue?: string;
  setInputValue?: (val: string) => void;
  inputRef?: RefObject<HTMLInputElement>;
  saveFunc?: () => void;
};

export const headerHeight = "50px";

export default function Header({
  text,
  back,
  input,
  inputValue,
  setInputValue,
  inputRef,
  saveFunc,
}: Props) {
  const navigate = useNavigate();
  return (
    <div style={styles.container}>
      {back && (
        <svg
          style={styles.arrow}
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill={main_color}
          onClick={back}
        >
          <path d="M0 0h24v24H0z" fill="none" />
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
        </svg>
      )}

      {input ? (
        <div style={styles.inputContainer}>
          <input
            maxLength={60}
            ref={inputRef}
            style={styles.input}
            type="text"
            placeholder={text}
            value={inputValue}
            onChange={(e) => {
              if (setInputValue) {
                setInputValue(e.target.value);
              }
            }}
          />
        </div>
      ) : (
        <div style={styles.text}>{text}</div>
      )}
      {text === "Categories" && (
        <FileAddOutlined
          style={styles.icon}
          onClick={() => navigate("/backup")}
        />
      )}
      {saveFunc && (
        <div style={styles.save} onClick={saveFunc}>
          Save
        </div>
      )}
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    position: "relative",
    borderBottom: `2px solid ${main_color}`,
    padding: 5,
  },
  text: {
    flex: 1,
    width: "100%",
    marginTop: 5,
    marginBottom: 5,
    fontSize: 24,
    color: main_color,
    textAlign: "center",
    fontFamily: "PlayBold",
  },
  inputContainer: {
    display: "flex",
    justifyContent: "center",
  },
  input: {
    color: main_color,
    fontSize: 20,
    width: 240,
    height: 36,
    textAlign: "center",
    backgroundColor: backgroundColor,
    borderTop: `2px solid ${main_color}`,
    borderRight: `2px solid ${main_color}`,
    borderLeft: `2px solid ${main_color}`,
    borderBottom: "none",
    borderRadius: "5px 5px 0 0 ",
    outline: "none",
    fontFamily: "PlayBold",
  },
  arrow: {
    position: "absolute",
    left: "0",
    top: "50%",
    transform: "translateY(-50%)",
    marginRight: "10px",
    cursor: "pointer",
  },
  icon: {
    fontSize: 20,
    color: main_color,
    cursor: "pointer",
    position: "absolute",
    right: "0",
    top: "50%",
    transform: "translateY(-50%)",
    marginRight: "10px",
  },
  save: {
    position: "absolute",
    right: "0",
    top: "50%",
    transform: "translateY(-50%)",
    marginRight: "10px",
    cursor: "pointer",
    color: text_color,
    fontSize: 20,
    fontFamily: "PlayBold",
  },
};
