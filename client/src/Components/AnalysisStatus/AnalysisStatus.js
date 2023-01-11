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
import { colors } from "../../styles/colors";

const AnalysisStatus = () => {
  const [email, setEmail] = useState("");
  const [dataReady, setDataReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [analysisRequests, setAnalysisRequests] = useState([]);

  const getAnalysisURL = (analysisType, id) => {
    let url = `/predictio/result/${id}`;
    if(analysisType === 'biomarker_eval'){
      url = `/explore/biomarker/result/${id}`
    }
    return(url)
  }

  const getStatusColor = (status) => {
    let color = '';
    switch(status){
      case 'complete':
        color = '#008000';
        break;
      case 'processing':
        color = '#f1c232';
        break;
      case 'error':
        color = '#f44336';
        break;
      default:
        break;
    }
    console.log(color)
    return color;
  }

  const columns = [
    {
      Header: "ID",
      accessor: "analysis_id",
      Cell: (item) => {
        if(item.row.original.status === 'complete'){
          return(
            <a 
              href={getAnalysisURL(item.row.original.analysis_type, item.value)} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              {item.value}
            </a>
          )
        }
        return(
          <div>{item.value}</div>
        )
      }
    },
    {
      Header: "Status",
      accessor: "status",
      Cell: (item) => (
        <div style={{fontWeight: 'bold', color: getStatusColor(item.value)}}>
          {item.value}
        </div>
      )
    },
    {
      Header: "Analysis Type",
      accessor: "analysis_type",
      Cell: (item) => {
        if(item.value === 'predictio'){
          return('PredictIO')
        }
        return('Biomarker Eval.')
      }
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
      Header: "Notes",
      accessor: "notes",
    },
  ];

  const getAnalysisRequests = async () => {
    setDataReady(false);
    setLoading(true);
    const res = await axios.get('/api/analysis/status', { params: {email: email}});
    console.log(res.data);
    setAnalysisRequests(res.data.analyses);
    setDataReady(true);
    setLoading(false);
  };

  return (
    <Layout>
      <Container>
        <h3>Analysis Status</h3>
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
              onKeyDown={(e) => {
                if(e.keyCode === 13 && emailRegex.test(email)){
                  getAnalysisRequests()
                }
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
        {
          dataReady &&
          <div>
            {
              analysisRequests.length > 0 ?
              <Table columns={columns} data={analysisRequests} pageRowNum={25} showGlobalFilter={false} />
              :
              <h3>Theres is no request associated with the email.</h3>
            }
          </div>
        }
        {
          loading &&
          <div style={{marginTop: '100px', width: '100%', display: 'flex', justifyContent: 'center'}}>
            <Loader
              type="Oval"
              color={colors.blue}
              height={100}
              width={100}
            />
          </div>
        }
      </Container>
    </Layout>
  );
};

export default AnalysisStatus;
