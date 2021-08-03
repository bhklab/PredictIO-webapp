import {colors} from '../../../styles/colors';
import styled from 'styled-components';

const TableStyles = styled.div`
  margin: 5% 10% 5% 10%;
  margin: 20px 40px 20px 40px;
  overflow-x: auto;

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
`;

export default TableStyles;
