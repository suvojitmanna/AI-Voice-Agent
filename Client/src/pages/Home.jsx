const Home = ({ user }) => {
  console.log("Home User:", user);

  return (
    <div className="text-4xl text-green-500">
      {user?.name}
    </div>
  );
};

export default Home;