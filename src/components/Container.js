import React from 'react';
import './Container.css';
import Scene from './Scene';
import Title from './Title';
import Model1 from '../assets/model1.stl';
import Model2 from '../assets/model2.stl';
import Model3 from '../assets/model3.stl';

// !VA Using this example: https://codesandbox.io/s/github/supromikali/react-three-demo?file=/src/index.js:0-4455

const contents = [
  { id: 1, title: 'Mic Clip', model: Model1},
  { id: 2, title: 'Mixer Stand', model: Model2},
  { id: 3, title: 'Computer Riser', model: Model3}
];
// const title = 'This is the title';


class Container extends React.Component {
  constructor(props) {
    super(props);
    console.log('this.props :>> ');
    console.log(this.props);
    
  }
  
  state = {isMounted: true};





  render() {
      const {isMounted = true} = this.state;

      const renderedContents = contents.map(({ id, title, model}) => {
        return ( 
              <div className="ui card">
                <div 
                  className="ui header large" 
                  key={id}><Title title={title} />
                </div>
                <button className="btn" onClick={() => this.setState(state => ({isMounted: !state.isMounted}))}>
                  {isMounted ? "Unmount Model" : "Mount Model"}
                </button>
                {isMounted && <Scene model={model}/>}
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