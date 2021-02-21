import React from 'react';
import './Container.css';
import STLViewer from './STLViewer';
import Title from './Title';

// !VA Using this example: https://codesandbox.io/s/github/supromikali/react-three-demo?file=/src/index.js:0-4455

const contents = [
  { id: 1, title: 'Mic Clip', stlfile: 'Model1'},
  { id: 2, title: 'Mixer Stand', stlfile: 'Model2'},
  { id: 3, title: 'Computer Riser', stlfile: 'Model3'}
];
// const title = 'This is the title';


class Container extends React.Component {
  constructor(props) {
    super(props);

    
  }
  
  state = {isMounted: true};




  render() {
      const {isMounted = true} = this.state;

      const renderedContents = contents.map(({ id, title}) => {
        return ( 
              <div className="ui card">
                <div 
                  className="ui header large" 
                  key={id}><Title title={title} />
                </div>
                <button class="btn" onClick={() => this.setState(state => ({isMounted: !state.isMounted}))}>
                  {isMounted ? "Unmount Model" : "Mount Model"}
                </button>
                {isMounted && <STLViewer />}
                {isMounted && <div className="ui content caption">Scroll to zoom, drag to rotate</div>}
              </div>     
        );
      });

      return (
          <>  
          {renderedContents}
          </>
      )
  }
}

// const rootElement = document.getElementById("root");
// ReactDOM.render(<Container />, rootElement);

export default Container;