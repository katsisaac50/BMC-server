import { generatePatientReport } from '../services/report.service';

export const generateReport = asyncHandler(async (req: Request, res: Response) => {
  const { patientId } = req.params;
  
  const report = await generatePatientReport(patientId);
  
  res.status(201).json({
    success: true,
    data: {
      downloadUrl: `/api/v1/reports/download/${report.filename}`,
      patient: report.patient
    }
  });
});

export const downloadReport = asyncHandler(async (req: Request, res: Response) => {
  const { filename } = req.params;
  const filepath = path.join(__dirname, '../../reports', filename);
  
  if (!fs.existsSync(filepath)) {
    return res.status(404).json({ success: false, error: 'Report not found' });
  }
  
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
  
  const fileStream = fs.createReadStream(filepath);
  fileStream.pipe(res);
});