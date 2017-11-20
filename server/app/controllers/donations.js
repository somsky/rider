'use strict';

/* database schemes */
const Donation = require('../models/donation');
const User = require('../models/user');
const Candidate = require('../models/candidate');
const Joi = require('joi');

/* validation */
const donationValidScheme = {
  amount: Joi.number().required(),
  method: Joi.string().required(),
  candidate: Joi.string().required(),
}

/* exports */
exports.home = {

    handler: function (request, reply) {
      Candidate.find({}).then(candidates => {
        reply.view('home', {
          title: 'Make a Donation',
          candidates: candidates,
        });
      }).catch(err => {
        reply.redirect('/');
      });
    },

  };

exports.donate = {

  validate: {
    payload: donationValidScheme,
    failAction: function (request, reply, source, error) {
      Candidate.find({}).then(candidates => {
        reply.view('home', {
          title: 'Make a Donation',
          candidates: candidates,
          errors: error.data.details,
        }).code(400);
      }).catch(err => {
        reply.redirect('/');
      });
    },
  },

  handler: function (request, reply) {
    var userEmail = request.auth.credentials.loggedInUser;
    User.findOne({ email: userEmail }).then(user => {
      let data = request.payload;
      const donation = new Donation(data);
      const rawCandidate = request.payload.candidate.split(',');
      Candidate.findOne({
        lastName: rawCandidate[0],
        firstName: rawCandidate[1],
      }).then(candidate => {
        donation.donor = user._id;
        donation.candidate = candidate._id;
        donation.save().then(newDonation => {
          reply.redirect('/report');
        });
      }).catch(err => {
        reply.redirect('/');
      });
    }).catch(err => {
      reply.redirect('/');
    });
  },

};

exports.report = {

  handler: function (request, reply) {
    Donation.find({}).populate('donor').populate('candidate').then(allDonations => {
      let totalAmount = allDonations.map(don => don.amount).reduce((pv, cv) => pv+cv, 0);
      let totalDonation = new Donation();
      totalDonation.amount = totalAmount;
      totalDonation.method = 'total';
      allDonations.push(totalDonation);
      reply.view('report', {
        title: 'Donations to Date',
        donations: allDonations,
        sum: totalAmount,
      });
    }).catch(err => {
      console.log(err);
      reply.redirect('/');
    });
  },

};

exports.register = {

    handler: function (request, reply) {
      reply.redirect('/home');
    },

  };
