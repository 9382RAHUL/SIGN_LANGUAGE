import Body from "./Body.jsx";
import Footer from "./Footer.jsx";
import ImagesHover from "./ImagesHover.jsx";
import Navbar from "./Navbar.jsx";
import Team from "./Team.jsx";
import Working from "./Working.jsx";
const Home = () => {
  return (
    <div>
      <Navbar />
      <div className="flex flex-row body-div1">
        <Body />
        <ImagesHover />
      </div>

      <Working />
      <Team />
      <Footer />
    </div>
  );
};

export default Home;
