import React, { useState, useEffect } from "react";
import { Button, Input, Modal, ModalHeader, ModalBody, Form, FormGroup, Label } from "reactstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons'

import api from "../../api";
import axios from "axios";

import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const AddBook = ({ props }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("");
  const [picture, setPicture] = useState(null);
  const [pictureUrl, setpictureUrl] = useState(null);
  const [description, setDescription] = useState("");
  const [rating, setRating] = useState("");
  const [pages, setPages] = useState("");
  const [isbn, setIsbn] = useState("");
  const [language, setLanguage] = useState("");
  const [message, setMessage] = useState(null);
  const [isbnMessage, setIsbnMessage] = useState(null);
  const [modal, setModal] = useState(false);

  const { libraryId } = useParams();
  const navigate = useNavigate();


  const toggle = () => {
    setModal(() => ({
      modal: !modal
    }));
  }

  const handleInputChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  const handleFileChange = (e) => {
    this.setState({
      picture: e.target.files[0]
    });
  }

  const getInfoFromApi = (e) => {
    e.preventDefault();
    axios
      .get(
        `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`
      )
      .then(response => {
        const data = response.data.items[0].volumeInfo;
        this.setState({
          title: data.title,
          author: data.authors[0],
          genre: data.categories
            ? data.categories[0]
            : '',
          picture: data.imageLinks
            ? data.imageLinks.thumbnail
            : '/images/book-cover-placeholder.jpg',
          description: data.description ? data.description : '',
          rating: data.averageRating ? data.averageRating : '',
          pages: data.pageCount ? data.pageCount : '',
          language: data.language ? data.language : '',
          isbn:
            data.industryIdentifiers ? data.industryIdentifiers[1].identifier : '',
          isbn_message: `Your book's name is ${
            data.title
          }. If this information is wrong, fill in the form below with the correct information`,
          _library: `ObjectId(${libraryId})`
        });
      })
      .catch(err => {
        console.log(err)
        this.setState({
          isbnMessage:
            `We do not have this book in our database. Please fill the form`
        })}
      );
    // ).catch(err => this.setState({ message: err.toString() }))
  }

  const addBookAndRedirectToLibraryPage = (e) => {
    const uploadData = new FormData();
    uploadData.append("title", title);
    uploadData.append("author", author);
    uploadData.append("picture", picture);
    uploadData.append("genre", genre);
    uploadData.append("description", description);
    uploadData.append("rating", rating);
    uploadData.append("pages", pages);
    uploadData.append("language", language);
    uploadData.append("isbn", isbn);
    uploadData.append("_library", libraryId);
    
    api
      .addBookWithForm(uploadData)
      .then(result => {
        setTitle(result.title);
        setPicture(result.picture);
        setGenre(result.genre);
        setDescription(result.description);
        setRating(result.rating);
        setPages(result.pages);
        setLanguage(result.language);
        setIsbn(result.isbn);
        setMessage();
        setMessage({
          message: `Your book '${title}' has been created`
        });

        setTimeout(() => {
          setMessage({
            message: null
          });
         // this.props.history.push("/libraries/"+this.props.match.params.libraryId);
          navigate("/libraries/"+libraryId);
        }, 2000);
      })
      .catch(err => setMessage({ message: err.toString() }));
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
              <Label for='number'>ISBN{' '}<FontAwesomeIcon onClick={toggle} icon={faQuestionCircle} size="1.5x" className="icon" style={{cursor: 'pointer'}} />
              <Modal
                isOpen={modal}
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
                value={isbn}
                name="isbn"
                onChange={handleInputChange}
              />
              </FormGroup>
              <Button className="btn-yellow-fill" onClick={e => getInfoFromApi(e)}>
                Check your book's info
              </Button>{" "}
              <br />
            </Form>
            
            {isbnMessage && (
              <div className="info">{isbnMessage}</div>
            )}
            <br />

            <br />
            <h3>Or fill the form manually. Don't worry, it's quite short!</h3>
            <Form>
            <FormGroup>
              <Label for="title">Title</Label>
              <Input
                type="text"
                value={title}
                name="title"
                onChange={handleInputChange}
              />
              </FormGroup>
              <FormGroup>
              <Label for="author">Author</Label>
              <Input
                type="text"
                value={author}
                name="author"
                onChange={handleInputChange}
              />
              </FormGroup>
              <FormGroup>
              <Label for="genre">Genre</Label>
              <Input
                type="text"
                value={genre}
                name="genre"
                onChange={handleInputChange}
              />
              </FormGroup>
              <FormGroup>
              <Label for="">Picture</Label>
              <img src={picture} alt={`${title}-cover`} />
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
                value={rating}
                name="rating"
                onChange={handleInputChange}
              />
              </FormGroup>
              <FormGroup>
              <Label for="pages">Pages</Label>
              <Input
                type="number"
                value={pages}
                name="pages"
                onChange={handleInputChange}
              /></FormGroup>
              <FormGroup>
              <Label for="language">Language</Label>
              <Input
                type="text"
                value={language}
                name="language"
                onChange={handleInputChange}
              />
              </FormGroup>
              <FormGroup>
              <Label for="isbn">ISBN</Label>
              <Input
                type="number"
                value={isbn}
                name="isbn"
                onChange={handleInputChange}
              />
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
              <Button
                 className="btn-yellow-fill"
                onClick={e => addBookAndRedirectToLibraryPage(e)}
              > Create Book
              </Button>
            </Form>
            {message && (
              <div className="info">{message}</div>
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
