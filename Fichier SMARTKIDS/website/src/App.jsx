import Router from "./Router.jsx";
import {useEffect, useState} from "react";
import Loader from "./components/Helper/Loader.jsx";
import Layout from "./components/Helper/Layout.jsx";
import { Provider } from "react-redux";
import { store } from "./redux/store";

function App() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    });



  return (
    <Provider store={store}>
        {loading && (
            <div className={`appie-loader ${loading ? 'active' : ''}`}>
                <Loader />
            </div>
        )}
        <div className={`appie-visible ${loading === false ? 'active' : ''}`}>

                <Router />

        </div>

    </Provider>
  );
}

export default App;
