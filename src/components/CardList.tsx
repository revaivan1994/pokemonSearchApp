import { Component } from 'react';
import type { Pokemon } from '../types';
import Card from './Card';

interface Props {
  items: Pokemon[];
}

class CardList extends Component<Props> {
  render() {
    return (
      <div className="card-list">
        {this.props.items.map((item) => (
          <Card key={item.name} item={item} />
        ))}
      </div>
    );
  }
}

export default CardList;