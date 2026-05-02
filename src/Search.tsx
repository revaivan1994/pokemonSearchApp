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

    const savedTerm = localStorage.getItem(STORAGE_KEY);

    this.state = {
      inputValue: savedTerm !== null ? savedTerm : '',
    };
  }

  handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ inputValue: e.target.value });
  };

  handleSearchClick = () => {
    const trimmedValue = this.state.inputValue.trim();

    localStorage.setItem(STORAGE_KEY, trimmedValue);

    this.props.onSearch(trimmedValue);
  };

  handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      this.handleSearchClick();
    }
  };

  render() {
    return (
      <div className="search-block">
        <input
          type="text"
          value={this.state.inputValue}
          onChange={this.handleInputChange}
          onKeyDown={this.handleKeyDown}
          placeholder="enter pokemon name..."
          className="search-input"
        />
        <button onClick={this.handleSearchClick} className="search-btn">
          Search
        </button>
      </div>
    );
  }
}

export default Search;
