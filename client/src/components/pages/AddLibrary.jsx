import React, { useState } from 'react';
import { Button, Input, Form, FormGroup, Label } from 'reactstrap';
import api from '../../api';
import AutocompletePlace from '../AutocompletePlace';
import { useNavigate } from 'react-router-dom';

const AddLibrary = () => {
  const [name, setName] = useState('');
  const [picture, setPicture] = useState(null);
  const [place, setPlace] = useState(null);
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case 'name':
        setName(value);
        break;
      case 'description':
        setDescription(value);
        break;
      default:
        break;
    }
  };

  const handleFileChange = (event) => {
    setPicture(event.target.files[0]);
  };

  const handleSelect = (selectedPlace) => {
    setPlace(selectedPlace);
  };

  const addLibraryAndRedirectToProfile = async (e) => {
    e.preventDefault();
    const uploadData = new FormData();
    uploadData.append('name', name);
    uploadData.append('picture', picture);
    uploadData.append('address', place.place_name);
    uploadData.append('coordinates_lng', place.center[0]);
    uploadData.append('coordinates_lat', place.center[1]);
    uploadData.append('description', description);

    try {
      await api.createLibrary(uploadData);
      setMessage(`Your library '${name}' has been created`);
      navigate('/profile');
      setTimeout(() => {
        setMessage(null);
      }, 2000);
    } catch (err) {
      setMessage(err.toString());
    }
  };

  return (
    <div className="AddLibrary">
      <div className="container">
        <h2>Add Library</h2>
        <Form>
          <FormGroup>
            <Label for="name">Name</Label>
            <Input type="text" value={name} name="name" onChange={handleInputChange} />
          </FormGroup>
          <FormGroup>
            <Label for="picture">Picture</Label>
            <Input type="file" id="exampleCustomFileBrowser" name="picture" onChange={handleFileChange} />
          </FormGroup>
          <FormGroup>
            <Label for="address">Address</Label>
            <AutocompletePlace onSelect={handleSelect} />
          </FormGroup>
          <FormGroup>
            <Label for="description">Description</Label>
            <Input
              type="textarea"
              value={description}
              name="description"
              cols="20"
              rows="5"
              onChange={handleInputChange}
            />
          </FormGroup>
          <Button color="primary" className="btn-yellow-fill" onClick={addLibraryAndRedirectToProfile}>
            Create Library
          </Button>
        </Form>
        {message && <div className="info">{message}</div>}
      </div>
    </div>
  );
};

export default AddLibrary;