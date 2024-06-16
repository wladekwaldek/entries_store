import { useState } from "react";
import { Category } from "../types/Types";
import { useNavigate } from "react-router-dom";
import { deleteCategory, editCategory } from "../services/StorageService";
import ModalConfirm from "./ModalConfirm";
import {
  border_color,
  categories_color,
  second_background_color,
  text_color,
} from "../constants/Colors";
import { EditOutlined, MoreOutlined } from "@ant-design/icons";

type Props = {
  list: Category[];
  loadCategories: () => void;
};

export default function CategoriesList({ list, loadCategories }: Props) {
  const [categoryToDelete, setCategoryToDelete] = useState<Category>();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [indexToEdit, setIndexToEdit] = useState<any>();
  const navigate = useNavigate();
  const [deleteAction, setDeleteAction] = useState<NodeJS.Timeout>();
  const [dropdownIndex, setDropdownIndex] = useState<number | null>(null);

  const toEntries = (categoryId: string) => {
    navigate(`/entries/${categoryId}`);
  };

  const showModal = (category: Category) => {
    setCategoryToDelete(category);
    setIsModalVisible(true);
  };

  const confirmCategoryDeletion = () => {
    if (categoryToDelete) deleteCategory(categoryToDelete);
    setIsModalVisible(false);
    loadCategories();
  };

  const startEditing = (index: number, categoryText: string) => {
    setIndexToEdit(index);
    setInputValue(categoryText);
  };

  const finishEditing = () => {
    setInputValue("");
    setIndexToEdit(undefined);
  };

  const submitEditing = async (category: Category) => {
    const trimedInputValue = inputValue.trim();
    const categoryExists = list.some(
      (item) => item.category_name === trimedInputValue
    );
    if (trimedInputValue !== "" && !categoryExists) {
      editCategory(category, trimedInputValue);
      finishEditing();
      loadCategories();
    }
  };

  return (
    <>
      <ModalConfirm
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        confirmFunction={confirmCategoryDeletion}
        itemName={categoryToDelete?.category_name}
      />
      <div style={styles.content}>
        {list.map((category: Category, index: number) => (
          <div
            key={index}
            style={styles.categoryButton}
            onClick={() => toEntries(category.id)}
          >
            {indexToEdit === index ? (
              <input
                inputMode="search"
                style={styles.input}
                maxLength={60}
                autoFocus
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onBlur={finishEditing}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    submitEditing(category);
                  }
                }}
              />
            ) : (
              <div style={styles.categoryButtonText}>
                {category.category_name}
              </div>
            )}
            <MoreOutlined
              style={styles.icon}
              onClick={(e) => {
                e.stopPropagation();
                setDropdownIndex(dropdownIndex === index ? null : index);
              }}
            />
            {dropdownIndex === index && (
              <div style={styles.dropdown}>
                <div
                  style={styles.dropdownItem}
                  onClick={(e) => {
                    e.stopPropagation();
                    startEditing(index, category.category_name);
                    setDropdownIndex(null);
                  }}
                >
                  Edit
                </div>
                <div
                  style={styles.dropdownItem}
                  onClick={(e) => {
                    e.stopPropagation();
                    showModal(category);
                    setDropdownIndex(null);
                  }}
                >
                  Delete
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  content: {
    flex: 1,
    width: "100%",
    overflowY: "scroll",
    boxSizing: "border-box",
  },
  categoryButton: {
    textAlign: "center",
    backgroundColor: second_background_color,
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    borderBottom: `1px solid ${categories_color}`,
    position: "relative",
    cursor: "pointer",
    display: "flex",
    justifyContent: "center",
  },
  categoryButtonText: {
    fontSize: 18,
    color: categories_color,
    wordWrap: "break-word",
    width: "80%",
  },
  icon: {
    fontSize: 20,
    color: "white",
    position: "absolute",
    right: "0",
    top: "50%",
    transform: "translateY(-50%)",
    marginRight: "10px",
  },
  input: {
    border: "none",
    outline: "none",
    backgroundColor: second_background_color,
    textAlign: "center",
    color: categories_color,
    fontSize: 18,
    width: "80%",
  },
  iconWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  dropdown: {
    position: "absolute",
    top: "100%",
    right: "0",
    backgroundColor: second_background_color,
    borderRadius: 5,
    border: `1px solid ${border_color}`,
    zIndex: 1000,
    marginTop: 5,
  },
  dropdownItem: {
    padding: 10,
    cursor: "pointer",
    whiteSpace: "nowrap",
    color: text_color,
  },
};
