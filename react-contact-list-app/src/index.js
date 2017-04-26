import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// import TransitionGroup from 'react-transition-group/CSSTransitionGroup';

class AddContactForm extends React.Component {
  render() {
    var contactObject = {name: this.props.name, phone: this.props.phone, email: this.props.email, type: this.props.type};
    return (
      <div>
        <h2>Add Contact</h2>
        <div className="add-contact">
          <label>Name?</label>
          <input type="text" className="form-control" value={this.props.name} onChange={event => this.props.changeStateValue(event, 'name') }/>
          <label>Phone?</label>
          <input type="text" className="form-control" value={this.props.phone} onChange={event => this.props.changeStateValue(event, 'phone')}/>
          <label>Email?</label>
          <input type="email" className="form-control" value={this.props.email} onChange={event => this.props.changeStateValue(event, 'email')}/>
          <label>Type?</label>
          <select className="form-control" value={this.props.type} onChange={event => this.props.changeStateValue(event, 'type')}>
            <option>Select from list</option>
            <option value="Friend">Friend</option>
            <option value="Family">Family</option>
            <option value="Colleague">Colleague</option>
            <option value="Service">Service</option>
          </select>
          <div><button type="submit" className="add btn btn-primary" onClick={() => this.props.addContact(contactObject)}>Add</button></div>
        </div>
      </div>
    );
  }
}

class Contacts extends React.Component {
  constructor () {
    super();
    this.state = {
      saved: [
        {name: 'Jenny', phone: '404-985-1476', email: 'jenny@gmail.com', type: 'Family'},
        {name: 'Lucian', phone: '404-323-1476', email: 'lucian@gmail.com', type: 'Friend'},
      ],
      favorites: [
        {name: 'Jenny', phone: '404-985-1476', email: 'jenny@gmail.com', type: 'Family'}
      ],
      favoritesOnly: false,
      name: '',
      phone: '',
      email: '',
      type: ''
    };
  }
  changeStateValue (event, stateName) {
    this.setState({
      [stateName]: event.target.value
    });
  }
  submit(event) {
    event.preventDefault();
  }
  addContact(contactObject) {
    let newArray = this.state.saved.slice(); //this is so the state array is not altered directly without setState
    newArray.push(contactObject);
    this.setState({
      saved: newArray
    });
  }
  deleteContact(index) {
    let newArray = this.state.saved.slice(); //this is so the state array is not altered directly without setState
    newArray[index] = '';
    this.setState({
      saved: newArray
    });
  }
  addToFavorites(index) {
    let newArray = this.state.favorites.slice();
    newArray.push(this.state.saved[index]);
    this.setState({
      favorites: newArray
    });
  }
  toggleContacts() {
    if (this.state.favoritesOnly === false) {
      this.setState({
        favoritesOnly: true
      })
    } else {
      this.setState({
        favoritesOnly: false
      })
    }
  }
  render() {
    var contactSection;
    var contactSectionName;
    var toggleButtonName;
    if (this.state.favoritesOnly === true) {
      contactSection = this.state.favorites;
      contactSectionName = "Favorites";
      toggleButtonName = "Click for All Contacts";
    }
    else {
      contactSection = this.state.saved;
      contactSectionName = "All Contacts";
      toggleButtonName = "Click for Favorites";
    }
    return (
      <div className="main">

        <AddContactForm name={this.state.name} phone={this.state.phone} email={this.state.email} type={this.state.type} changeStateValue={(event, stateName) => this.changeStateValue(event, stateName)} addContact={() => this.addContact({name: this.state.name, phone: this.state.phone, email: this.state.email, type: this.state.type})}/>

        <div className="contact-list">
          <div><h2>{contactSectionName}</h2><button type="submit" className="toggle btn btn-primary" onClick={() => this.toggleContacts()}>{toggleButtonName}</button></div>

            {contactSection.map((contact, index) =>
              <div className="saved-contacts" key={index}>
                <ul>
                  <li>{contact.name}</li><li>{contact.email}</li><li> {contact.phone}</li><li>{contact.type}</li>
                </ul>
                <div><button type="submit" className="delete btn btn-primary" onClick={() => this.deleteContact(index)}>Delete</button></div>
                <div><button type="submit" className="favorites btn btn-primary" onClick={() => this.addToFavorites(index)}>Add to Favorites</button></div>
              </div>
            )}
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <Contacts />,
  document.getElementById('root')
);
