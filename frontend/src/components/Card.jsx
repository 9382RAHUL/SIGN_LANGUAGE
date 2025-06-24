const Card = (props) => {
  return (
    <div className="flex justify-center items-start  h-1/2 m-0 p-0 border border-gray-300 shadow-lg rounded-lg">
      <div className="w-80 p-5 mt-10 bg-white rounded-2xl shadow-lg transform transition duration-500 hover:scale-105 hover:bg-gradient-to-br hover:from-blue-500 hover:to-purple-600 group">
        <div className="flex justify-center">
          <img
            src="https://randomuser.me/api/portraits/men/75.jpg"
            alt="Profile"
            className="w-24 h-24 rounded-full border-4 border-white shadow-md transition duration-500 group-hover:border-purple-300"
          />
        </div>

        <div className="text-center mt-4">
          <h2 className="text-xl font-semibold text-gray-800 group-hover:text-white">
            {props.name}
          </h2>
          <p className="text-sm text-gray-500 mt-1 group-hover:text-white">
            {props.degree}
          </p>
          <p className="text-sm text-gray-500 group-hover:text-white">
            {props.college}
          </p>
          <p className="text-sm text-gray-500 group-hover:text-white">
            {props.place}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Card;
