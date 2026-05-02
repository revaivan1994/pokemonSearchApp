import { Component } from 'react';
import type { Pokemon } from '../types';

interface Props {
  item: Pokemon;
}

class Card extends Component<Props> {
  render() {
    const { item } = this.props;
    const id = item.url.split('/').filter(Boolean).at(-1);

    return (
      <div className="card">
        <span className="card-name">{item.name}</span>
        <span className="card-desc">Pokémon #{id}</span>
      </div>
    );
  }
}

export default Card;