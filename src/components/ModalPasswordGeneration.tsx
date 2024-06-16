import CustomButton from "./CustomButton";
import {
  backgroundColor,
  border_color,
  main_color,
  second_background_color,
  text_color,
} from "../constants/Colors";
import { useState } from "react";
import secureRandomPassword from "secure-random-password";

type Props = {
  isModalVisible: boolean;
  setIsModalVisible: (p: boolean) => void;
  password: string[];
  setPassword: (p: string[]) => void;
  apply: () => void;
};

export default function ModalPasswordGeneration({
  isModalVisible,
  setIsModalVisible,
  password,
  setPassword,
  apply,
}: Props) {
  const [passwordLength, setPasswordLength] = useState(8);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);

  const generatePassword = () => {
    const charset = [];

    if (includeUppercase) charset.push("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
    if (includeLowercase) charset.push("abcdefghijklmnopqrstuvwxyz");
    if (includeNumbers) charset.push("0123456789");
    if (includeSymbols) charset.push("!@#$%^&*()_-+=<>?/");

    if (charset.length !== 0) {
      const password = secureRandomPassword.randomPassword({
        length: passwordLength,
        characters: charset,
      });
      setPassword(password.split(""));
    }
  };

  return (
    <div
      style={{
        ...styles.modalBackground,
        display: isModalVisible ? "block" : "none",
      }}
    >
      <div style={styles.modalContainer}>
        <div style={styles.title}>Password generation</div>
        <div style={styles.length}>Password length: {passwordLength}</div>
        <input
          style={styles.slider}
          type="range"
          min={6}
          max={20}
          value={passwordLength}
          onChange={(e) => setPasswordLength(parseInt(e.target.value))}
        />
        <div style={styles.checkBoxContainer}>
          <label style={styles.label}>
            <input
              style={styles.checkbox}
              type="checkbox"
              checked={includeUppercase}
              onChange={() => setIncludeUppercase((prev) => !prev)}
            />
            Uppercase
          </label>
          <label style={styles.label}>
            <input
              style={styles.checkbox}
              type="checkbox"
              checked={includeLowercase}
              onChange={() => setIncludeLowercase((prev) => !prev)}
            />
            Lowercase
          </label>
          <label style={styles.label}>
            <input
              style={styles.checkbox}
              type="checkbox"
              checked={includeNumbers}
              onChange={() => setIncludeNumbers((prev) => !prev)}
            />
            Numbers
          </label>
          <label style={styles.label}>
            <input
              style={styles.checkbox}
              type="checkbox"
              checked={includeSymbols}
              onChange={() => setIncludeSymbols((prev) => !prev)}
            />
            Symbols
          </label>
        </div>
        <div style={styles.passwordContainer}>
          <div style={styles.resultText}>Result:</div>
          <div style={styles.passwordTextContainer}>
            <div style={styles.passwordText}>
              {password.map((item: string, index: number) => (
                <div key={index} style={styles.passwordItem}>
                  {item}
                </div>
              ))}
            </div>
          </div>
          <CustomButton text="Generate" func={generatePassword} />
        </div>
        <div style={styles.buttonContainer}>
          <CustomButton text="Close" func={() => setIsModalVisible(false)} />
          <CustomButton text="Apply" func={apply} />
        </div>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  modalBackground: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 999,
  },
  modalContainer: {
    width: 300,
    padding: 20,
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: second_background_color,
    borderRadius: 5,
    border: `1px solid ${border_color}`,
    zIndex: 1000,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    color: main_color,
    textAlign: "center",
    fontFamily: "PlayBold",
  },
  buttonContainer: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
  },
  label: {
    fontSize: 18,
    color: text_color,
    marginTop: 5,
    marginBottom: 5,
  },
  checkBoxContainer: {
    display: "flex",
    flexDirection: "column",
    marginTop: 10,
    marginBottom: 20,
    alignItems: "flex-start",
  },
  passwordContainer: {
    width: "100%",
    marginBottom: 20,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  passwordItem: {
    fontSize: 16,
    color: text_color,
  },
  resultText: {
    fontSize: 18,
    color: main_color,
  },
  passwordText: {
    display: "flex",
  },
  passwordTextContainer: {
    borderWidth: 1,
    borderColor: border_color,
    marginTop: 10,
    marginBottom: 10,
    width: "100%",
    height: 40,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: backgroundColor,
    borderRadius: 5,
    border: `1px solid ${border_color}`,
  },
  length: {
    fontSize: 18,
    color: text_color,
  },
  slider: {
    width: "100%",
    marginTop: 10,
    marginBottom: 10,
    color: "#ffffff",
    backgroundColor: border_color,
    appearance: "none",
    borderRadius: 5,
    height: 4,
  },
  checkbox: {
    backgroundColor: "white",
  },
};
