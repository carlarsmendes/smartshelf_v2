import React, { Component } from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import LibraryDetail from './pages/LibraryDetail.js';
import LibraryBooks from './pages/LibraryBooks.jsx';
import AddLibrary from './pages/AddLibrary.jsx';
import AddBook from './pages/AddBook.jsx';
import BookDetail from './pages/BookDetail';
import NavBar from './NavBar';
import Footer from './Footer';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Map from './pages/Map.js';
import api from '../api';
import Profile from './pages/Profile';
import ReportProblem from './pages/ReportProblem';
import SendInvitation from './pages/SendInvitation';
import AddReview from './pages/AddReview';

export default class App extends Component {

  handleLogoutClick(e) {
    api.logout()
  }
  render() {
    return (
      <div className="App">
      <NavBar className="NavBar"/>
      <div className="main">
      
        <Routes>
          
          <Route path="/" exact element={<Home />} />
          {api.isLoggedIn() ? <Route path="/profile" element={<Profile />} /> : <Route path="/profile" element={<Login />} />}
          
          {api.isLoggedIn() ? <Route path="/add-library" element={<AddLibrary />} /> : <Route path="/add-library" element={<Login/>} />}
          <Route path="/libraries/:libraryId" element={<LibraryDetail/>} />
          {api.isLoggedIn() ? <Route path="/:libraryId/books" element={<LibraryBooks/>} /> : <Route path="/:libraryId/books" element={<Login/>} />}
          {api.isLoggedIn() ? <Route path="/:libraryId/add-book" element={<AddBook/>} /> : <Route path="/:libraryId/add-book" element={<Login/>} />}
          {api.isLoggedIn() ? <Route path="/book-detail/:bookId" exact element={<BookDetail/>} />: <Route path="/book-detail/:bookId" exact element={<Login/>} />}
          {api.isLoggedIn() ? <Route path="/book-detail/:bookId/add-review" element={<AddReview/>}/> : <Route path="/book-detail/:bookId/add-review" element={<Login/>} />}
          <Route path="/signup" element={<Signup/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/find-libraries" element={<Map/>} />
          {api.isLoggedIn() ? <Route path="/report-problem/:libraryId" element={<ReportProblem/>}/> : <Route path="/report-problem/:libraryId" element={<Login/>} />}
          {api.isLoggedIn() ? <Route path="/send-invitation/:libraryId" element={<SendInvitation/>}/> : <Route path="/send-invitation/:libraryId" element={<Login/>}/>}
          

          <Route render={() => <h2>404</h2>} />
        </Routes>
        </div>
        <Footer />
      </div>
    );
  }
}