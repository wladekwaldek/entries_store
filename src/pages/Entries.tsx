import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getEntries } from "../services/StorageService";
import { Entry } from "../types/Types";
import EntriesList from "../components/EntriesList";
import Header, { headerHeight } from "../components/Header";
import CustomButton from "../components/CustomButton";

export default function Entries() {
  const [list, setList] = useState<Entry[]>([]);
  const navigate = useNavigate();
  const params = useParams();
  const [searchText, setSearchText] = useState("");

  const loadEntries = () => {
    if (params.categoryId) {
      const data = getEntries(params.categoryId);
      setList(data);
    }
  };

  const toForm = () => {
    navigate(`/form/${params.categoryId}/new_entry`);
    // router.setParams({ categoryId: params.categoryId });
  };

  useEffect(() => {
    loadEntries();
  }, [params]);

  return (
    <>
      <Header
        text="Search"
        back={() => navigate(-1)}
        input={true}
        inputValue={searchText}
        setInputValue={setSearchText}
      />
      <div style={styles.container}>
        {/* <Stack.Screen
      options={{
        title: "Entries",
        headerBackTitleVisible: false,
        headerTitle: () => <HeaderInput search={true} />,
      }}
    /> */}
        <EntriesList
          list={list}
          categoryId={params.categoryId}
          loadEntries={loadEntries}
          searchText={searchText}
        />
        <div style={styles.buttonContainer}>
          <CustomButton text="Add entry" func={toForm} />
        </div>
      </div>
    </>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    flexDirection: "column",
    height: `calc(100vh - ${headerHeight} - 40px)`,
    padding: 20,
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "center",
    marginTop: 20,
  },
};
