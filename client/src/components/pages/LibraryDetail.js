import React, { useState, useEffect } from 'react';
import api from "../../api";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash,faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons'
import {
  Card,
  CardImg,
  CardText,
  CardBody,
  CardTitle,
  CardSubtitle,
  Button,
  Row,
  Col,
  Container,
  Alert
} from "reactstrap";
import { NavLink as Nlink } from "react-router-dom";
import { useLocation } from 'react-router-dom'; // Import useLocation hook
import { useParams } from 'react-router-dom';
import EditLibrary from "../EditLibrary.js";
import DeleteMember from "../DeleteMember";


const LibraryDetail = ({ history }) => {
  const [library, setLibrary] = useState(null);
  const [book, setBook] = useState(null);
  const [member, setMember] = useState(null);
  const [allmembers, setAllMembers] = useState(null);
  const [profileInfo, setProfileInfo] = useState(null);
  const [showAlertLeaveLibrary, setShowAlertLeaveLibrary] = useState(false);
  const [showAlertDeleteLibrary, setShowAlertDeleteLibrary] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null); // State variable for error message

  const location = useLocation(); // Get location object to check for match
  const [isLoading, setIsLoading] = useState(true);
  const { libraryId } = useParams(); // Destructure libraryId from useParams


      const toggleAlertLeaveLibrary = () => {
        setShowAlertLeaveLibrary(!showAlertLeaveLibrary);
      };

      const toggleAlertDeleteLibrary = () => {
        setShowAlertDeleteLibrary(!showAlertDeleteLibrary);
      };


// ---------- METHOD TO THE USER BECOME A MEMBER OF THE LIBRARY
const joinLibrary = (event) => {
  event.preventDefault();
  api
    .createMember(libraryId)
    .then(result => {
      setMember(result);
      setTimeout(() => setMember(null), 2000); // Assuming message display time is 2 seconds
    })
    .catch(err => console.error(err));
};

const updateLibrary = () => {
  api
    .getLibrary(libraryId)
    .then(response => {
      setLibrary(response.library);
    })
    .catch(err => console.log(err));
};

const leaveLibrary = () => {
  api.deleteMember(member._id, libraryId)
    .then(() =>
      Promise.all([
        api.getLibrary(libraryId),
        api.getMember(libraryId)
      ])
    )
    .then(([response, memberInfo]) => {
      setLibrary(response.library);
      setBook(response.book);
      setMember(memberInfo[0]);
      toggleAlertLeaveLibrary();
    })
    .catch(err => console.error(err));
};

const deleteLibrary = () => {
  api.deleteLibrary(libraryId)
    .then(() => history.push('/profile'))
    .catch(err => console.error(err));
};

const handleDeleteMember = (indexToRemove) => {
  setAllMembers(allmembers.filter((member, i) => i !== indexToRemove));
};

useEffect(() => {
  console.log("location.pathname",location.pathname);
  if (location.pathname.includes(`/libraries/`)) { //// Check for library route pattern
  const fetchData = async () => {
    try {
      const response = await api.getLibrary(libraryId);
      setLibrary(response.library);
      setBook(response.book);

      const [memberInfo, allmembersData, profileData] = await Promise.all([
        api.getMember(libraryId),
        api.getAllMember(libraryId),
        api.showProfile()
      ]);

      setMember(memberInfo[0]);
      setAllMembers(allmembersData);
      setProfileInfo(profileData);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'An error occurred while fetching library details.'); // Set user-friendly error message
    } finally {
      setIsLoading(false);
      window.scrollTo(0, 0);
    }
  };

  fetchData();
}
}, [location, libraryId]); // Dependency array to trigger effect on libraryId change

