import { Component } from 'react';

const STORAGE_KEY = 'searchTerm';

interface Props {
  onSearch: (term: string) => void;
}

interface State {
  inputValue: string;
}

class Search extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const saved = localStorage.getItem(STORAGE_KEY) ?? '';
    this.state = { inputValue: saved };
  }

  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ inputValue: e.target.value });
  };

  handleSearch = () => {
    const trimmed = this.state.inputValue.trim();
    localStorage.setItem(STORAGE_KEY, trimmed);
    this.props.onSearch(trimmed);
  };

  render() {
    return (
      <section className="search-section">
        <input
          type="text"
          value={this.state.inputValue}
          onChange={this.handleChange}
          placeholder="Search Pokémon..."
          className="search-input"
        />
        <button onClick={this.handleSearch} className="search-button">
          Search
        </button>
      </section>
    );
  }
}

export default Search;