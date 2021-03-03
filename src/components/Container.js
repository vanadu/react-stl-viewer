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


class Container extends React.Component {
  state = {isMounted: true};


  render() {
      const {isMounted = true} = this.state;
      console.log('this.state :>> ');
      console.log(this.state);

      const renderedContents = contents.map(({ id, title, model}) => {
        return ( 
          // !VA The key has to go on the parent component of the 'list', i.e. the elements generated by the map.
          <div className="ui card" key={id}>
            <div 
              className="ui header large" 
              ><Title title={title} />
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

export default Container;