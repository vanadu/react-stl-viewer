import React from 'react';

const Title = (props) => {
  return (
    <>
      <h1 className="ui header large">{props.title}</h1>
    </>
  );
};

export default Title;