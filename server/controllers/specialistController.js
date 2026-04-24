import Specialist from '../models/Specialist.js';

export const getAllSpecialists = async (req, res) => {
  try {
    const filter = {};
    if (req.query.specialty && req.query.specialty !== 'All') {
      filter.specialty = req.query.specialty;
    }
    
    // Also support search by user's full model if needed, but here all data is in Specialist
    const specialists = await Specialist.find(filter).populate('user', 'name email');
    res.json(specialists);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
