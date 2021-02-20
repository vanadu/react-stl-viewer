import React from 'react';

const Title = (props) => {
  console.log('props :>> ');
  console.log(props);
  return (
    <div>
      <h1 className="ui header large">{props.title}</h1>
    </div>
  );
};

export default Title;