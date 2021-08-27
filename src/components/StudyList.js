import { MODALITY, PATIENT_NAME, STUDY_DESCRIPTION } from "../utils";
import { Card, Spin, Table, Tag } from "antd";
import Column from "antd/lib/table/Column";
import Title from "antd/lib/typography/Title";

export default function StudyList({ studyList, loading, viewStudy }) {
  return (
    <div className="studyList">
      <Card>
        <Title style={{ textAlign: "center" }}>WORK LIST</Title>
        <Spin size="large" spinning={loading}>
          <Table
            dataSource={studyList}
            style={{ minHeight: "70vh" }}
            pagination={{
              pageSize: 15,
            }}
            scroll={{ y: "64vh" }}
            onRow={(record, rowIndex) => {
              return {
                onClick: (event) => {
                  viewStudy(record);
                },
              };
            }}
          >
            <Column
              title="Study Description"
              dataIndex={STUDY_DESCRIPTION}
              align="center"
            />
            <Column
              title="Patient Name"
              dataIndex={PATIENT_NAME}
              align="center"
              render={(text) => <a>{text}</a>}
            />
            <Column
              title="Modality"
              dataIndex={MODALITY}
              align="center"
              render={(modalities) => (
                <>
                  {modalities.map((modality, index) => {
                    let color = modalities.length > 5 ? "geekblue" : "green";
                    return (
                      <Tag color={color} key={modality + index}>
                        {modality.toUpperCase()}
                      </Tag>
                    );
                  })}
                </>
              )}
            />
          </Table>
        </Spin>
      </Card>
    </div>
  );
}
