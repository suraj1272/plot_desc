import Plot from '../models/Plot.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getAllPlots = async (filter = {}) => {
  const query = {};
  if (filter.surveyNo && filter.surveyNo !== 'all') {
    query.surveyNo = filter.surveyNo;
  }
  if (filter.status && filter.status !== 'all') {
    query.status = filter.status;
  }
  if (filter.number) {
    query.number = Number(filter.number);
  }

  const plots = await Plot.find(query).sort({ surveyNo: 1, number: 1 }).lean();
  return plots;
};

export const getPlotBySurveyAndNumber = async (surveyNo, number) => {
  const plot = await Plot.findOne({ surveyNo: String(surveyNo), number: Number(number) });
  return plot;
};

export const updatePlotStatus = async (surveyNo, number, newStatus) => {
  const allowedStatuses = ['available', 'booked', 'sold'];
  if (!allowedStatuses.includes(newStatus)) {
    throw new Error(`Invalid status '${newStatus}'. Allowed: ${allowedStatuses.join(', ')}`);
  }

  const updatedPlot = await Plot.findOneAndUpdate(
    { surveyNo: String(surveyNo), number: Number(number) },
    { status: newStatus },
    { new: true, runValidators: true }
  );

  if (!updatedPlot) {
    throw new Error(`Plot #${number} in Survey No. ${surveyNo} not found.`);
  }

  return updatedPlot;
};

export const seedInitialPlotsIfEmpty = async () => {
  const count = await Plot.countDocuments();
  if (count > 0) {
    return { seeded: false, count };
  }

  // Load initial plots JSON
  const plotsJsonPath = path.resolve(__dirname, '../../src/data/plots.json');
  if (!fs.existsSync(plotsJsonPath)) {
    console.warn('plots.json not found for seeding at:', plotsJsonPath);
    return { seeded: false, message: 'plots.json file not found' };
  }

  const fileData = fs.readFileSync(plotsJsonPath, 'utf-8');
  const initialPlots = JSON.parse(fileData);

  const inserted = await Plot.insertMany(initialPlots, { ordered: false });
  console.log(`Seeded ${inserted.length} initial plots into MongoDB`);
  return { seeded: true, count: inserted.length };
};
