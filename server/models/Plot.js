import mongoose from 'mongoose';

const PlotHotspotSchema = new mongoose.Schema({
  x: { type: Number, required: true },
  y: { type: Number, required: true },
  width: { type: Number, required: true },
  height: { type: Number, required: true },
  rotation: { type: Number },
  polygon: { type: String }
}, { _id: false });

const PlotDimensionsSchema = new mongoose.Schema({
  length: { type: Number, required: true },
  width: { type: Number, required: true },
  area: { type: Number, required: true },
  areaMetric: { type: Number },
  dimensionLabel: { type: String }
}, { _id: false });

const PlotSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  number: { type: Number, required: true, index: true },
  surveyNo: { type: String, required: true, index: true }, // "98" or "101"
  status: { 
    type: String, 
    enum: ['available', 'booked', 'sold'], 
    default: 'available',
    index: true 
  },
  facing: { 
    type: String, 
    enum: ['North', 'South', 'East', 'West', 'North-East', 'North-West', 'South-East', 'South-West'],
    required: true 
  },
  hotspot: { type: PlotHotspotSchema, required: true },
  dimensions: { type: PlotDimensionsSchema, required: true },
  price: { type: Number },
  totalPrice: { type: Number },
  features: [{ type: String }],
  model3dUrl: { type: String },
  block: { type: String },
  corner: { type: Boolean, default: false },
  layoutName: { type: String, default: 'Shreemant Jagadevrao Deshmukh Layout' }
}, {
  timestamps: true
});

// Compound index for quick lookup by surveyNo + number
PlotSchema.index({ surveyNo: 1, number: 1 }, { unique: true });

export default mongoose.models.Plot || mongoose.model('Plot', PlotSchema);
