import { useState } from "react";
import Loader from "react-loader-spinner";
import axios from "axios";
import Layout from "../UtilComponents/Layout";
import { Container } from "../../styles/StyledComponents";
import StyledForm from "../UtilComponents/StyledForm";
import CustomInputText from "../UtilComponents/CustomInputText";
import ActionButton from "../UtilComponents/ActionButton";
import { emailRegex } from "../../util/constants";
import Table from "../UtilComponents/Table/Table";

const AnalysisStatus = () => {
  const [email, setEmail] = useState("");
  const [dataReady, setDataReady] = useState(false);
  const [analysisRequests, setAnalysisRequests] = useState([]);

  const columns = [
    {
      Header: "ID",
      accessor: "analysis_id",
      // Cell: (item) => (
      //     <a href={`/dataset/${item.row.original.dataset_id}`}>
      //         {item.value}
      //     </a>
      // )
    },
    {
      Header: "Analysis Type",
      accessor: "analysis_type",
    },
    {
      Header: "Time Submitted",
      accessor: "time_submitted",
    },
    {
      Header: "Time Completed",
      accessor: "time_completed",
    },
    {
      Header: "Status",
      accessor: "status",
    },
  ];

  const getAnalysisRequests = (e) => {};

  return (
    <Layout>
      <Container>
        <h4>Analysis Status</h4>
        <div>View status of your analysis requests.</div>
        <StyledForm flexDirection="column">
          <div className="formField">
            <div className="label">Email: </div>
            <CustomInputText
              className="input"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            <ActionButton
              onClick={getAnalysisRequests}
              text="Search"
              style={{ width: "90px", height: "34px", fontSize: "14px" }}
              disabled={!emailRegex.test(email)}
            />
          </div>
        </StyledForm>
        <div>
          <Table columns={columns} data={analysisRequests} pageRowNum={25} />
        </div>
      </Container>
    </Layout>
  );
};

export default AnalysisStatus;
