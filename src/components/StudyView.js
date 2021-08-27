import { Button, Card, Spin } from "antd";
import Title from "antd/lib/skeleton/Title";
import { useEffect, useRef } from "react";
import { DICOM_SERVER_URL } from "../utils";
import { ArrowsAltOutlined } from "@ant-design/icons";

export default function StudyView({ studyViewData, loading }) {
  const viewElementRef = useRef(null);

  useEffect(() => {
    initStudyView();
  }, []);

  useEffect(() => {
    if (studyViewData) {
      renderViewElement(
        studyViewData.studyInstanceId,
        studyViewData.seriesInstanceId,
        studyViewData.instanceId
      );
    }
  }, [studyViewData]);

  const disableAllTools = () => {
    const element = viewElementRef.current;

    window.cornerstoneTools.wwwc.disable(element);
    window.cornerstoneTools.pan.activate(element, 2); // 2 is middle mouse button
    window.cornerstoneTools.zoom.activate(element, 4); // 4 is right mouse button
    window.cornerstoneTools.length.deactivate(element, 1);
    window.cornerstoneTools.wwwcTouchDrag.deactivate(element);
    window.cornerstoneTools.zoomTouchDrag.deactivate(element);
    window.cornerstoneTools.panTouchDrag.deactivate(element);
  };

  const handleLengthMeasureClick = () => {
    const element = viewElementRef.current;
    disableAllTools();
    window.cornerstoneTools.length.activate(element, 1);
  };

  const initStudyView = () => {
    const element = viewElementRef.current;
    window.cornerstone.enable(element);
    window.cornerstoneTools.mouseInput.enable(element);
    window.cornerstoneTools.mouseWheelInput.enable(element);
  };

  const renderViewElement = (studyInstanceId, seriesInstanceId, instanceId) => {
    const imageURL =
      `${DICOM_SERVER_URL}/studies/${studyInstanceId}/` +
      `series/${seriesInstanceId}/` +
      `instances/${instanceId}/rendered`;
    const imageViewer = document.querySelector(".imageViewer");
    const element = imageViewer.querySelector(".viewport");

    window.cornerstone.loadAndCacheImage(imageURL).then(function (image) {
      var defViewport = window.cornerstone.getDefaultViewport(element, image);

      // Display the image on the viewer element
      window.cornerstone.displayImage(element, image, defViewport);

      window.cornerstone.fitToWindow(element);

      window.cornerstoneTools.wwwc.activate(element, 1); // ww/wc is the default tool for left mouse button
      window.cornerstoneTools.pan.activate(element, 2); // pan is the default tool for middle mouse button
      window.cornerstoneTools.zoom.activate(element, 4); // zoom is the default tool for right mouse button
      window.cornerstoneTools.length.enable(element);
      window.cornerstoneTools.wwwcTouchDrag.activate(element);
      window.cornerstoneTools.zoomTouchPinch.activate(element);
    });
  };

  return (
    <div className="studyViewer">
      <Card>
        <Title style={{ textAlign: "center" }}>WORK LIST</Title>
        <Spin size="large" spinning={loading}>
          <div className="imageViewer">
            <Button
              type="primary"
              shape="circle"
              size="large"
              icon={<ArrowsAltOutlined />}
              className={"lengthMeasureBtn"}
              onClick={handleLengthMeasureClick}
            />
            <div className="viewportWrapper">
              <div className="viewport" ref={viewElementRef}></div>
            </div>
          </div>
        </Spin>
      </Card>
    </div>
  );
}
