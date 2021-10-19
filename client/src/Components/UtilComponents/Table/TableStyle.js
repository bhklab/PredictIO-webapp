import {colors} from '../../../styles/colors';
import styled from 'styled-components';

const TableStyles = styled.div`
  // margin: 10%;
  //margin: 20px 40px 20px 40px;
  overflow-x: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  h1 {
    color: #c61a1a;
    font-family: 'Raleway', sans-serif;
    font-size: calc(1em + 1vw);
    text-align: center;
    margin-bottom: 50px;
  }

  table {
    border-spacing: 0;
    border: 1px solid rgba(159, 171, 187, 0.62);
    border-radius: 3px;
    width: 100%;
    font-size: clamp(12px, calc(1vw + 1px), 14px);
    background-color: white;

    th,
    td {
      color: dimgray;
      //max-width: 80px;
      padding: calc(0.3vw + 0.3em);
      border-bottom: 1px solid rgba(220, 221, 226, 0.24);
      border-right: 1px solid rgba(220, 221, 226, 0.55);

      :last-child {
        border-right: 0;
      }

      a {
        color: ${colors.blue};

        :hover {
          color: ${colors.hover_blue};
        }
      }
    }
  ;
  }

  tr {
    :hover {
      background: rgba(103, 147, 190, 0.13);
    }
  }

  th {
    font-weight: 600;
    background-color: rgba(103, 147, 190, 0.13);
  }

  .top-settings {
    width: 100%;
    margin-bottom: 10px;
    .search-container {
      display: flex;
      align-items: center;
      input {
        margin-left: 5px;
      }
      i {
        font-size: 14px;
      }
    }
  }

  .pagination {
    display: flex;
    align-items: center;
    margin-top: 10px;
    font-size: 14px;
    button {
      cursor: pointer;
      border: none;
      background: none;
      outline: none;
    }
  }
`;

export default TableStyles;
