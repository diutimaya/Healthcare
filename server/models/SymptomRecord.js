import mongoose from 'mongoose';

const symptomRecordSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  symptoms: { type: String, required: true },
  aiAnalysis: {
    severity: String,
    potentialCauses: [String],
    recommendedSpecialistType: String,
    rawResponse: String
  }
}, { timestamps: true });

export default mongoose.model('SymptomRecord', symptomRecordSchema);
