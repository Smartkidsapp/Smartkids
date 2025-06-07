import { RouterProvider } from "react-router-dom";
import { store } from "@/redux/store";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Provider } from "react-redux";
import { Toaster } from "@/components/ui/sonner";
import { router } from "@/router";

function App() {
  return (
    <Provider store={store}>
      <TooltipProvider>
        <Toaster position="top-center" />
        <RouterProvider router={router} />
      </TooltipProvider>
    </Provider>
  );
}

export default App;
