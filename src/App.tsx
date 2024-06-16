import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import {
  backgroundColor,
  border_color,
  main_color,
  second_background_color,
  text_color,
} from "./constants/Colors";
import {
  getPassword,
  setPassword,
  storageDeleteIsChecked,
  storageGetIsChecked,
  storageSetIsChecked,
} from "./services/StorageService";
import { useNavigate } from "react-router-dom";
import Header, { headerHeight } from "./components/Header";
import CustomButton from "./components/CustomButton";
import { InputStyle } from "./styles/InputStyle";

export default function App() {
  const tg = Telegram.WebApp;
  const [loading, setLoading] = useState(true);
  const [inputValue, setInputValue] = useState("");
  const [inputValue2, setInputValue2] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const [isWrongPassword, setIsWrongPassword] = useState(false);
  const [isWrongPassword2, setIsWrongPassword2] = useState(false);
  const [delayedAction, setDelayedAction] = useState<NodeJS.Timeout | null>(
    null
  );
  const [isChecked, setIsChecked] = useState(false);
  const inputStyle = isWrongPassword ? styles.redInput : styles.input;
  const inputStyle2 = isWrongPassword2 ? styles.redInput : styles.input;
  const secondInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    function load() {
      const password = getPassword();
      const rememberMe = storageGetIsChecked();
      if (password) {
        setIsRegistered(true);
      }
      if (password && rememberMe) {
        setIsChecked(true);
        setInputValue(password);
      }
      setLoading(false);
    }
    tg.expand();
    load();
  }, []);

  const newEnter = async () => {
    if (delayedAction) {
      clearTimeout(delayedAction);
      setIsWrongPassword(false);
      setIsWrongPassword2(false);
    }

    if (inputValue === inputValue2 && inputValue !== "") {
      setPassword(inputValue);
      navigate("/home");
    } else if (inputValue !== inputValue2 && inputValue !== "") {
      setIsWrongPassword2(true);

      setDelayedAction(
        setTimeout(() => {
          setIsWrongPassword2(false);
        }, 2000)
      );
    } else {
      setIsWrongPassword(true);
      setIsWrongPassword2(true);

      setDelayedAction(
        setTimeout(() => {
          setIsWrongPassword(false);
          setIsWrongPassword2(false);
        }, 2000)
      );
    }
  };

  const enter = async () => {
    const password = getPassword();

    if (delayedAction) {
      clearTimeout(delayedAction);
      setIsWrongPassword(false);
    }

    if (inputValue === password) {
      if (isChecked) {
        storageSetIsChecked();
        navigate("/home");
      } else {
        navigate("/home");
      }
    } else {
      setIsWrongPassword(true);

      setDelayedAction(
        setTimeout(() => {
          setIsWrongPassword(false);
        }, 2000)
      );
    }
  };

  const handleCheckBox = () => {
    if (isChecked === true) {
      setIsChecked(false);
      storageDeleteIsChecked();
    } else {
      setIsChecked(true);
    }
  };

  const handleBlur = () => {
    window.scrollTo(0, 0);
  };

  // if (!loading) {
  return (
    <>
      <Header text="SAVE MY ENTRIES" />
      <div style={styles.container}>
        {isRegistered ? (
          <div style={styles.content}>
            <input
              type="password"
              maxLength={30}
              placeholder="Password"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              style={inputStyle}
              onKeyDown={(e) => {
                if (e.key == "Enter") {
                  enter();
                }
              }}
              onBlur={handleBlur}
            />
            <div style={styles.btnContainer}>
              <CustomButton func={enter} text="Enter" />
            </div>
            <div style={styles.bottomContainer}>
              <label style={styles.label}>
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={handleCheckBox}
                />
                Remember me
              </label>
              <div
                style={styles.change}
                onClick={() => navigate("/change_password")}
              >
                Change password
              </div>
            </div>
          </div>
        ) : (
          <div style={styles.content}>
            <div style={styles.warning}>Don't forget your password!</div>
            <input
              type="password"
              maxLength={30}
              placeholder="New password"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              style={inputStyle}
              onKeyDown={(e) => {
                if (e.key == "Enter") {
                  secondInputRef.current?.focus();
                }
              }}
              onBlur={handleBlur}
            />
            <input
              ref={secondInputRef}
              type="password"
              maxLength={30}
              placeholder="Confirm password"
              value={inputValue2}
              onChange={(e) => setInputValue2(e.target.value)}
              style={inputStyle2}
              onKeyDown={(e) => {
                if (e.key == "Enter") {
                  newEnter();
                }
              }}
              onBlur={handleBlur}
            />
            <CustomButton text="Enter" func={newEnter} />
          </div>
        )}
      </div>
    </>
  );
}

const baseInputStyle = {
  ...InputStyle,
  width: 250,
  marginBottom: 10,
};

const styles: any = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: `calc(100vh - ${headerHeight})`,
    margin: 0,
  },
  content: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    padding: 20,
    borderTop: `1px solid ${border_color}`,
    borderBottom: `1px solid ${border_color}`,
    alignItems: "center",
    backgroundColor: second_background_color,
  },
  contentTitle: {
    fontSize: 20,
    color: main_color,
    fontFamily: "PlayBold",
    marginBottom: 20,
  },
  btnContainer: {
    marginTop: 10,
  },
  input: baseInputStyle,
  redInput: {
    ...baseInputStyle,
    border: "1px solid #EB4C42",
    color: "#EB4C42",
  },
  change: {
    fontSize: 16,
    color: text_color,
    cursor: "pointer",
  },
  bottomContainer: {
    display: "flex",
    width: 300,
    justifyContent: "space-between",
    marginTop: 20,
  },
  label: {
    cursor: "pointer",
    fontSize: 16,
    color: text_color,
  },
  warning: {
    color: main_color,
    fontSize: 20,
    marginBottom: 10,
  },
};
