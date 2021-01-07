import React, {useState} from 'react';
import Layout from '../UtilComponents/Layout';
import styled from 'styled-components';
import ForestPlot from "../Diagram/ForestPlot";

const Explore = () => {

  const [data, setData] = useState({data: {}, ready: false});

  const getData = async () => {
    const res = await fetch('/api/test', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    const json = await res.json();
    console.log(json);
    setData({data: json, ready: true});
  }

  return (
    < Layout >
    {
      data.ready ?
    < div
  className = "wrapper" >
    < h2 > Output
  from
  server < /h2>
  < div >
  {JSON.stringify(data.data, null, 2)}
  < /div>
  < /div>
:
<ForestPlot/>
}
<
  /Layout>
);
}

export default Explore;
