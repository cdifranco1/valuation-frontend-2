const { gql } = require('apollo-server');


const typeDefs = gql`
  scalar Date

  # enum BeforeLineItem {
  #   GROSS_PROFIT,
  #   EBITDA,
  #   EBIT,
  #   NOPAT
  # }
  # CustomExpense {
  #   name: String,
  #   amount: Float!,
  #   beforeLineItem: BeforeLineItem
  #   cashOutlay: Boolean
  # }
  # CustomProfit {
  #   name: String,
  #   beforeLineItem: BeforeLineItem,
  #   amount: Float!,
  #   cashIncome: Boolean
  # }

  input ForecastInput {
    forecastPeriod: Int,
    revenue: Float,
    cogs: Float,
    opEx: Float,
    depreciation: Float,
    amortization: Float,
    capex: Float,
    taxRate: Float
  }

  input DCFInput {
    forecasts: [ForecastInput],
    assumptions: AssumptionsInput
  }

  type Forecast {
    forecastPeriod: Int,
    revenue: Float,
    cogs: Float,
    grossProfit: Float,
    opEx: Float,
    ebitda: Float,
    depreciation: Float,
    amortization: Float,
    capex: Float,
    ebit: Float,
    taxes: Float,
    nopat: Float,
    fcf: Float
  }

  input AssumptionsInput {
    ltgr: Float,
    discountRate: DiscountRateInput,
    taxRate: Float,
    valDate: Date,
    fye: Date,
    periods: Int
  }

  type Assumptions {
    discountRate: DiscountRate,
    taxRate: Float,
    ltgr: Float,
    valDate: String,
    periods: Int
  }

  type DCF {
    _id: ID!,
    forecasts: [Forecast],
    assumptions: Assumptions,
    pvOfDiscountedCashFlows: Float,
    pvOfTerminalValue: Float,
  }

  input DiscountRateInput {
    riskFreeRate: Float,
    beta: Float,
    equityRiskPremium: Float,
    bondRate: Float,
    taxRate: Float,
    debtToEquity: Float
  }
  
  type DiscountRate {
    id: ID!,
    riskFreeRate: Float,
    beta: Float,
    equityRiskPremium: Float,
    taxRate: Float,
    debtToEquity: Float,
    costOfDebt: Float,
    costOfEquity: Float,
    wacc: Float
  }

  type Query {
    allDcfs: [DCF],
    dcf(id: ID!): DCF
  }

  type Mutation {
    createDCF(dcfData: DCFInput): DCF
  }
`


/* 
  input DCFInput {
    forecasts: [ForecastInput],
    assumptions: AssumptionsInput
  }
  
  input DCFInput {
    forecasts: [
      {
        forecastPeriod: 1
        profitLossInput: {
          
        },
        cashFlowInput: {
          
        },
      }
      {
        forecastPeriod: 2
        profitLossInput: {
          
        },
        cashFlowInput: {
          
        },
      }
    ],
    assumptions: {
      ltgr: 0,
      discountRate: {
        riskFreeRate: 0,
        beta: 0,
        equityRiskPremium: 0,
        taxRate: 0,
        debtToEquity: 0
      },
      taxRate: 0
      valDate: "10-1-2019",
      periods: 5
    }
  }

  input ForecastInput {
    forecastPeriod: Int,
    profitLossInput: ProfitLossInput,
    cashFlowInput: CashFlowInput,
  } 

  input ProfitLossInput {
    revenue: Float,
    cogs: Float,
    opEx: Float,
  }

  input CashFlowInput {
    depreciation: Float,
    amortization: Float,
    capex: Float,
  }

  input DiscountRateInput {
    riskFreeRate: Float,
    beta: Float,
    equityRiskPremium: Float,
    taxRate: Float,
    debtToEquity: Float
  }

  input AssumptionsInput {
    ltgr: Float,
    discountRate: DiscountRateInput,
    taxRate: Float
    valDate: String,
    periods: Int
  }

Sample DCF Input:

*/

module.exports = typeDefs;