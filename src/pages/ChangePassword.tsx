import { useEffect, useRef, useState } from "react";
import { getPassword, setPassword } from "../services/StorageService";
import { useNavigate } from "react-router-dom";
import Header, { headerHeight } from "../components/Header";
import CustomButton from "../components/CustomButton";
import { border_color, second_background_color } from "../constants/Colors";
import { InputStyle } from "../styles/InputStyle";

export default function ChangePassword() {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState("");
  const [inputValue2, setInputValue2] = useState("");
  const [inputValue3, setInputValue3] = useState("");
  const [userPassword, setUserPassword] = useState("");
  // For styles
  const [isWrongPassword, setIsWrongPassword] = useState(false);
  const [isWrongPassword2, setIsWrongPassword2] = useState(false);
  const [isWrongPassword3, setIsWrongPassword3] = useState(false);
  const [delayedAction, setDelayedAction] = useState<NodeJS.Timeout | null>(
    null
  );
  const [delayedAction2, setDelayedAction2] = useState<NodeJS.Timeout | null>(
    null
  );
  const inputStyle = isWrongPassword ? styles.redInput : styles.input;
  const inputStyle2 = isWrongPassword2 ? styles.redInput : styles.input;
  const inputStyle3 = isWrongPassword3 ? styles.redInput : styles.input;

  const firstInputRef = useRef<HTMLInputElement | null>(null);
  const secondInputRef = useRef<HTMLInputElement | null>(null);
  const thirdInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    async function load() {
      const data = getPassword();
      if (data) setUserPassword(data);
    }
    load();
  }, []);

  const ok = () => {
    if (delayedAction) {
      clearTimeout(delayedAction);
      setIsWrongPassword(false);
    }
    if (delayedAction2) {
      clearTimeout(delayedAction2);
      setIsWrongPassword2(false);
      setIsWrongPassword3(false);
    }
    if (
      inputValue === userPassword &&
      inputValue2 === inputValue3 &&
      inputValue2 !== ""
    ) {
      setPassword(inputValue2);
      navigate("/home");
      //   router.back();
      //   router.replace("/home");
    }
    if (inputValue !== userPassword) {
      setIsWrongPassword(true);
      setDelayedAction(
        setTimeout(() => {
          setIsWrongPassword(false);
        }, 2000)
      );
    }
    if (inputValue2 !== inputValue3 && inputValue2 !== "") {
      setIsWrongPassword3(true);
      setDelayedAction2(
        setTimeout(() => {
          setIsWrongPassword3(false);
        }, 2000)
      );
    }
    if (inputValue2 === "") {
      setIsWrongPassword2(true);
      setIsWrongPassword3(true);
      setDelayedAction2(
        setTimeout(() => {
          setIsWrongPassword2(false);
          setIsWrongPassword3(false);
        }, 2000)
      );
    }
  };
  const handleBlur = () => {
    window.scrollTo(0, 0);
  };
  return (
    <>
      <Header text="Change password" back={() => navigate(-1)} />
      <div style={styles.container}>
        <div style={styles.content}>
          <input
            ref={firstInputRef}
            type="password"
            maxLength={30}
            placeholder="Old password"
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
            placeholder="New password"
            value={inputValue2}
            onChange={(e) => setInputValue2(e.target.value)}
            style={inputStyle2}
            onKeyDown={(e) => {
              if (e.key == "Enter") {
                thirdInputRef.current?.focus();
              }
            }}
            onBlur={handleBlur}
          />
          <input
            ref={thirdInputRef}
            type="password"
            maxLength={30}
            placeholder="Confirm password"
            value={inputValue3}
            onChange={(e) => setInputValue3(e.target.value)}
            style={inputStyle3}
            onKeyDown={(e) => {
              if (e.key == "Enter") {
                ok();
              }
            }}
            onBlur={handleBlur}
          />
          <CustomButton text="Ok" func={ok} />
        </div>
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
  btnContainer: {
    marginTop: 10,
  },
  input: baseInputStyle,
  redInput: {
    ...baseInputStyle,
    border: "1px solid #EB4C42",
    color: "#EB4C42",
  },
};
