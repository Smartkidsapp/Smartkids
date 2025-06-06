import {createBrowserRouter, RouterProvider} from "react-router-dom";
import HomeOne from "./components/HomeOne/index.jsx";
import HomeTwo from "./components/HomeTwo/index.jsx";
import HomeThree from "./components/HomeThree/index.jsx";
import HomeFour from "./components/HomeFour/index.jsx";
import HomeFive from "./components/HomeFive/index.jsx";
import HomeSix from "./components/HomeSix/index.jsx";
import HomeSeven from "./components/HomeSeven/index.jsx";
import HomeEight from "./components/HomeEight/index.jsx";
import HomeDark from "./components/HomeDark/index.jsx";
import HomeRtl from "./components/HomeRtl/index.jsx";
import News from "./components/News/index.jsx";
import SingleNews from "./components/News/SingleNews.jsx";
import Service from "./components/Service/index.jsx";
import AboutUs from "./components/AboutUs/index.jsx";
import Contact from "./components/Contact/index.jsx";
import Error from "./components/Error/index.jsx";
import AboutUsTwo from "./components/AboutUs/AboutUsTwo.jsx";
import Shops from "./components/Shops/index.jsx";
import ShopDetails from './components/Shops/Details';
import Layout from "./components/Helper/Layout.jsx";
import Register from "./components/Register/index.jsx";
import Etablissement from "./components/Etablissement/index.jsx";
import Login from "./components/Login/index.jsx";
import VerifyEmail from "./components/Login/VerifyEmail.jsx";
import Welcome from "./components/Welcom/index.jsx";
import Proprietaire from "./components/HomeTwo/Proprietaire.jsx";
import PasswordForgottenScreen from "./components/Login/PasswordForgotten.jsx";
import PasswordRecoveryCode from "./components/Login/PasswordRecoveryCode.jsx";
import PasswordReset from "./components/Login/PasswordReset.jsx";
import Mention from "./components/Legal/Mention.jsx";
import Cgv from "./components/Legal/Cgv.jsx";
import Account from "./components/Account/index.jsx";
import Cgu from "./components/Legal/Cgu.jsx";
import Politique from "./components/Legal/Politique.jsx";

const router = createBrowserRouter([
  {
    path:'/',
    Component:Layout,
    children:[
      {
        index:true,
        element: <HomeTwo />
      },
      {
        path: "/home-one",
        element: <HomeOne />
      },
      {
        path: "/home-two",
        element: <HomeTwo />
      },
      {
        path: "/home-three",
        element: <HomeThree />
      },
      {
        path: "/home-four",
        element: <HomeFour />
      },
      {
        path: "/home-five",
        element: <HomeFive />
      },
      {
        path: "/home-six",
        element: <HomeSix />
      },
      {
        path: "/home-seven",
        element: <HomeSeven />
      },
      {
        path: "/home-eight",
        element: <HomeEight />
      },
      {
        path: "/home-dark",
        element: <HomeDark />
      },
      {
        path: "/home-rtl",
        element: <HomeRtl />
      },
      {
        path: "/news",
        element: <News />
      },
      {
        path: "/news/single-news",
        element: <SingleNews />
      },
      {
        path: "/service",
        element: <Service />
      },
      {
        path: "/about-us",
        element: <AboutUs />
      },
      {
        path: "/contact",
        element: <Contact />
      },
      {
        path: "/error",
        element: <Error />
      },
      {
        path: "/about-us-another",
        element: <AboutUsTwo />
      },
      {
        path: "/shops",
        element: <Shops />
      },
      {
        path: "/shops/shop-details",
        element: <ShopDetails />
      },
      {
        path: "/register",
        element: <Register />
      },
      {
        path: "/login",
        element: <Login />
      },
      {
        path: "/verify-email",
        element: <VerifyEmail />
      },
      {
        path: "/forgetten-password",
        element: <PasswordForgottenScreen />
      },
      {
        path: "/password-recovery",
        element: <PasswordRecoveryCode />
      },
      {
        path: "/password-reset",
        element: <PasswordReset />
      },
      {
        path: "/etablissement",
        element: <Etablissement />
      },
      {
        path: "/welcome",
        element: <Welcome />
      },
      {
        path: "/proprietaire",
        element: <Proprietaire />
      },
      {
        path: "/mentions-legales",
        element: <Mention />
      },
      {
        path: "/conditions-generales-de-vente",
        element: <Cgv />
      },
      {
        path: "/conditions-generales-d-utilisation",
        element: <Cgu />
      },
      {
        path: "/politiques-de-confidentialites",
        element: <Politique />
      },
      {
        path: "/account",
        element: <Account />
      },
      {
        path: "*",
        element: <Error />
      },
    ]
  }
]);

function Router() {
  return (
      <>
        <RouterProvider router={router} />
      </>
  );
}

export default Router;
