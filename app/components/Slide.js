import React from 'react';

export default ({pin, cutLen}) => {
  const note = (pin.note.length > cutLen) ? pin.note.substr(0, cutLen - 3) + "..." : pin.note;

  return (<div className="slide">
    <img src={pin.image.original.url}/>
    <p>{note}</p>
  </div>)
}
