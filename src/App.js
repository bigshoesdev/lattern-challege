import "./App.scss";
import { useEffect, useState } from "react";
import {
  getStudyList,
  getSeriesList,
  getInstanceList,
  STUDY_INSTANCE_ID,
  SERIES_INSTANCE_ID,
  INSTANCE_ID,
} from "./utils";
import StudyList from "./components/StudyList";
import StudyView from "./components/StudyView";

function App() {
  const [loading, setLoading] = useState(false);
  const [studyList, setStudyList] = useState([]);
  const [studyViewData, setStudyViewData] = useState(null);

  useEffect(() => {
    getStudies();
  }, []);

  const getStudies = async () => {
    setLoading(true);

    const studyList = await getStudyList();

    setStudyList(studyList);

    setLoading(false);
  };

  const viewStudy = async (study) => {
    setLoading(true);

    const studyInstanceId = study[STUDY_INSTANCE_ID];
    const seriesList = await getSeriesList(studyInstanceId);

    if (seriesList.length > 0) {
      const seriesInstanceId = seriesList[0][SERIES_INSTANCE_ID];
      const instanceList = await getInstanceList(
        studyInstanceId,
        seriesInstanceId
      );

      if (instanceList.length > 0) {
        const instanceId = instanceList[0][INSTANCE_ID];

        setStudyViewData({
          studyInstanceId,
          seriesInstanceId,
          instanceId,
        });
      }
    }

    setLoading(false);
  };

  return (
    <div className="app">
      <StudyList
        studyList={studyList}
        loading={loading}
        viewStudy={viewStudy}
      ></StudyList>
      <StudyView studyViewData={studyViewData} loading={loading}></StudyView>
    </div>
  );
}

export default App;
