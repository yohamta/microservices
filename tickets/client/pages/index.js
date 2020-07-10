import buildClient from "../api/build-client";

const LP = ({ currentUser }) => {
  console.log(currentUser);
  return <h1>Landing Page</h1>;
};

LP.getInitialProps = async ({ req }) => {
  const { data } = await buildClient({ req }).get("/api/users/currentuser");
  return data;
};

export default LP;
