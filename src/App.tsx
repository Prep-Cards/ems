import './App.scss';
import { AppContextProvider } from './AppContext';
import AppSettings from './AppSettings';
import DeckLoader from './DeckLoader';
import DeckSettings from './DeckSettings';
import IntroLoader from './IntroLoader';
import Layout from './shared/Layout';

function App() {
    return (
        <div
            className="App"
            ref={(node) => {
                if (node) window.scrollTo(0, 0);
            }}
        >
            <AppContextProvider>
                <Layout
                    as="header"
                    justify={null}
                    className="flex-nowrap h-12 p-2 pb-0 max-w-full overflow-hidden justify-between"
                    style={{ minWidth: 0 }}
                >
                    <DeckSettings />
                    <AppSettings />
                </Layout>
                <DeckLoader />
                <IntroLoader />
            </AppContextProvider>
        </div>
    );
}

export default App;
