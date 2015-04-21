var express = require('express'),
    router = express.Router(),
    xssFilters = require('xss-filters');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json('index', { title: 'Contact the Council' });
});

/* GET Enquiry list page. */
router.get('/enquirylist', function(req, res) {
    var db = req.db;    
    db.collection('formcollection').find().toArray(function (err, items) {
      if (!err) {  
        res.json(items);
      }
      else {
        console.log(err);
      }
    });
});

/* GET New Enquiry page. */
router.get('/newenquiry', function(req, res) {
    res.render('newenquiry', { title: 'Send us an enquiry' });
});

/* POST to Add Enquiry Service */ 
router.post('/addenquiry', function(req, res) {

    // Set our internal DB variable
    var db = req.db;
  
    // Get our form values. These rely on the "name" attributes
    var name = xssFilters.inHTMLData(req.body.name);
    var email = req.body.email;
    var enquiry = xssFilters.inHTMLData(req.body.enquiry);

    // Validate the form data
    req.assert('name', 'Name is required').notEmpty();
    req.assert('email', 'A valid email address is required').isEmail();
    req.assert('enquiry', 'Please tell us what your enquiry is').notEmpty();

    var errors = req.validationErrors();     

    // Submit to the DB
    db.collection('formcollection').insert({
        "name" : name,
        "email" : email,
        "enquiry": enquiry
    }, function (err, doc) {
           if (err) {
               res.send("There was a problem adding the information to the database.");
           }
           else {
               res.location("enquirylist");
               res.redirect("enquirylist");
           }
    });

  });

module.exports = router;

