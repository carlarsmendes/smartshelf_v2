const express = require('express');
const router = express.Router();
const Library = require("../models/Library")
const Member = require("../models/Member")
const Book = require("../models/Book")

const uploader = require("../configs/cloudinary")
const { isLoggedIn } = require('../middlewares')

// when testing use http://localhost:5000/api/libraries

// ------------ Get library details by Id --- Library Homepage / 
// TODO: send an object with the library and the books (and delete the route GET "library-books/:libraryId")
router.get("/:libraryId", (req, res, next) => {
  Promise.all([
    Library.findById(req.params.libraryId),
    Book.find({ _library: req.params.libraryId })
  ])
  .then(([library, book]) => {
    res.json({
      library, 
      book
    });
  })
  .catch(err => next(err))
});

// ---------Update Libraries ------------
router.put("/:libraryId", isLoggedIn, uploader.single('picture'), (req, res, next) => {
  const { name, address, description } = req.body;
  const coordinates = [req.body.coordinates_lng, req.body.coordinates_lat]

  

  let updatedData = {
    name,
    address,
    description,
    coordinates
  };
  if (req.file) updatedData.picture = req.file.secure_url;

  Library.findOneAndUpdate({_id: req.params.libraryId},updatedData, { new: true })
  .then(response => {
    res.json(response);
  })
  .catch(err => next(err))
});
  
// -------- GET all libraries to display on the map
router.get("/", (req, res, next) => {
  Library.find()
  .then(response => {
    res.json({
      response
    });
  })
  .catch(err => next(err))
});
// ------------------

//---------------- Delete libraries --------------   
router.delete('/:libraryId', isLoggedIn, (req, res, next) => {
  Member.findOne({_library: req.params.libraryId, _user: req.user._id })
  .then(member => {
    if (!member) {
      next({
        status: 400,
        message: "There is no library with the specified id or you are not a member of this library"
      })
    }
    else if(member.role === "admin"){
      Promise.all([
        Library.findByIdAndDelete(req.params.libraryId),
        Member.deleteMany({ _library: req.params.libraryId })
      ])
      .then(([library, deleteResult]) => {
        res.json({
          library,
          message: `The library was deleted with its ${deleteResult.deletedCount} member(s)!` 
        });
        console.log("res.json-->",res.json());
      })
    }
    else {
      next({
        status: 403,
        message: "You are not allowed to delete this library"
      })
    }
    
  })
  .catch(err => next(err))
});

// ------------------ Create Library ---------------------
// uploader.single('picture') is a middleware, that takes from the request the field "picture" (must be a file), save it to cloudinary, save the info in req.file and go to the next middleware
router.post('/', isLoggedIn, uploader.single('picture'), (req, res, next) => {
  Library.create({
    name: req.body.name,
    picture: req.file && req.file.secure_url,  
    address: req.body.address,
    coordinates: [req.body.coordinates_lng, req.body.coordinates_lat],
    description: req.body.description,
  })
    .then(libraryCreated => {
        Member.create({
            role:'admin',
            _user: req.user._id,
            _library: libraryCreated._id
          })
          .then(memberCreated => {
            res.json({
              message: `Member ${memberCreated._user} and Library ${libraryCreated._id}  created!`,
              memberCreated,libraryCreated
            });
          }).catch(err => next(err))
    })
  })
//--------------------------------------------------



module.exports = router;
