import './App.scss';
import { AppContextProvider } from './AppContext';
import AppSettings from './AppSettings';
import DeckLoader from './DeckLoader';
import DeckSettings from './DeckSettings';
import { Layout } from './shared/Layout';

function App() {
    return (
        <div
            className="App"
            ref={(node) => {
                if (node) window.scrollTo(0, 0);
            }}
        >
            <AppContextProvider>
                <Layout as="header">
                    <DeckSettings />
                    <AppSettings />
                </Layout>
                <DeckLoader />
            </AppContextProvider>
        </div>
    );
}

export default App;
