import { AppProvider } from './contexts/AppProvider';
import { AppRoutes } from './routes';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { Layout } from './components/layout/Layout';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Layout>
          <AppRoutes />
        </Layout>
        <ToastContainer
          position="top-right"
          autoClose={4000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          toastClassName="!rounded-xl !shadow-soft"
        />
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;
