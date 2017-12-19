import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';

import Seat from '../../containers/seat';

class Seatrow extends Component {
  constructor(props) {
    super(props);

    this.seatRowStyle = {};
    this.rowWrapperStyle = {};
  }

  componentWillMount() {
    if (this.props.zone == 'z3') {
      this.seatRowStyle.flexDirection = 'column';
      this.rowWrapperStyle.flexDirection = 'row-reverse';
    }
    else if (this.props.zone === 'z4') {
      this.seatRowStyle.justifyContent = 'flex-end';
    }
  }

  renderFromTo(from, to = null) {
    const result = [];
    this.props.seats.map((seatsRow, rowIndex) => {
      if (rowIndex >= from && (to === null || rowIndex < to)) {
        result.push(this.renderSeat(seatsRow, rowIndex));
      }
    });
    return (result);
  }

  renderSeat(seatsRow, rowIndex) {
    return (
      <div
        className={'seatRow'}
        style={this.seatRowStyle}
        key={`row${rowIndex + 1}`}
      >
        {seatsRow.map((seat, seatIndex) => {
          
          return (
            <Seat
              key={`seat${seatIndex + 1}`}
              hostname={`${this.props.zone}r${rowIndex + 1}p${seatIndex + 1}`}
              user={this.props.users.array[`${this.props.zone}r${rowIndex + 1}p${seatIndex + 1}`]}
            />
          );
        })}
      </div>
    );
  }

  renderRow() {
    const seats = [...this.props.seats];
    if (this.props.zone === 'z1') {
      return (
        <Fragment>
          <div className={'z1Container'}>{this.renderFromTo(0, 5)}</div>
          <div className={'z1Container'}>{this.renderFromTo(5)}</div>
        </Fragment>
      );
    }
    return seats.map((seatsRow, rowIndex) => {
      return (
        this.renderSeat(seatsRow, rowIndex)
      );
    });
  }

  render() {
    return (
      <div
        className={'rowWrapper'}
        style={this.rowWrapperStyle}
      >
        {this.renderRow()}
      </div>
    );
  }
}

Seatrow.proptypes = {
  seats: PropTypes.array.isRequired,
  zone: PropTypes.string.isRequired,
  users: PropTypes.object.isRequired
};

export default Seatrow;
