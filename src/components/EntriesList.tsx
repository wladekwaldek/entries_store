import { useState } from "react";
import { Entry } from "../types/Types";
import { useNavigate, useNavigation } from "react-router-dom";
import { deleteEntry } from "../services/StorageService";
import ModalConfirm from "./ModalConfirm";
import { entries_color, second_background_color } from "../constants/Colors";

type Props = {
  list: Entry[];
  categoryId: string | undefined;
  loadEntries: () => void;
  searchText: string;
};

export default function EntriesList({
  list,
  categoryId,
  loadEntries,
  searchText,
}: Props) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [idToDelete, setIdToDelete] = useState("");
  const [entryName, setEntryName] = useState("");
  // const params = useLocalSearchParams<{ headerInputText: string }>();
  // const searchText = params.headerInputText || "";
  const navigate = useNavigate();
  const [deleteAction, setDeleteAction] = useState<NodeJS.Timeout>();

  const entryToForm = (entryId: string) => {
    navigate(`/form/${categoryId}/${entryId}`);
    //   router.setParams({
    //     categoryId,
    //     id,
    //   });
  };
  const showModal = (entry: Entry) => {
    setIsModalVisible(true);
    setIdToDelete(entry.id);
    setEntryName(entry.title);
  };
  const confirmEntryDeletion = async () => {
    if (categoryId) {
      deleteEntry(idToDelete, categoryId);
      setIsModalVisible(false);
      loadEntries();
    }
  };
  const handleMouseDown = (entry: Entry) => {
    setDeleteAction(
      setTimeout(() => {
        showModal(entry);
      }, 500)
    );
  };

  const handleMouseUp = (entryId: string) => {
    clearTimeout(deleteAction);
    if (!isModalVisible) entryToForm(entryId);
  };
  return (
    <>
      <ModalConfirm
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        itemName={entryName}
        confirmFunction={confirmEntryDeletion}
      />
      <div style={styles.content}>
        {list
          .filter((entry: Entry) =>
            entry.title.toLowerCase().includes(searchText.toLowerCase().trim())
          )
          .map((entry: Entry, index: number) => (
            <div
              key={entry.id}
              style={styles.entryButton}
              onMouseDown={() => handleMouseDown(entry)}
              onMouseUp={() => handleMouseUp(entry.id)}
              onTouchStart={() => handleMouseDown(entry)}
              onTouchEnd={() => handleMouseUp(entry.id)}
            >
              <div>{entry.title}</div>
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
  entryButton: {
    textAlign: "center",
    backgroundColor: second_background_color,
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    borderBottom: `1px solid ${entries_color}`,
    cursor: "pointer",
    color: entries_color,
    fontSize: 18,
    wordWrap: "break-word",
  },
};
