import { useEffect, useRef, useState } from "react";
import { Entry } from "../types/Types";
import { Params, useNavigate, useParams } from "react-router-dom";
import {
  addEntry,
  generateId,
  getEntries,
  getEntry,
  updateEntries,
} from "../services/StorageService";
import ModalConfirm from "../components/ModalConfirm";
import Header, { headerHeight } from "../components/Header";
import CustomButton from "../components/CustomButton";
import {
  backgroundColor,
  border_color,
  entries_color,
  second_background_color,
  text_color,
} from "../constants/Colors";
import {
  CopyOutlined,
  DeleteOutlined,
  ReloadOutlined,
  SwapOutlined,
} from "@ant-design/icons";
import ModalPasswordGeneration from "../components/ModalPasswordGeneration";
import { InputStyle } from "../styles/InputStyle";

export default function Form() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalVisible2, setIsModalVisible2] = useState(false);
  const [password, setPassword] = useState<string[]>([]);
  const [indexToDelete, setIndexToDelete] = useState(0);
  const [entry, setEntry] = useState<Entry>({
    id: "",
    title: "",
    field_names: [],
    field_contents: [],
  });
  const [fieldName, setFieldName] = useState("");
  const [fieldContent, setFieldContent] = useState("");
  const [isPassword, setIsPassword] = useState(false);
  const { entryId, headerInputText, categoryId } = useParams();
  const [textareaValue, setTextareaValue] = useState("");
  const [isIOS, setIsIOS] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  //   const [paramsData, setParamsData] = useState<Readonly<Params<string>>>({
  //     id: "",
  //     headerInputText: "",
  //     categoryId: "",
  //   });
  const [Index, setIndex] = useState();
  const [isEmpty, setIsEmpty] = useState(false);
  const [delayedAction, setDelayedAction] = useState<NodeJS.Timeout | null>(
    null
  );
  const [delayedAction2, setDelayedAction2] = useState<NodeJS.Timeout | null>(
    null
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const inputStyle = isEmpty ? styles.redInput : styles.input;
  const fieldNameRef = useRef<HTMLInputElement>(null);
  const fieldContentRef = useRef<HTMLInputElement>(null);
  const textareaRefs = useRef<Array<HTMLTextAreaElement>>([]);

  const navigate = useNavigate();

  const handleChangeFieldContents = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    index: number,
    value: string
  ) => {
    const newArr = entry.field_contents;
    newArr[index] = value;
    setEntry({ ...entry, field_contents: newArr });
    adjustTextareaHeight(index, value);
  };

  const handleChangeTitle = (value: string) => {
    setEntry({ ...entry, title: value });
  };

  const handleAdd = () => {
    if (delayedAction) {
      clearTimeout(delayedAction);
      setIsEmpty(false);
    }
    if (fieldName.trim() !== "") {
      setEntry({
        ...entry,
        field_names: [...entry.field_names, fieldName.trim()],
        field_contents: [...entry.field_contents, fieldContent],
      });
      setFieldName("");
      setFieldContent("");
      if (fieldNameRef.current) fieldNameRef.current.focus();
    } else {
      setIsEmpty(true);
      setDelayedAction(
        setTimeout(() => {
          setIsEmpty(false);
        }, 2000)
      );
    }
  };

  const handleSave = async () => {
    if (entry.title === "") {
      if (inputRef.current) {
        inputRef.current.focus();
      }
      return;
    }
    if (entryId && entryId !== "new_entry" && categoryId) {
      console.log(entryId);
      updateEntries(entryId, entry, categoryId);
      navigate(-1);
    } else {
      if (categoryId) {
        const id = generateId();
        const entriesList = getEntries(categoryId);
        const entryIdExists = entriesList.some((obj) => obj.id === id);
        if (entryIdExists) {
          handleSave();
        } else {
          addEntry({ ...entry, id }, categoryId);
          navigate(-1);
        }
      }
    }
  };

  const handleDelete = () => {
    const field_names = entry.field_names.filter(
      (item: string, findex: number) => indexToDelete !== findex
    );
    const field_contents = entry.field_contents.filter(
      (item: string, findex: number) => indexToDelete !== findex
    );
    setEntry({
      ...entry,
      field_names,
      field_contents,
    });
    setIsModalVisible(false);
  };

  const copyToClipboard = async (value: string, index: any) => {
    if (delayedAction2) {
      clearTimeout(delayedAction2);
    }
    navigator.clipboard
      .writeText(value)
      .then(() => {
        console.log("Text copied to clipboard");
      })
      .catch((error) => {
        console.error("Failed to copy text to clipboard:", error);
      });
    setIndex(index);
    setDelayedAction2(
      setTimeout(() => {
        setIndex(undefined);
      }, 1000)
    );
  };

  const modalApply = () => {
    setFieldContent(password.join(""));
    setIsModalVisible2(false);
  };

  const adjustTextareaHeight = (index: number, value: string) => {
    const textareaRef = textareaRefs.current[index];
    if (textareaRef) {
      textareaRef.style.height = "1px";
      textareaRef.style.height = textareaRef.scrollHeight + "px";
    }
  };

  const adjustTextareaHeights = () => {
    textareaRefs.current.forEach((ref, index) => {
      if (ref) {
        adjustTextareaHeight(index, ref.value);
      }
    });
  };

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    const iosMatch = userAgent.match(/iphone|ipad|ipod/);
    if (iosMatch) {
      setIsIOS(true);
    }

    if (entryId && categoryId) {
      const entryData = getEntry(categoryId, entryId);
      if (entryData) {
        setEntry(entryData);
      }
    }
  }, []);
  useEffect(() => {
    adjustTextareaHeights();
  }, [entry]);

  return (
    <>
      <Header
        inputRef={inputRef}
        text="Title"
        back={() => navigate(-1)}
        input={true}
        inputValue={entry.title}
        setInputValue={handleChangeTitle}
        saveFunc={handleSave}
      />
      <div style={styles.container}>
        <ModalConfirm
          isModalVisible={isModalVisible}
          setIsModalVisible={setIsModalVisible}
          confirmFunction={handleDelete}
          itemName={entry.field_names[indexToDelete]}
        />
        <ModalPasswordGeneration
          isModalVisible={isModalVisible2}
          setIsModalVisible={setIsModalVisible2}
          password={password}
          setPassword={setPassword}
          apply={modalApply}
        />
        <div style={styles.mapContainer}>
          {entry.field_names.map((item: string, index: number) => (
            <div style={styles.content} key={index}>
              <div style={styles.fieldNamesContainer}>
                <div style={styles.fieldNames}>{item}:</div>
                <div style={styles.icons}>
                  <CopyOutlined
                    onClick={() =>
                      copyToClipboard(entry.field_contents[index], index)
                    }
                    style={styles.icon}
                  />
                  <DeleteOutlined
                    onClick={() => {
                      setIndexToDelete(index);
                      setIsModalVisible(true);
                    }}
                    style={styles.icon}
                  />
                </div>
              </div>
              <textarea
                ref={(el) => {
                  if (el) textareaRefs.current[index] = el;
                }}
                style={styles.textarea}
                value={entry.field_contents[index]}
                onChange={(e) =>
                  handleChangeFieldContents(e, index, e.target.value)
                }
                maxLength={1000}
                onBlur={() => window.scrollTo(0, 0)}
              />
            </div>
          ))}
        </div>
        <div
          style={
            isIOS
              ? !isFocused
                ? styles.formContainer
                : { ...styles.formContainer, marginBottom: 250 }
              : styles.formContainer
          }
        >
          <input
            // onBlur={() => window.scrollTo(0, 0)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            type="text"
            placeholder="Field name"
            maxLength={100}
            value={fieldName}
            onChange={(e) => setFieldName(e.target.value)}
            ref={fieldNameRef}
            style={inputStyle}
          />
          <div style={styles.fieldContentContainer}>
            <input
              // onBlur={() => window.scrollTo(0, 0)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              style={
                isPassword
                  ? styles.fieldContent
                  : { ...styles.fieldContent, width: "85%" }
              }
              type="text"
              placeholder={isPassword ? "Password" : "Text"}
              maxLength={1000}
              value={fieldContent}
              onChange={(e) => setFieldContent(e.target.value)}
            />
            <div style={styles.icons}>
              {isPassword && (
                <ReloadOutlined
                  style={styles.icon}
                  onClick={() => setIsModalVisible2(true)}
                />
              )}
              <SwapOutlined
                style={styles.icon}
                onClick={() => setIsPassword(!isPassword)}
              />
            </div>
          </div>
          <div style={styles.buttonContainer}>
            <CustomButton text="Add" func={handleAdd} />
          </div>
        </div>
      </div>
    </>
  );
}

