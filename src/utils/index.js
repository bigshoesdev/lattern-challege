import axios from "axios";

export const DICOM_SERVER_URL =
  "https://server.dcmjs.org/dcm4chee-arc/aets/DCM4CHEE/rs";

export const STUDY_INSTANCE_ID = "studyInstanceId";
export const STUDY_DESCRIPTION = "studyDescription";
export const PATIENT_NAME = "patientName";
export const MODALITY = "modality";
export const SERIES_INSTANCE_ID = "seriesInstanceId";
export const INSTANCE_ID = "instanceId";

const LABEL_TAG_MAPPING = {
  [STUDY_INSTANCE_ID]: "0020000D",
  [STUDY_DESCRIPTION]: "00081030",
  [PATIENT_NAME]: "00100010",
  [MODALITY]: "00080061",
  [SERIES_INSTANCE_ID]: "0020000E",
  [INSTANCE_ID]: "00080018",
};

export const getStudyList = async () => {
  const url = `${DICOM_SERVER_URL}/studies?fuzzymatching=false&includefield=${LABEL_TAG_MAPPING[STUDY_DESCRIPTION]}`;

  const studies = [];

  try {
    const { data } = await axios.get(url);

    for (var i = 0; i < data.length; i++) {
      const studyData = data[i];

      studies.push({
        [STUDY_INSTANCE_ID]:
          studyData[LABEL_TAG_MAPPING[STUDY_INSTANCE_ID]]?.Value?.[0],
        [STUDY_DESCRIPTION]:
          studyData[LABEL_TAG_MAPPING[STUDY_DESCRIPTION]]?.Value?.[0] || "",
        [PATIENT_NAME]:
          studyData[LABEL_TAG_MAPPING[PATIENT_NAME]]?.Value?.[0].Alphabetic ||
          "",
        [MODALITY]: studyData[LABEL_TAG_MAPPING[MODALITY]].Value,
        key: studyData[LABEL_TAG_MAPPING[STUDY_INSTANCE_ID]]?.Value?.[0],
      });
    }
  } catch (e) {
    console.log(e);
  }

  return studies;
};

export const getSeriesList = async (studyInstanceId) => {
  const url = `${DICOM_SERVER_URL}/studies/${studyInstanceId}/series`;

  const series = [];

  try {
    const { data } = await axios.get(url);

    for (var i = 0; i < data.length; i++) {
      const seriesData = data[i];

      series.push({
        [SERIES_INSTANCE_ID]:
          seriesData[LABEL_TAG_MAPPING[SERIES_INSTANCE_ID]]?.Value?.[0],
      });
    }
  } catch (e) {
    console.log(e);
  }

  return series;
};

export const getInstanceList = async (studyInstanceId, seriesInstanceId) => {
  const url = `${DICOM_SERVER_URL}/studies/${studyInstanceId}/series/${seriesInstanceId}/instances`;

  const instances = [];

  try {
    const { data } = await axios.get(url);

    for (var i = 0; i < data.length; i++) {
      const instanceData = data[i];

      instances.push({
        [INSTANCE_ID]: instanceData[LABEL_TAG_MAPPING[INSTANCE_ID]]?.Value?.[0],
      });
    }
  } catch (e) {
    console.log(e);
  }

  return instances;
};