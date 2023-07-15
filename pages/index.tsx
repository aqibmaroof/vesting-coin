import type { NextPage } from 'next'
import HomePage from '../Components/HomePage/homepage'
import Claim from './claim';

const Home: NextPage = () => {
  return (
    <>
      {process.env.NEXT_PUBLIC_ADMIN_ACCESS=== 'true' ? <Claim /> : <HomePage />}
    </>
  );
};

export default Home;
