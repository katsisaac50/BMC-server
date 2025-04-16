import {
    getPatientDemographics,
    getAppointmentTrends,
    getAlertResponseTimes
  } from '../services/analytics.service';
  
  export const getDemographics = asyncHandler(async (req: Request, res: Response) => {
    const data = await getPatientDemographics();
    res.status(200).json({
      success: true,
      data: data[0] // $facet returns an array
    });
  });
  
  export const getTrends = asyncHandler(async (req: Request, res: Response) => {
    const { months = 12 } = req.query;
    const data = await getAppointmentTrends(Number(months));
    res.status(200).json({
      success: true,
      data
    });
  });
  
  export const getResponseMetrics = asyncHandler(async (req: Request, res: Response) => {
    const data = await getAlertResponseTimes();
    res.status(200).json({
      success: true,
      data
    });
  });