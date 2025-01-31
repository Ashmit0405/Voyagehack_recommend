import { Hospital } from "../model/hospital.model.js";
import { asyncHandler } from "../util/asyncHandler.js";
import mongoose from "mongoose";

const addHospital = asyncHandler(async (req, res) => {
  try {
    const rootUserId = new mongoose.Types.ObjectId(req.body.FirstRootUser);

    const rootUsers = [rootUserId];
    const participants = req.body.Participants || {
      RootUsers: rootUsers,
      Staff: [],
      Doctors: [],
    };

    const newHospital = new Hospital({
      ...req.body,
      Participants: participants,
      Reviews: [],
      PatientRating: 0,
    });

    const savedHospital = await newHospital.save();

    res.status(201).json({
      success: true,
      message: "Hospital added successfully",
      data: savedHospital,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error adding hospital",
      error: error.message,
    });
  }
});


const getHospital=asyncHandler(async(req,res)=>{
  const hospital=await Hospital.findById(req.params.hospitalId);
  if(hospital){
    res.json(hospital)
  }else{
    res.status(404)
    throw new Error('Hospital not found')
  }
});

const getAllHospitals = asyncHandler(async (req, res) => {
  const hospitals = await Hospital.find();

  res.status(200).json({
    success: true,
    message: "Hospitals fetched successfully",
    data: hospitals,
  });
});

const addRating = asyncHandler(async (req, res) => {
  const { hospitalId, rating } = req.body;

  if (!hospitalId || rating === undefined) {
    res.status(400);
    throw new Error("Hospital ID and rating are required");
  }

  const hospital = await Hospital.findById(hospitalId);
  if (!hospital) {
    res.status(404);
    throw new Error("Hospital not found");
  }

  hospital.Ratings.push(rating);

  const totalRatings = hospital.Ratings.reduce((sum, rate) => sum + rate, 0);
  const averageRating = totalRatings / hospital.Ratings.length;

  hospital.PatientRating = Math.round(averageRating);

  const updatedHospital = await hospital.save();

  res.status(200).json({
    success: true,
    message: "Rating added successfully",
    data: updatedHospital,
  });
});

const addReview = asyncHandler(async (req, res) => {
  const { hospitalId, review } = req.body;

  if (!hospitalId || !review) {
    res.status(400);
    throw new Error("Hospital ID and review are required");
  }

  const hospital = await Hospital.findById(hospitalId);
  if (!hospital) {
    res.status(404);
    throw new Error("Hospital not found");
  }

  hospital.Reviews.push(review);

  const updatedHospital = await hospital.save();

  res.status(200).json({
    success: true,
    message: "Review added successfully",
    data: updatedHospital,
  });
});

const editHospital = asyncHandler(async (req, res) => {
  const { hospitalId } = req.params;
  const updates = req.body;

  // Check if the hospital exists
  const hospital = await Hospital.findById(hospitalId);
  if (!hospital) {
    res.status(404);
    throw new Error("Hospital not found");
  }

  if (updates.Participants) {
    if (updates.Participants.RootUsers) {
      updates.Participants.RootUsers = updates.Participants.RootUsers.map(id => new mongoose.Types.ObjectId(id));
    }
    if (updates.Participants.Doctors) {
      updates.Participants.Doctors = updates.Participants.Doctors.map(id => new mongoose.Types.ObjectId(id));
    }
    if (updates.Participants.Patients) {
      updates.Participants.Patients = updates.Participants.Patients.map(id => new mongoose.Types.ObjectId(id));
    }
  }

  Object.assign(hospital, updates);
  const updatedHospital = await hospital.save();

  res.status(200).json({
    success: true,
    message: "Hospital details updated successfully",
    data: updatedHospital,
  });
});
const deleteHospital = asyncHandler(async (req, res) => {
  const { hospitalId } = req.params;

  const hospital = await Hospital.findByIdAndDelete(hospitalId);
  if (!hospital) {
    res.status(404);
    throw new Error("Hospital not found");
  }

  res.status(200).json({
    success: true,
    message: "Hospital deleted successfully",
    hospital
  });
});

export {
  addHospital,
  getAllHospitals,
  addRating,
  addReview,
  editHospital,
  deleteHospital,
  getHospital
};
