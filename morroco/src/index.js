import React, { Component } from 'react';
import DATA from './data.json';
import './styles.css';

//presentational compoenents
const TripDay = (props) => {
  return(
    <li
    id={props.id}
    draggable
    optionid={props.optionId}
    onDragStart={props.onDragStart}
    >
    <div className="trip-selection">
      <h2>{props.title}</h2>
      <span><i>{props.days}</i></span>
    </div>
    </li>
  );
};

const Extension = (props) => {
  return(
    <li
    id={props.id}
    draggable
    optionid={props.optionId}
    onDragStart={props.onDragStart}
    >
    <div className="trip-selection">
      <h2>Extension</h2>
    </div>
    </li>
  );
};

const Accomadation = (props) => {
  return(
    <li
    id={props.id}
    draggable
    optionid={props.optionId}
    onDragStart={props.onDragStart}
    >
    <div className="trip-selection">
      <h2>{props.name}</h2>
      <span><i>{props.location}</i></span>
    </div>
    </li>
  );
};

export default class ItinerarySelection extends Component  {
  constructor(props){
    super(props);
    this.state = {
      trip : DATA,
      options: [],
      extensions: [],
      accomadations: [],
      tripDays: [],
      itinerary: []
    }
  }
  componentDidMount() {

    const extensions = this.state.trip['included'].filter(
        e => e.type === 'tripExtension'
    )
    .map((x,index) => (
      <Extension
        title={x.attributes.title}
        key={index+x.id}
        optionid={x.id}
        onDragStart={(e) => this.dragOption(e, x.id)}
      />
    ));

    const accomadations = this.state.trip['included'].filter(
        a => a.type === 'accomadation'
    ).map((x,index) => (
      <Accomadation
        name={x.attributes.name}
        key={index+x.id}
        optionid={x.id}
        onDragStart={(e) => this.dragOption(e, x.id)}
        location={x.attributes.location}
      />
    ));

    const tripDays = this.state.trip['included'].filter(
        d => d.type === 'tripDay'
    ).map((x,index) => (
      <TripDay
        title={x.attributes.title}
        key={index+x.id}
        optionid={x.id}
        onDragStart={(e) => this.dragOption(e, x.id)}
        days={x.attributes.day}
        description={x.attributes.description}
      />
    ));

    console.log('tripDays:', tripDays);
    console.log('accomadations:', accomadations);
    console.log('extensions:', extensions);

    this.setState({
      trip: this.state.trip['data'].attributes,
      extensions: extensions,
      accomadations: accomadations,
      tripDays: tripDays
      });
  }

  tripOptionDrop = (e) => {
    e.preventDefault();
    console.log('tripOptionDrop');
    let itinerary = document.getElementById('itinerary').append(e);
    console.log(e);
  };

  dragOption = (e, id) => {
    console.log('dragOption: ', id);
    e.dataTransfer.setData('id', id);
  };

  selectOption = (e, status) => {
    let allOptions = [ ...this.state.extensions, ...this.state.tripDays, ...this.state.accomadations ];
    console.log('allOptions: ', allOptions);
    let id = e.dataTransfer.getData("id");
    console.log('selected id: ', id);
    let selected = allOptions.filter(o => o.props.optionid == id );
    console.log('selected:', selected);
    this.setState({
        ...this.state,
        itinerary: [ ...this.state.itinerary, selected]
    });
  };

  deselectOption = (e, status) => {
    let id = e.dataTransfer.getData("id");
    console.log('deselected: ', id );

    let newItinerary = [ ...this.state.itinerary ].filter( x => x[0].props.optionid !== id.toString());
    console.log(newItinerary);
    this.setState({
      ...this.state,
      itinerary: newItinerary
    });
  };

  onDragOver = (e) => {
    e.preventDefault();
  };

  constructDetails = () => {
    let itinerary = this.state.itinerary;
    //loop thru the itinerary and get the earliest date and the latest date then update the state.trip
    console.log(itinerary);
    //let sorted = itinerary.sort(function(a,b){
    //     return Date.parse(a) > Date.parse(b);
    // });
    let trip = this.state.trip;

    console.log(trip);
  };

  render(){
    this.constructDetails();
    return(
      <div className="trip-content">
        <div className="trip-details">
          <h2> { this.state.trip.departureName } </h2>
          <time>{this.state.trip.startsOn}</time> to <time>{this.state.trip.endDate}</time>

        </div>
        <div className="options">
          <ul className="trip-days" onDragOver={(e) => this.onDragOver(e)} onDrop={(e) => this.deselectOption(e, 'deselect')}>
            { [ ...this.state.tripDays, ...this.state.accomadations, ...this.state.extensions ]}
          </ul>
          <ul id="itinerary" className="itinerary" onDragOver={(e) => this.onDragOver(e)} onDrop={(e) => this.selectOption(e, 'select')}>
            {
              this.state.itinerary
            }
          </ul>
        </div>
      </div>
    );
  }
}
