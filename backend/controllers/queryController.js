import Query from '../models/Query.js';
import { successResponse } from '../utils/apiResponse.js';

export const getQueries = async (req, res) => {
  try {
    const { status, priority, search, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (search) filter.$or = [{ title: new RegExp(search, 'i') }, { customerName: new RegExp(search, 'i') }];

    const total = await Query.countDocuments(filter);
    const queries = await Query.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json(successResponse(queries, { total, page: Number(page), limit: Number(limit) }));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getQueryStats = async (req, res) => {
  try {
    const statuses = ['open', 'in-progress', 'resolved', 'closed'];
    const counts = await Promise.all(statuses.map((s) => Query.countDocuments({ status: s })));
    const result = Object.fromEntries(statuses.map((s, i) => [s, counts[i]]));
    res.json(successResponse(result));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getQueryById = async (req, res) => {
  try {
    const query = await Query.findById(req.params.id);
    if (!query) return res.status(404).json({ message: 'Query not found' });
    res.json(successResponse(query));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createQuery = async (req, res) => {
  try {
    const query = await Query.create(req.body);
    res.status(201).json(successResponse(query));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateQuery = async (req, res) => {
  try {
    const query = await Query.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!query) return res.status(404).json({ message: 'Query not found' });
    res.json(successResponse(query));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMyQueries = async (req, res) => {
  try {
    const queries = await Query.find({ customerEmail: req.user.email }).sort({ createdAt: -1 });
    res.json(successResponse(queries));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteQuery = async (req, res) => {
  try {
    const query = await Query.findByIdAndDelete(req.params.id);
    if (!query) return res.status(404).json({ message: 'Query not found' });
    res.json(successResponse({ message: 'Query deleted successfully' }));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