// ----------------------
  
    return (
      <div className="LibraryDetail">
      {errorMsg && <div className="info">{errorMsg}</div>} {/* Display error message if error exists */}
        {!library  && isLoading && <div>Loading...</div>}
        {library && 
        <div className="libraryCard">
        <img src={library.picture} alt="library-img" className="library-pic" />
          <Card>
            {/* <CardImg top width="100%" src={library.picture} alt="Card image cap" className="library-pic" /> */}
            <CardBody>
              <CardTitle><b>{library.name}</b></CardTitle>
              <CardSubtitle>
              <FontAwesomeIcon icon={faMapMarkerAlt} size="1x" className="icon"/>{' '}
              {library.address}</CardSubtitle>
              <CardText>{library.description}</CardText>

            {member && (
              <Button href={`/send-invitation/${library._id}`} className="send-invitation-btn">
                Send Invitation
              </Button>
            )}

              {member && member.role === "admin" && <Button onClick={toggleAlertDeleteLibrary} className="delete-libr-btn">
              <FontAwesomeIcon icon={faTrash} size="1x" className="icon"/>{' '}
                Delete Library</Button>}
              <Alert color="info" isOpen={showAlertDeleteLibrary} toggle={toggleAlertDeleteLibrary}>
                Are you sure you want to delete this library? <br />
                  <Button onClick={(e) => deleteLibrary(e)} className="send-invitation-btn">Delete!</Button>  
                  <Button onClick={toggleAlertDeleteLibrary} className="send-invitation-btn">No!</Button>     
                </Alert>
              
              {!member && <Button onClick={(e) => joinLibrary(e)} className="send-invitation-btn">Join</Button>}
              {member && member.role === "member" && <Button onClick={toggleAlertLeaveLibrary} className="delete-libr-btn">Leave</Button>}
              <Alert color="info" isOpen={showAlertLeaveLibrary} toggle={toggleAlertLeaveLibrary}>
              Are you sure you want to leave this library? <br />
                  <Button onClick={(e) => leaveLibrary(e)} className="delete-libr-btn">Leave!</Button>  
                  <Button onClick={toggleAlertLeaveLibrary} className="send-invitation-btn">Stay!</Button>     
                </Alert>

            </CardBody>
          
            {member && member.role === "admin" &&  
            <EditLibrary updateLibrary={updateLibrary} theLibrary={library} />}
          </Card>
        </div>
      }
        <h3>Library Books</h3>
        {!book && <div>Loading...</div>}
        
        {book && book.length > 0 ? 
        book.slice(0, 2).map((booksFromLibrary, i) => (
          <div key={booksFromLibrary._id}>
            <Card>
            <CardBody>
            <Container>
              <Row>
                <Col xs='4'>
                  <CardImg top width="100%" src={booksFromLibrary.picture} alt="Card image cap"
                  style={{maxWidth:'80px'}}/>
                </Col>
                <Col xs='8'>
                  <CardTitle className="text-left"><strong>{booksFromLibrary.title}</strong></CardTitle>
                  <CardSubtitle className="text-left">{booksFromLibrary.author}</CardSubtitle>
                  {/* <CardText className="small" style={{overflow:'auto'}}>{booksFromLibrary.description}</CardText> */}
                </Col>
                </Row>
                </Container>
                  <Button size="sm" tag={Nlink} to={`/book-detail/${booksFromLibrary._id}`} className="send-invitation-btn">
                    See details
                  </Button>
                </CardBody>
            </Card>
          </div>
        ))
        :
        <div className="NoBooks">
        <Card>
              <Col>
                <CardImg top width="100%" src="../../images/SadPup.jpg" alt="Card image cap" className="book-pic"
                />
              </Col>
              <Col>
                <CardBody>
                  <CardTitle>
                    There are currently no books at this library!
                  </CardTitle>
                </CardBody>
              </Col>
          </Card>
    </div>}
    
        {book && book.length > 0 && !isLoading && location.pathname.includes(`/libraries/`) &&
        <Button className="send-invitation-btn" outline color="info" size="sm" tag={Nlink} to={`/${libraryId}/books`}>
          {" "}
          See all Books
        </Button>}
        { location.pathname.includes(`/libraries/`) &&
        <Button className="send-invitation-btn" outline color="info" size="sm" tag={Nlink} to={`/${libraryId}/add-book`}>
          {" "}
          Add new Book
        </Button>}
        <div className="memberList">
        <h3>Members</h3>
        {allmembers && allmembers.map((members,i) => (<div key={members._id}>
             <Card>
             <CardBody>
              <Row>
                <Col xs="3">
                  <CardImg top width="100%" src={members._user.picture} alt="Card image cap" />
                </Col>
                <Col xs="9">
                  
                    <CardTitle><b>{members._user.username[0].toUpperCase()+members._user.username.substr(1)}</b></CardTitle>
                    <CardText className="small">"<i>{members._user.favoriteQuote}</i>"</CardText>
                    {/* <Button size="sm" tag={Nlink}to={`/profile/${members._user._id}`}  className="send-invitation-btn small">See details</Button> */}
                    {member && 
                    member.role === "admin" && 
                    members._user._id !== profileInfo.user._id &&                    
                      <DeleteMember onDelete={() => handleDeleteMember(i)} memberToBeDeletedId={members._id} theLibrary={library}/>}
                 
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </div>))}
        </div>
       
      </div>
    );
  };

  export default LibraryDetail;
  
