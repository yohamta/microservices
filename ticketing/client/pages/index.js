import buildClient from "../api/build-client";

const LP = ({ currentUser }) => {
  return currentUser ? (
    <h1>You are signed in</h1>
  ) : (
    <h1>You are NOT signed in</h1>
  );
};

LP.getInitialProps = async ({ req }) => {
  const { data } = await buildClient({ req }).get("/api/users/currentuser");
  return data;
};

export default LP;
