
const valDate = new Date("10/01/2020")
console.log(valDate.getTime());
const fye = new Date("12/31/2020")
console.log(fye.getTime())

module.exports = DCF1 = {
  forecasts: [
    {
      forecastPeriod: 1,
      revenue: 500,
      cogs: 200,
      opEx: 100,
      depreciation: 50,
      amortization: 50,
      capex: 20,
      taxRate: .2
    },
    {
      forecastPeriod: 2,
      revenue: 600,
      cogs: 300,
      opEx: 200,
      depreciation: 50,
      amortization: 50,
      capex: 20,
      taxRate: .2
    },
    {
      forecastPeriod: 3,
      revenue: 700,
      cogs: 400,
      opEx: 300,
      depreciation: 50,
      amortization: 50,
      capex: 20,
      taxRate: .25
    },
  ],
  assumptions: {
    ltgr: 0.03,
    discountRate: {
      riskFreeRate: 0.025,
      beta: 1.2,
      equityRiskPremium: 0.06,
      bondRate: 0.05,
      taxRate: .25,
      debtToEquity: .6
    },
    valDate,
    fye,
    periods: 3,
  }
}


const output = {
  forecasts: [
    {
      revenue: 0,
      cogs: 0,
      grossProfit: 0,
      opEx: 0,
      ebitda: 0,
      depreciation: 0,
      amortization: 0,
      capex: 0,
      ebit: 0,
      taxes: 0,
      nopat: 0,
      freeCashFlow: 0
    },

  ]
}
