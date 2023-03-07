import Layout from "./UtilComponents/Layout";
import Loader from 'react-loader-spinner';
import { LoaderContainer } from "../styles/PlotStyles";
import { colors } from "../styles/colors";

const Suspension = () => {
  return(
    <Layout>
      <LoaderContainer>
        <Loader type="Oval" color={colors.blue} height={80} width={80}/>
      </LoaderContainer>
    </Layout>
  )
}

export default Suspension;