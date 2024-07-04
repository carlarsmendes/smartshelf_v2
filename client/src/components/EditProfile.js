import React from "react";
import {
  Button,
  Input,
  Label,
  FormFeedback,
  Form,
  FormGroup
} from "reactstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserEdit } from '@fortawesome/free-solid-svg-icons'
import api from "../api";

export default class EditProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: this.props.theProfile.user.username,
      favoriteBooks: this.props.theProfile.user.favoriteBooks,
      favoriteQuote: this.props.theProfile.user.favoriteQuote,
      showEditForm: true,
      message: ''
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this)
  }
  handleInputChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }
  handleFileChange(event) {
    this.setState({
      picture: event.target.files[0]
    })
  }

  handleFormSubmit(e){
    const uploadData = new FormData();
    uploadData.append("username", this.state.username);
    uploadData.append("picture", this.state.picture);
    uploadData.append("favoriteBooks", this.state.favoriteBooks);
    uploadData.append("favoriteQuote", this.state.favoriteQuote);

    api.editProfile(uploadData)
      .then(result => {
        this.props.updateProfile();
        this.setState({
          message: `Your profile was updated!`,
          //showEditForm: !this.state.showEditForm,
        });
        setTimeout(() => {
          this.setState({
            message: null
          });
        }, 2000);
      })
      .catch(err => this.setState({ message: err.toString() }));
}
  showEditForm = () => {
    this.setState({
      showEditForm: !this.state.showEditForm
    })
   
    }
  render() {
    return (
      <div className="editForm">
        {this.state.showEditForm ? (
          <div className="edit-button" style={{flexDirection:'row'}}>
          <FontAwesomeIcon icon={faUserEdit} size="1x" className="icon" onClick={this.showEditForm}>edit</FontAwesomeIcon>
          </div>
        ) : ( //ternary
          <Form className="form-container">
            <FormGroup>
          {/* Conditional rendering to prevent not inputting any username */}
            <Label for="username">Username:{" "}</Label>
            {!this.state.username ? <div><Input invalid type="text" value={this.state.username} name="username" onChange={this.handleInputChange}
            />{" "}
            <FormFeedback>Oh noes! You have to write your username</FormFeedback></div> 
            :
            <div><Input valid type="text" value={this.state.username} name="username" onChange={this.handleInputChange}
            />{" "}</div>}

            <Label for="picture">Picture:{" "}</Label>
            <Input type="file" id="exampleCustomFileBrowser" name="picture" label="Bring that smile on!" onChange={this.handleFileChange}/>
            {" "}<br />
            </FormGroup>
            <FormGroup>
            <Label for="favoriteBooks">Favorite Book:{" "}</Label>
            <Input type="textarea" value={this.state.favoriteBooks} name="favoriteBooks" cols="20" rows="5" onChange={this.handleInputChange}
            />{" "}<br />
            <Label for="favoriteQuote">Favorite Quote:{" "}</Label>
            <Input type="textarea" value={this.state.favoriteQuote} name="favoriteQuote" cols="20" rows="5" onChange={this.handleInputChange}
            />{" "}<br />
            </FormGroup>
        {/* Show disabled button if there is no username  -> Ternary */}
        {this.state.message}
            {!this.state.username ? <Button disabled  className="add-library-button btn" onClick={() => this.handleFormSubmit()}>
              Confirm
            </Button> :
            <Button className="add-library-button btn" onClick={() => this.handleFormSubmit()}>
              Confirm
            </Button>}
            <Button onClick={this.showEditForm} className="add-library-button btn">
              Back
              </Button>
        </Form>)}
      </div>
    );
  }
}