import { createCaseService, getAllCasesService } from '../services/cases.service.js';

export async function getAllCasesController(req, res) {
  try {
    const cases = await getAllCasesService();
    res.status(200).json(cases);
  } catch (error) {
    console.error('Error fetching cases:', error);
    res.status(500).json({ error: 'Failed to fetch cases' });
  }
}

export async function createCaseController(req, res) {
  try {
    const { student_id: studentId, offense_type: offenseType } = req.body;

    if (!studentId || !offenseType) {
      return res.status(400).json({ error: 'student_id and offense_type are required' });
    }

    const createdCase = await createCaseService(studentId, offenseType);
    return res.status(201).json(createdCase);
  } catch (error) {
    console.error('Error creating case:', error);
    return res.status(500).json({ error: 'Failed to create case' });
  }
}
