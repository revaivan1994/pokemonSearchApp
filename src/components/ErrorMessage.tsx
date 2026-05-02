import { Component } from 'react';

interface Props {
  message: string;
}

class ErrorMessage extends Component<Props> {
  render() {
    return (
      <div className="error-message" role="alert">
        {this.props.message}
      </div>
    );
  }
}

export default ErrorMessage;