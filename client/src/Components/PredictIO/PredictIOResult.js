import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import Loader from "react-loader-spinner";
import Layout from "../UtilComponents/Layout";
import DownloadButton from "../UtilComponents/DownloadButton";
import { LoaderContainer } from "../../styles/PlotStyles";
import { colors } from "../../styles/colors";
import ResultInfo from "../BiomarkerEvaluation/ResultInfo";
import FileSaver from "file-saver";

const StyledHeader = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const StyledDataTable = styled(DataTable)`
  .p-datatable-thead > tr > th {
    padding: 0.5rem;
    font-size: 14px;
  }
  .p-inputtext {
    padding: 0.5rem;
    font-size: 12px;
  }
  .p-datatable-tbody {
    font-size: 12px;
  }
  .p-paginator {
    padding: 0.2rem;
  }
  .p-paginator,
  button {
    font-size: 14px;
  }
  .p-dropdown-label,
  .p-dropdown-item {
    font-size: 14px;
  }
`;

const PredictIOResult = () => {
  const { id } = useParams();
  const [predictIO, setPredictIO] = useState({
    data: {},
    found: false,
    ready: false,
  });

  useEffect(() => {
    const getData = async () => {
      const res = await axios.get(`/api/predictio/result/${id}`);
      setPredictIO({
        data: { reqInfo: res.data.reqInfo, value: res.data.predictio },
        found: res.data.found,
        error: res.data.error,
        analysisNotReady: res.data.not_ready,
        analysisId: res.data.analysis_id,
        ready: true,
      });
    };
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const downloadCSV = (e) => {
    e.preventDefault();
    let csv = [
      [...Object.keys(predictIO.data.value[0])],
      ...predictIO.data.value.map((item) => [
        item.patient_id,
        item.predictio_value,
      ]),
    ];
    csv = csv.map((item) => item.join(",")).join("\n");
    const csvData = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    FileSaver.saveAs(csvData, "predictio.csv");
  };

  const renderContent = () => {
    let message = undefined;
    if (!predictIO.found) {
      message =
        "The analysis has been deleted since it was more than 30 days old.";
    }
    if (predictIO.found && predictIO.analysisNotReady) {
      message = "The analysis is being processed. Please try again later.";
    }
    if (predictIO.found && predictIO.error) {
      message = `An error occurred during analysis. Please contact support@predictio.ca by referencing the analysis id: ${predictIO.analysisId}.`;
    }
    if (predictIO.data.value && predictIO.data.value.length === 0) {
      message = "PredictIO scores could not be calculated with a given data.";
    }
    if (message) {
      return <h3>{message}</h3>;
    }
    return (
      <React.Fragment>
        <StyledHeader>
          <ResultInfo
            reqInfo={predictIO.data.reqInfo}
            analysisType="predictio"
          />
          <DownloadButton onClick={downloadCSV} text="CSV" />
        </StyledHeader>
        <StyledDataTable
          value={predictIO.data.value}
          paginator
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          rows={10}
          rowsPerPageOptions={[10, 25, 50]}
        >
          <Column
            field="patient_id"
            header="Patient ID"
            sortable
            filter
            filterPlaceholder="Filter by patient ID"
          ></Column>
          <Column field="predictio_value" header="PredictIO" sortable></Column>
        </StyledDataTable>
      </React.Fragment>
    );
  };
  return (
    <Layout>
      <h4>PredictIO Result</h4>
      {!predictIO.ready ? (
        <React.Fragment>
          <h3>Loading...</h3>
          <LoaderContainer>
            <Loader type="Oval" color={colors.blue} height={80} width={80} />
          </LoaderContainer>
        </React.Fragment>
      ) : (
        renderContent()
      )}
    </Layout>
  );
};

export default PredictIOResult;
