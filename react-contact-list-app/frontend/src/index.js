import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import $ from 'jquery';
// import TransitionGroup from 'react-transition-group/CSSTransitionGroup';

class AddContactForm extends React.Component {
  render() {
    var contactObject = {name: this.props.name, phone: this.props.phone, email: this.props.email, type: this.props.type, favorite: this.props.favorite};
    return (
      <div>
        <h2>Add Contact</h2>
        <div className="add-contact">
          <label>Name</label>
          <input type="text" className="form-control" value={this.props.name} onChange={event => this.props.changeStateValue(event, 'name') }/>
          <label>Phone</label>
          <input type="text" className="form-control" value={this.props.phone} onChange={event => this.props.changeStateValue(event, 'phone')}/>
          <label>Email</label>
          <input type="email" className="form-control" value={this.props.email} onChange={event => this.props.changeStateValue(event, 'email')}/>
          <label>Type</label>
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
      saved: [],
      favorites: [],
      favoritesOnly: false,
      id: '',
      name: '',
      phone: '',
      email: '',
      type: '',
      favorite: false
    };
  }
  componentDidMount() {
    $.get('http://localhost:3000/api/contacts')
      .then(contacts => {
        let favorites2 = [];
        contacts.map(contact => {
            if (contact.favorite === true) {
              favorites2.push(contact);
            }
            return contact;
        })
        this.setState({
          saved: contacts,
          favorites: favorites2
        })
      });
  }
  changeStateValue (event, stateName) {
    this.setState({
      [stateName]: event.target.value
    });
  }
  submit(event) {
    event.preventDefault();
  }
  addContact(contactObject) { //need to fix this
      $.ajax({
        method: 'POST',
        url: 'http://localhost:3000/api/contacts',
        data: JSON.stringify(contactObject),
        contentType: 'application/json'
      })
      .then(added => {
        this.state.saved.push(added);
        this.setState({
          saved: this.state.saved
        })
      });
    }

  deleteContact(contact) {
    $.ajax({
      method: 'DELETE',
      url: 'http://localhost:3000/api/contacts/' + contact.id
    })
    .then(deleted => {
      this.setState({
        saved: this.state.saved.splice(1, deleted.id) //need to fix this when toggled to favorites
      })
    });
  }
  addToFavorites(contact) {
    if (contact.favorite === true) {
      contact.favorite = false;
    }
    else {
      contact.favorite = true;
    }
    $.ajax({
      method: 'PUT',
      url: 'http://localhost:3000/api/contacts/' + contact.id,
      data: JSON.stringify(contact),
      contentType: 'application/json'
    })
    .then(favorited => {
      if (favorited.favorite === true) {
        this.state.favorites.push(favorited);
        // console.log(this.state.favorites);
        this.setState({
          favorites: this.state.favorites
        })
      } else {
        let newArray = this.state.favorites.slice();
        console.log(newArray);
        newArray.splice(1, favorited.id);
        // console.log(this.state.favorites);
        this.setState({
          favorites: newArray
        })
      }
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

        <AddContactForm
        name={this.state.name}
        phone={this.state.phone}
        email={this.state.email}
        type={this.state.type}
        changeStateValue={(event, stateName) => this.changeStateValue(event, stateName)} addContact={() => this.addContact({id: this.state.id, name: this.state.name, phone: this.state.phone, email: this.state.email, type: this.state.type, favorite: this.state.favorite})}/>

        <div className="contact-list">
          <div><h2>{contactSectionName}</h2><button type="submit" className="toggle btn btn-primary" onClick={() => this.toggleContacts()}>{toggleButtonName}</button></div>

            {contactSection.map((contact) =>
              <div className="saved-contacts" key={contact.id}>
                <ul>
                  <li>{contact.name}</li><li>{contact.email}</li><li> {contact.phone}</li><li>{contact.type}</li>
                </ul>
                <div><button type="submit" className="delete btn btn-primary" onClick={() => this.deleteContact(contact)}>Delete</button></div>
                <div><button type="submit" className="favorites btn btn-primary" onClick={() => this.addToFavorites(contact)}>Add to Favorites</button></div>
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
