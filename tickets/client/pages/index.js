import axios from "axios";

const LP = ({ currentUser }) => {
  console.log(currentUser);
  return <h1>Landing Page: {currentUser.email}</h1>;
};

LP.getInitialProps = async ({ req }) => {
  const response = await axios.get(
    "http://auth-srv:3000/api/users/currentuser",
    { headers: req ? { cookie: req.headers.cookie } : null }
  );
  return response.data;
};

export default LP;
