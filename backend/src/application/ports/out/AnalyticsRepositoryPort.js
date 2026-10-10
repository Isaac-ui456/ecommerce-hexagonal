class AnalyticsRepositoryPort {
  async getTopProducts(limit = 5) { throw new Error('METHOD_NOT_IMPLEMENTED'); }
  async getTotalRevenue(startDate, endDate) { throw new Error('METHOD_NOT_IMPLEMENTED'); }
  async getOrderStatusDistribution() { throw new Error('METHOD_NOT_IMPLEMENTED'); }
  async getAverageTicket() { throw new Error('METHOD_NOT_IMPLEMENTED'); }
}

module.exports = AnalyticsRepositoryPort;