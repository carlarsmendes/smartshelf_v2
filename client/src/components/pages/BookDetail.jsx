  
import React, { useState, useEffect } from "react";
import api from "../../api";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBook,faComment, faExclamationTriangle,faArrowLeft} from '@fortawesome/free-solid-svg-icons'
import {
  Alert,
  Card,
  CardImg,
  CardText,
  CardBody,
  CardTitle,
  CardSubtitle,
  Button
} from "reactstrap";
import Rating from '../Rating';
import AddReview from "./AddReview";

import { useParams } from 'react-router-dom';

const BookDetail = ({ props }) => {
  
  const[bookData, setBookData] = useState({
    title: "",
    author: "",
    genre: "",
    picture: "",
    description: "",
    rating: null,
    pages: null,
    language: "",
    _currentOwner: null,
    borrowedDate: null,
    comments: [],
    status: "",
    showReviewForm: false
  });

  const[userData, setUserData] = useState({
    username: "",
    email: "",
    favoriteBooks: "",
    favoriteQuote: "",
    password: "",
    picture: "",
    _id: null
  });

  const response = {
    book : bookData,
    user: userData
  }

  const [message, setMessage] = useState(null);
  const { bookId } = useParams();
   
//TODO: Add error handling
  const borrowBook = (event) => {
    event.preventDefault();
    api
      .updateBook(bookId, {
        title: bookData.title,
        author: bookData.author,
        genre: bookData.genre,
        picture: bookData.picture,
        description: bookData.description,
        rating: bookData.rating,
        pages: bookData.pages,
        language: bookData.language,
        _currentOwner: this.state.user._id,
        borrowedDate: Date.now(),
        comments: bookData.comments,
        status: "Unavailable",
        showReviewForm: false
      })
      .then(result => {
        setBookData(result.response);
        setMessage(`You borrowed '${bookData.title}'. You have ${untilDueDate()} days to give it back`);
      });
  };

  //TODO: Fix calculation of due date
  const calculateDueDate = () => {
    if(bookData)
      {
    let borrowedDate = bookData.borrowedDate ;
    let deadlineDays = 30 ;
      var result = new Date(borrowedDate);
      result.setDate(result.getDate() + deadlineDays);
          return result;} 
          else { return 0; }
  };

  const untilDueDate = () => { //currentDate as parameter?
    if(bookData)
      {
     let dueDate = calculateDueDate();
     let currentDate = Date.now();
     var oneDay = 1000 * 60 * 60 * 24;

     let dueDateMS = dueDate.getTime();
     let currentDateMS = currentDate;

     let diffMS = Math.abs(currentDateMS-dueDateMS);

     return Math.round(diffMS/oneDay)
      } else {return 0}
  };

  const renderReviewForm  = () => {
    setBookData({
      showReviewForm: !bookData.showReviewForm
    }); 
  };

  const handleAddReview = () => {
    this.useEffect();
  };

  useEffect ( () => {
      api
        .getBook(bookId)
        .then(response => {
          const bookRes = response.response;
          const userRes = response.user;
          setBookData({ 
            title: bookRes.title,
            author: bookRes.author,
            genre: bookRes.genre,
            picture: bookRes.picture,
            description: bookRes.description,
            rating: bookRes.rating,
            pages: bookRes.pages,
            language: bookRes.language,
            _currentOwner: userData._id,
            comments: bookRes.comments,
            status: bookRes.status,
            showReviewForm: false,
            borrowedDate: bookRes.borrowedDate,
          })
          setUserData({
            username: userRes.username,
            email: userRes.email,
            favoriteBooks: userRes.favoriteBooks,
            favoriteQuote: userRes.favoriteQuote,
            password: userRes.password,
            picture: userRes.picture
          });
          window.scrollTo(0, 0);
        })
        .catch(err => console.log(err));
  }, [bookId, setBookData,userData._id]  );

  // ----------------------
    return (
      <div className="BookDetail">
        {!bookData && <div>Loading...</div>}
        {bookData && (
          <div className="bookCard">
            <Card>
            <CardBody>
           
                  <CardImg
                    body
                    src={bookData.picture}
                    alt="Card image cap"
                    style={{width:'100px',objectFit:'cover',marginBottom:'10px'}}
                  />
                
                  <CardTitle className="text-center" tag="h4">
                    <strong>{bookData.title}</strong>
                  </CardTitle>
                  <CardSubtitle  className="text-center" tag="h6"><i>by {bookData.author}</i></CardSubtitle>
                  <CardText className="text-center">
                    
                    <strong>Rating: </strong>
                    {bookData.rating}/5
                    <br />
                    <strong>Pages: </strong>
                    {bookData.pages}
                    <br />
                    <strong>ISBN: </strong>
                    {bookData.isbn}
                    <br />
                    <strong>Genre: </strong>
                    {bookData.genre}
                    
                  </CardText>
                   
                  {bookData.description}
                  <br />
                  {bookData.status === "Available" && (
                    <Button
                      onClick={e => borrowBook(e)}
                      outline
                      className="btn-yellow-fill"
                    >
                      <FontAwesomeIcon icon={faBook} size="1x" className="icon"/>{' '}borrow this book
                    </Button>
                  )}
                  {bookData.status === "Unavailable" && 
                        <div><br /><Alert color="warning" >This book is not available at the moment - it has been borrowed.</Alert></div> }
                  <br />
                  <Button onClick={renderReviewForm}
                 className="btn-yellow-outline">
                  <FontAwesomeIcon icon={faComment} size="1x" className="icon"/>{' '}add a review</Button>
                  {bookData.showReviewForm && 
                  <AddReview onToggle={renderReviewForm} theInfo={response} onAddReview={() => handleAddReview()} />}
                  <Button href={`/report-problem/${bookData._library}`} className="btn-problem" size="sm"
                  >
                  <FontAwesomeIcon icon={faExclamationTriangle} size="1x" className="icon"/>{' '}Report a problem
                  </Button>
                  
                  <Button href={`/profile`} className="btn-yellow-fill">
                  <FontAwesomeIcon icon={faArrowLeft} size="1x" className="icon"/>{' '}Go Back
                  </Button><br />
                  {message && (
                    <div className="info">{message}</div>
                  )}
                </CardBody>
            </Card>
            <br />
            <Card className="reviewContainer">
              <CardBody>
              <CardTitle tag="h4">Reviews</CardTitle>
                    {bookData.comments && bookData.comments.length === 0 && <div>There are no reviews yet. <br/> Be the first to write one!</div>}
                    {bookData.comments && bookData.comments.map(comment => <li key={comment._id}>
                      <Card>
                      <CardBody>
                      <CardTitle><Rating>{comment.rating}</Rating>{' '}<strong>"{comment.title}"</strong></CardTitle>
                      <CardSubtitle><strong>Author:</strong> {comment.author[0].toUpperCase() + comment.author.substr(1)}</CardSubtitle>
                      <CardText><strong>Review:</strong> {comment.text}<br/>    
                        </CardText>
                        </CardBody>
                        </Card>
                      </li> )}
               
                </CardBody>
            </Card>
          </div>
        )}
      </div>
    );
};

export default BookDetail;