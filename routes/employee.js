'use strict';

const express = require('express');
const router = express.Router();
const uuidv4 = require('uuid/v4');
const _ = require('lodash');
const moment = require('moment');

const { body, validationResult } = require('express-validator');

const DATABASE = {};

const ROLES = ['CEO','VP','MANAGER','LACKEY'];

const createValidationRules = [
  body('firstName').exists({checkFalsy:true}).withMessage('First Name is required').isAlpha().withMessage('First Name must be string'),
  body('lastName').exists({checkFalsy:true}).withMessage('Last Name is required').isAlpha().withMessage('Last Name must be string'),
  body('hireDate').exists({checkFalsy:true}).withMessage('Hire Date is required').custom(function(date) {
    let m = moment(date, 'YYYY-MM-DD',true);
    if(!m.isValid()) {
      return (m.invalidAt() > 0) 
        ? Promise.reject("Date is invalid")
        : Promise.reject("Hire date must be in format YYYY-MM-DD")
    }
    return true;
  }).isBefore().withMessage("Hire date cannot be in the future"),
  body('role').customSanitizer(function(role) { return role ? role.toUpperCase() : '';}).isIn(ROLES).withMessage('Role must be either '+ROLES.join(','))
];

const updateValidationRules = [
  body('firstName').optional().isAlpha().withMessage('First Name must be string'),
  body('lastName').optional().isAlpha().withMessage('Last Name must be string'),
  body('hireDate').optional().custom(function(date) {
    let m = moment(date, 'YYYY-MM-DD',true);
    if(!m.isValid()) {
      return (m.invalidAt() > 0) 
        ? Promise.reject("Date is invalid")
        : Promise.reject("Hire date must be in format YYYY-MM-DD")
    }
    return true;
  }).isBefore().withMessage('Hire date cannot be in the future'),
  body('role').customSanitizer(function(role){return role ? role.toUpperCase() : '';}).optional().isIn(ROLES).withMessage('Role must be either '+ROLES.join(','))
];

/* GET employees listing. */
router.get('', function(req, res) {
  return res.send(_.values(DATABASE));
});

/* GET - Return the record corresponding to the id parameter */
router.get('/:id', function(req, res) {
  return res.send(DATABASE[req.params.id]);
});

/* POST - Create new employee record */
router.post('', createValidationRules,
function(req,res) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors:  _.map(_.groupBy(errors.array(), 'param'), function(err) {
          return err[0];
      }) 
    })
  }
  if(req.body) {
    let record = req.body;
    record._id = uuidv4();
    DATABASE[record._id] = record;
    res.status(201).send(record);
  } else {
    res.status(400).send('Cannot create: Invalid data');
  }

});

/* PUT - Replace the record corresponding to :id with the contents of the PUT body */
router.put('/:id', updateValidationRules, function(req,res) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() })
  }
  let record = DATABASE[req.params.id];
  if(record){
    if(req.body.role){
      req.body.role = _.toUpper(req.body.role);
    }
    _.merge(record,req.body);
    res.status(200).send(record);
  } else {
    res.status(404).send("No record found");
  }
});

/* DELETE - delete the record corresponding to the id parameter */
router.delete('/:id', function(req,res) {
  let record = DATABASE[req.params.id];
  if(record){
    delete DATABASE[req.params.id];  
    res.status(200).send(record);
  } else {
    res.status(404).send("No record found");
  }
});


module.exports = {router, DATABASE};
