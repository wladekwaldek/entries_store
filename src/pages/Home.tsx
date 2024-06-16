import React, { CSSProperties, useEffect, useRef, useState } from "react";
import { Category } from "../types/Types";
import {
  addCategory,
  generateId,
  getCategories,
} from "../services/StorageService";
import CategoriesList from "../components/CategoriesList";
import { useNavigate } from "react-router-dom";
import Header, { headerHeight } from "../components/Header";
import CustomButton from "../components/CustomButton";
import { InputStyle } from "../styles/InputStyle";

export default function Home() {
  const navigate = useNavigate();
  const [list, setList] = useState<Category[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isEmpty, setIsEmpty] = useState(false);
  const [delayedAction, setDelayedAction] = useState<NodeJS.Timeout | null>(
    null
  );
  const [isIOS, setIsIOS] = useState(false);
  const inputStyle = isEmpty ? styles.redInput : styles.input;

  function loadCategories() {
    const data = getCategories();
    setList(data);
  }
  useEffect(() => {
    loadCategories();

    const userAgent = window.navigator.userAgent.toLowerCase();
    const iosMatch = userAgent.match(/iphone|ipad|ipod/);

    if (iosMatch) {
      setIsIOS(true);
    }
  }, []);

  const handleAddCategory = () => {
    if (delayedAction) {
      clearTimeout(delayedAction);
      setIsEmpty(false);
    }
    const trimedInputValue = inputValue.trim();
    const categoryExists = list.some(
      (obj) => obj.category_name === trimedInputValue
    );
    if (trimedInputValue !== "" && !categoryExists) {
      const id = generateId();
      const categoryIdExists = list.some((obj) => obj.id === id);
      if (categoryIdExists) {
        handleAddCategory();
      } else {
        addCategory({ id, category_name: trimedInputValue });
        loadCategories();
        setInputValue("");
      }
    } else {
      setIsEmpty(true);
      setDelayedAction(
        setTimeout(() => {
          setIsEmpty(false);
        }, 2000)
      );
    }
    inputRef.current?.blur();
  };

  const handleBlur = () => {
    window.scrollTo(0, 0);
  };
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <>
      <Header text="Categories" />
      <div style={styles.container}>
        <CategoriesList list={list} loadCategories={loadCategories} />
        <div
          style={
            isIOS
              ? !isFocused
                ? styles.inputContainer
                : { ...styles.inputContainer, marginBottom: 300 }
              : styles.inputContainer
          }
        >
          <input
            ref={inputRef}
            onBlur={() => {
              setIsFocused(false);
            }}
            onFocus={() => setIsFocused(true)}
            type="text"
            maxLength={60}
            placeholder="New category"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            style={inputStyle}
            onKeyDown={(e) => {
              if (e.key == "Enter") {
                handleAddCategory();
              }
            }}
          />
          <CustomButton text="Add" func={handleAddCategory} />
        </div>
      </div>
    </>
  );
}

const baseInputStyle = {
  ...InputStyle,
  width: "100%",
  marginRight: 10,
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    flexDirection: "column",
    height: `calc(100vh - ${headerHeight} - 40px)`,
    padding: 20,
    overflow: "hidden",
  },
  inputContainer: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: 20,
  },
  input: baseInputStyle,
  redInput: {
    ...baseInputStyle,
    border: "1px solid #EB4C42",
    color: "#EB4C42",
  },
};
