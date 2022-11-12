import './App.scss';
import { AppContextProvider } from './AppContext';
import AppSettings from './AppSettings';
import DeckLoader from './DeckLoader';
import DeckInfo from './DeckInfo';
import IntroLoader from './IntroLoader';
import Layout from './shared/Layout';

function App() {
    return (
        <div className="App w-full h-full flex flex-col max-w-4xl" style={{ minHeight: ' -webkit-fill-available' }}>
            <AppContextProvider>
                <Layout as="header" justify={null}>
                    <DeckInfo className="p-2 overflow-hidden overflow-ellipsis whitespace-nowrap" />
                    <AppSettings />
                </Layout>
                <DeckLoader />
                <IntroLoader />
            </AppContextProvider>
        </div>
    );
}

export default App;
