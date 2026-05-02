import { Component } from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import Header from './components/Header';
import Search from './components/Search';
import CardList from './components/CardList';
import Spinner from './components/Spinner';
import ErrorMessage from './components/ErrorMessage';
import { fetchPokemons } from './api/pokemonApi';
import type { AppState } from './types';

class App extends Component<object, AppState> {
  private prevSearch: string | null = null;

  constructor(props: object) {
    super(props);

    const saved = localStorage.getItem('searchTerm') || '';

    this.state = {
      items: [],
      loading: false,
      error: null,
      searchTerm: saved,
    };
  }

  componentDidMount() {
    this.loadPokemons(this.state.searchTerm);
  }
  loadPokemons = async (term: string) => {
    if (term === this.prevSearch) {
      return;
    }
    this.prevSearch = term;

    this.setState({ loading: true, error: null });
    await new Promise((resolve) => setTimeout(resolve, 300));

    try {
      const data = await fetchPokemons(term);
      this.setState({
        items: data.results,
        loading: false,
      });
    } catch (err) {
      let message = 'something went wrong';
      if (err instanceof Error) {
        message = err.message;
      }
      this.setState({
        error: message,
        loading: false,
        items: [],
      });
    }
  };

  handleSearch = (term: string) => {
    this.setState({ searchTerm: term });
    this.loadPokemons(term);
  };
  throwError = () => {
    throw new Error('test error!!! error boundary works');
  };

  render() {
    const { items, loading, error } = this.state;

    return (
      <ErrorBoundary>
        <div className="app">
          <Header />
          <div className="content">
            <section className="top-section">
              <Search onSearch={this.handleSearch} />
            </section>
            {/* results */}
            <section className="results-section">
              <h3>Results:</h3>
              {loading && <Spinner />}
              {!loading && error && <ErrorMessage message={error} />}
              {!loading && !error && <CardList items={items} />}
            </section>
          </div>

          {/* { error line } */}
          <button className="error-btn" onClick={this.throwError}>
            Simulate Error
          </button>
        </div>
      </ErrorBoundary>
    );
  }
}

export default App;
