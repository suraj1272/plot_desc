import { 
  getAllPlots, 
  getPlotBySurveyAndNumber, 
  updatePlotStatus, 
  seedInitialPlotsIfEmpty 
} from '../services/plotService.js';

export const getPlotsHandler = async (req, res) => {
  try {
    const { surveyNo, status, number } = req.query;
    const plots = await getAllPlots({ surveyNo, status, number });
    return res.status(200).json({
      success: true,
      count: plots.length,
      data: plots
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch plots.',
      error: error.message
    });
  }
};

export const getSinglePlotHandler = async (req, res) => {
  try {
    const { surveyNo, number } = req.params;
    const plot = await getPlotBySurveyAndNumber(surveyNo, number);
    if (!plot) {
      return res.status(404).json({
        success: false,
        message: `Plot #${number} in Survey No. ${surveyNo} not found.`
      });
    }
    return res.status(200).json({
      success: true,
      data: plot
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch plot details.',
      error: error.message
    });
  }
};

export const updatePlotStatusHandler = async (req, res) => {
  try {
    const { surveyNo, number, status } = req.body;

    if (!surveyNo || !number || !status) {
      return res.status(400).json({
        success: false,
        message: 'surveyNo, number, and status fields are required.'
      });
    }

    const updatedPlot = await updatePlotStatus(surveyNo, number, status);

    return res.status(200).json({
      success: true,
      message: `Status of Plot #${number} in Survey No. ${surveyNo} updated to '${status}'.`,
      data: updatedPlot
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const seedPlotsHandler = async (req, res) => {
  try {
    const result = await seedInitialPlotsIfEmpty();
    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to seed initial plots.',
      error: error.message
    });
  }
};
