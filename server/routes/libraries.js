const express = require('express');
const router = express.Router();
const Library = require("../models/Library")
const Member = require("../models/Member")
const uploader = require("../configs/cloudinary")

// when testing use http://localhost:5000/api/libraries

// ------------ Get library details by Id --- Library Homepage / 
router.get("/:libraryId", (req, res, next) => {
  Library.findById(req.params.libraryId)
  .then(response => {
    res.json(response);
  })
  .catch(err => next(err))
});

// ---------Update Libraries ------------

router.put("/:libraryId", (req, res, next) => {
  Library.findOneAndUpdate(req.params.id,{
    name: req.body.name,
    picture: req.file && req.file.url,  
    address: req.body.address,
  })
  .then(response => {
    res.json(response);
  })
  .catch(err => next(err))
});

//---------------- Delete libraries --------------   
router.delete('/:libraryId', (req, res, next) => {
  Member.find({_library: req.params.id})
  .then
  Library.findOneAndRemove(req.params.libraryId)
  .then(() => {
    res.json({
      message: "Library was deleted"
    });
  })
  .catch(err => next(err))
});

// ------------------ Create Library ---------------------
// uploader.single('picture') is a middleware, that takes from the request the field "picture" (must be a file), save it to cloudinary, save the info in req.file and go to the next middleware
router.post('/', uploader.single('picture'), (req, res, next) => {
  Library.create({
    name: req.body.name,
    picture: req.file && req.file.secure_url,  
    address: req.body.address,
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
// Route to display books 
router.get("library-books/:libraryId", (req, res, next) => {
  Books.find({
    _library: req.params.id
  })
  .then(response => {
    res.json(response);
  })
  .catch(err => next(err))
});




// router.get("/library-books/:libraryId", (req,res,next) => {
//   Library.findById(req.params.libraryId)
//   .then(response => {
//     res.json(response);
//   })
//   .catch(err => next(err))
// });


module.exports = router;
