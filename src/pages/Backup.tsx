import { getAllData } from "../services/StorageService";
import { saveAs } from "file-saver";

export default function Backup() {
  const tg = Telegram.WebApp;
  const downloadJsonFile = () => {
    const data = getAllData();
    const fileName = "save-my-entries.json";
    const json = JSON.stringify(data, null, 2);

    // Создаем объект Blob
    const blob = new Blob([json], { type: "application/json" });
    saveAs(blob, "data.json");
  };
  return (
    <div>
      <button onClick={downloadJsonFile}>Download JSON file</button>
    </div>
  );
}
