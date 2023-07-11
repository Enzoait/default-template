import React, { Component } from 'react';

/**
 * Page not found
 */
class Page404 extends Component {

  render() {

    return (
            <div className="p_404">
              <h1>404</h1>
              <h4>Oops! You're lost.</h4>
              <p className="text-muted float-left">The page you are looking for was not found.</p>
            </div>
    );
  }
}

export default Page404;
