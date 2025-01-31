import mongoose from 'mongoose';

const ContactInformationSchema = new mongoose.Schema({
  ContactPersonName: { type: String, required: true },
  ContactNumber: { type: String, required: true },
  ContactEmail: { type: String, required: true },
  Website: { type: String, required: false },
});

const AddressInformationSchema = new mongoose.Schema({
  StreetAddress: { type: String, required: true },
  City: { type: String, required: true },
  State: { type: String, required: true },
  PinCode: { type: String, required: true },
});

const OperatingHoursSchema = new mongoose.Schema({
  OpeningTime: { type: String, required: true },
  ClosingTime: { type: String, required: true },
});

const MediaSchema = new mongoose.Schema({
  FrontUrl: { type: String, required: false },
  ReceptionUrl: { type: String, required: false },
  OperationUrl: { type: String, required: false },
});

const BedCapacitySchema = new mongoose.Schema({
  GeneralWardBeds: { type: Number, required: true },
  PrivateRoomBeds: { type: Number, required: true },
  EmergencyBeds: { type: Number, required: true },
  IcuBeds: { type: Number, required: true },
});

const MedicalStaffSchema = new mongoose.Schema({
  PermenantDoctors: { type: Number, required: true },
  VisitingConsultants: { type: Number, required: true },
  Nurses: { type: Number, required: true },
  SupportStaff: { type: Number, required: true },
});

const LegalDocumentsSchema = new mongoose.Schema({
  HospitalRegistrationUrl: { type: String, required: false },
  MedicalLicense: { type: String, required: false },
  TaxRegistrationCertificate: { type: String, required: false },
});

const AmenitiesSchema = new mongoose.Schema({
  BedCapacity: BedCapacitySchema,
  MedicalStaff: MedicalStaffSchema,
  Facilities: { type: [String], required: true },
  Specialization: { type: [String], required: true },
  LegalDocuments: LegalDocumentsSchema,
});

const VerificationContactSchema = new mongoose.Schema({
  Name: { type: String, required: true },
  Position: { type: String, required: true },
  PhoneNumber: { type: String, required: true },
  AlternatePhone: { type: String, required: false },
});

const OnSiteVerificationSchema = new mongoose.Schema({
  PreferredDate: { type: Date, required: true },
  PreferredTime: { type: String, required: true },
  VerificationContact: VerificationContactSchema,
});

const ParticipantsSchema = new mongoose.Schema({
  RootUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  Staff: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Staff', default:[] }],
  Doctors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', default:[] }],
});

const HospitalSchema = new mongoose.Schema({
  BasicInfo: {
    HospitalName: { type: String, required: true },
    RegistrationNumber: { type: String, required: true },
    ContactInformation: [ContactInformationSchema],
    AddressInformation: [AddressInformationSchema],
    OperatingHours: OperatingHoursSchema,
  },
  Media: [MediaSchema],
  Amenities: AmenitiesSchema,
  OnSiteVerification: OnSiteVerificationSchema,
  OnsiteRating: { type: Number, default: 0, required: true },
  Reviews: { type: [String], default: [] },
  PatientRating: { type: Number, default: 0 },
  Ratings: { type: [Number], default: [] },
  ConsultationFee: { type: Number, default: 0.0 },
  Participants: ParticipantsSchema,
});

export const Hospital = mongoose.model('Hospital', HospitalSchema);
