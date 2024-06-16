import {
  border_color,
  main_color,
  second_background_color,
} from "../constants/Colors";
import CustomButton from "./CustomButton";

interface Props {
  isModalVisible: boolean;
  setIsModalVisible: (p: boolean) => void;
  confirmFunction: () => void;
  itemName?: string;
}

export default function ModalConfirm({
  isModalVisible,
  setIsModalVisible,
  confirmFunction,
  itemName,
}: Props) {
  const hideModal = () => {
    setIsModalVisible(false);
  };

  return (
    <div
      style={{
        ...styles.modalBackground,
        display: isModalVisible ? "block" : "none",
      }}
    >
      <div style={styles.modalContainer}>
        <div style={styles.messageText}>Delete the '{itemName}'?</div>
        <div style={styles.buttonContainer}>
          <CustomButton text="No" func={hideModal} />
          <CustomButton text="Yes" func={confirmFunction} />
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
  },
  messageText: {
    fontFamily: "PlayBold",
    fontSize: 18,
    marginBottom: 20,
    color: main_color,
    textAlign: "center",
  },
  buttonContainer: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
  },
};