const baseInputStyle = {
  ...InputStyle,
  width: 300,
  marginBottom: 10,
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    flexDirection: "column",
    height: `calc(100vh - ${headerHeight})`,
    margin: 0,
  },
  mapContainer: {
    flex: 1,
    width: "100%",
    overflowY: "scroll",
    boxSizing: "border-box",
    padding: 10,
  },
  content: {
    marginBottom: 5,
  },
  fieldNames: {
    fontSize: 20,
    color: entries_color,
    marginBottom: 5,
  },
  formContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: second_background_color,
    padding: 20,
    borderTop: `1px solid ${border_color}`,
  },
  fieldNamesContainer: {
    display: "flex",
    justifyContent: "space-between",
  },
  icon: {
    fontSize: 20,
    color: "white",
    cursor: "pointer",
    marginLeft: 5,
  },
  icons: {
    display: "flex",
  },
  fieldContentContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: 280,
    height: 40,
    marginBottom: 10,
    border: `1px solid ${border_color}`,
    backgroundColor: backgroundColor,
    borderRadius: 5,
    color: text_color,
    fontSize: 20,
    paddingLeft: 10,
    paddingRight: 10,
  },
  fieldContent: {
    fontSize: 20,
    height: 30,
    border: "none",
    outline: "none",
    color: text_color,
    backgroundColor: backgroundColor,
    width: "75%",
  },
  textarea: {
    fontSize: 20,
    color: text_color,
    backgroundColor: second_background_color,
    border: `1px solid ${border_color}`,
    outline: "none",
    borderRadius: 5,
    width: "100%",
    maxHeight: "none",
    resize: "none",
    overflowY: "hidden",
    padding: 5,
    boxSizing: "border-box",
  },
  input: baseInputStyle,
  redInput: {
    ...baseInputStyle,
    border: "1px solid #EB4C42",
    color: "#EB4C42",
  },
};
