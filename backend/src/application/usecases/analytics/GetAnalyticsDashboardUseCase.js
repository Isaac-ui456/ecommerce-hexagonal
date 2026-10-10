class GetAnalyticsDashboardUseCase {
  constructor(analyticsRepository) {
    this.analyticsRepository = analyticsRepository;
  }

  async execute({ startDate, endDate, topLimit = 5 }) {
    const [topProducts, revenueTrend, statusDistribution, averageTicket] = await Promise.all([
      this.analyticsRepository.getTopProducts(topLimit),
      this.analyticsRepository.getTotalRevenue(startDate, endDate),
      this.analyticsRepository.getOrderStatusDistribution(),
      this.analyticsRepository.getAverageTicket()
    ]);

    return { topProducts, revenueTrend, statusDistribution, averageTicket };
  }
}

module.exports = GetAnalyticsDashboardUseCase;