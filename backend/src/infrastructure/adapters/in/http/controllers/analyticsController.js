class AnalyticsController {
  constructor(getAnalyticsDashboardUseCase) {
    this.getAnalyticsDashboardUseCase = getAnalyticsDashboardUseCase;
  }

  async getDashboardData(req, res, next) {
    try {
      const { startDate, endDate, limit } = req.query;
      const data = await this.getAnalyticsDashboardUseCase.execute({
        startDate,
        endDate,
        topLimit: limit ? parseInt(limit, 10) : 5
      });
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AnalyticsController;