import React, { useState, useEffect } from "react";
import { Button, Input, Modal, ModalHeader, ModalBody, Form, FormGroup, Label } from "reactstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons'

import api from "../../api";
import axios from "axios";

import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const AddBook = ({ props }) => {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    genre: "",
    picture: null,
    //pictureUrl: null,
    description: "",
    rating: 1,
    pages: 0,
    isbn: "",
    language: "",
    message: null,
    isbnMessage: null,
    modal: false,
  });

  const { libraryId } = useParams();
  const navigate = useNavigate();


  const toggle = () => {
    this.setState({ modal: !this.state.modal });
  }

  const handleInputChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
      // TODO: Perform some validation here, e.g., check file type or size
  
    setFormData((prevData) => ({
      ...prevData,
      picture: selectedFile,
    }));
  };

  const getInfoFromApi = (e) => {
    e.preventDefault();
    
    return new Promise((resolve, reject) => {

    axios
      .get(
        `https://www.googleapis.com/books/v1/volumes?q=isbn:${formData.isbn}`
      )
      .then(response => {
        const data = response.data.items[0].volumeInfo;
        resolve({
          title: data.title,
          author: data.authors ? data.authors[0] : '',
          genre: data.categories ? data.categories[0] : '',
          picture: data.imageLinks ? data.imageLinks.thumbnail : null,
          description: data.description ? data.description : '',
          rating: data.averageRating ? data.averageRating : '',
          pages: data.pageCount ? data.pageCount : '',
          language: data.language ? data.language : '',
          isbn: data.industryIdentifiers ? data.industryIdentifiers[1].identifier : '',
          isbnMessage: `Your book's name is ${data.title}. If this information is wrong, fill in the form below with the correct information`,
          _library: `ObjectId(${libraryId})`,
        });
      })
      .catch(err => {
        console.error(err); // Log the error for debugging purposes
        setFormData((prevData) => ({
          ...prevData,
          isbnMessage: `We do not have this book in our database. Please fill the form`,
        }));
      });
    });
    // ).catch(err => this.setState({ message: err.toString() }))
  }

  const addBookAndRedirectToLibraryPage = (e) => {
    e.preventDefault();
    console.log("current form data-->", formData);
    const uploadData = new FormData();
    // Append form data to uploadData object
    uploadData.append("title", formData.title);
    uploadData.append("author", formData.author);
    uploadData.append("picture", formData.picture); // Assuming picture is updated by handleFileChange
    uploadData.append("genre", formData.genre);
    uploadData.append("description", formData.description);
    uploadData.append("rating", formData.rating);
    uploadData.append("pages", formData.pages);
    uploadData.append("language", formData.language);
    uploadData.append("isbn", formData.isbn);
    uploadData.append("_library", libraryId);
    
    console.log(" form data to upload-->", uploadData);
    api
      .addBookWithForm(uploadData)
      .then(result => {
        setFormData((prevData) => ({
          ...prevData,
          title: result.title,
          picture: result.picture,
          genre: result.genre,
          description: result.description,
          rating: result.rating,
          pages: result.pages,
          language: result.language,
          isbn: result.isbn,
        }));

        setTimeout(() => {
          
          setFormData(() => ({
            isbnMessage: null,
          }));
         // this.props.history.push("/libraries/"+this.props.match.params.libraryId);
          navigate("/libraries/"+libraryId);
        }, 2000);
      })
      .catch(err => 
        setFormData(() => ({
          isbnMessage: err.toString()
        }))
      );
  }

  useEffect(()=>{
    window.scrollTo(0, 0);
  }, []);

  
    return (
      <div className="AddBook">
      <div className="container">
        {!libraryId && (
          <div>Loading... This is probably not a valid Library! </div>
        )}
        {libraryId && (
          <div className="AddBook">
            <h2>Add Book</h2>
            <h3>Use ISBN to help us find the information about your book</h3>

            <Form>
              <FormGroup>
              <Label for='number'>ISBN{' '}<FontAwesomeIcon onClick={toggle} icon={faQuestionCircle} size="1x" className="icon" style={{cursor: 'pointer'}} />
              <Modal
                isOpen={formData.modal}
                toggle={toggle}
              >
                <ModalHeader toggle={toggle}>What is ISBN?</ModalHeader>
                <ModalBody className="modal-body">
                  <img
                    src="../../../images/isbn-location.png"
                    alt="isbn-location"
                  />
                  <br />
                  An ISBN gets placed on the copyright page inside the book and,
                  if there is no bar code, on the back cover.
                  <br />
                  It can have 10 or 13 digits.
                </ModalBody>
              </Modal></Label>
              <Input
                type="number"
                value={formData.isbn}
                name="isbn"
                onChange={handleInputChange}
              />
              </FormGroup>
              <Button className="btn-yellow-fill" onClick={e => getInfoFromApi(e)}>
                Check your book's info
              </Button>{" "}
              <br />
            </Form>
            
            {formData.isbnMessage && (
              <div className="info">{formData.isbnMessage}</div>
            )}
            <br />

            <br />
            <h3>Or fill the form manually. Don't worry, it's quite short!</h3>
            <Form>
            <FormGroup>
              <Label for="title">Title</Label>
              <Input
                type="text"
                value={formData.title}
                name="title"
                onChange={handleInputChange}
              />
              </FormGroup>
              <FormGroup>
              <Label for="author">Author</Label>
              <Input
                type="text"
                value={formData.author}
                name="author"
                onChange={handleInputChange}
              />
              </FormGroup>
              <FormGroup>
              <Label for="genre">Genre</Label>
              <Input
                type="text"
                value={formData.genre}
                name="genre"
                onChange={handleInputChange}
              />
              </FormGroup>
              <FormGroup>
              <Label for="">Picture</Label>
              <img src={formData.picture} alt={`${formData.title}-cover`} />
              <Input
                type="file"
                id="exampleCustomFileBrowser"
                name="picture"
                onChange={handleFileChange}
              />
              </FormGroup>
              <FormGroup>
              <Label for="rating">Rating</Label>
              <Input
                type="number"
                value={formData.rating}
                name="rating"
                onChange={handleInputChange}
              />
              </FormGroup>
              <FormGroup>
              <Label for="pages">Pages</Label>
              <Input
                type="number"
                value={formData.pages}
                name="pages"
                onChange={handleInputChange}
              /></FormGroup>
              <FormGroup>
              <Label for="language">Language</Label>
              <Input
                type="text"
                value={formData.language}
                name="language"
                onChange={handleInputChange}
              />
              </FormGroup>
              <FormGroup>
              <Label for="isbn">ISBN</Label>
              <Input
                type="number"
                value={formData.isbn}
                name="isbn"
                onChange={handleInputChange}
              />
              </FormGroup>
              <FormGroup>
              <Label for="description">Description</Label>
              <Input
                type="textarea"
                value={formData.description}
                name="description"
                cols="20"
                rows="5"
                onChange={handleInputChange}
              />
              </FormGroup>
              <Button
                 className="btn-yellow-fill"
                onClick={e => addBookAndRedirectToLibraryPage(e)}
              > Create Book
              </Button>
            </Form>
            {formData.message && (
              <div className="info">{formData.message}</div>
            )}
            <Button
               className="btn-yellow-fill"
              href={`/libraries/${libraryId}`}
            >Go Back
            </Button>
          </div>
        )}
        </div>
      </div>
    );
  }

  

export default AddBook;
