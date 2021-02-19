import React from 'react';
import STLViewer from './STLViewer';

class Container extends React.Component {
  state = {isMounted: true};

  render() {
      const {isMounted = true} = this.state;
      return (
          <>
              <button onClick={() => this.setState(state => ({isMounted: !state.isMounted}))}>
                  {isMounted ? "Unmount" : "Mount"}
              </button>
              {isMounted && <STLViewer />}
              {isMounted && <div>Scroll to zoom, drag to rotate</div>}
          </>
      )
  }
}

// const rootElement = document.getElementById("root");
// ReactDOM.render(<Container />, rootElement);

export default Container;