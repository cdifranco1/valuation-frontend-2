import logo from './logo.svg';
import { gql, useMutation } from '@apollo/client';
import { useEffect } from 'react'

import './App.css';

// type ForecastInput {
//   forecastPeriod: Int,
//   revenue: Float,
//   cogs: Float,
//   grossProfit: Float,
//   opEx: Float,
//   ebitda: Float,
//   depreciation: Float,
//   amortization: Float,
//   capex: Float,
//   ebit: Float,
//   taxes: Float,
//   nopat: Float,
//   fcf: Float
// }

// type AssumptionsInput {
//   ltgr: Float,
//   discountRate: DiscountRateInput,
//   taxRate: Float,
//   valDate: Date,
//   fye: Date,
//   periods: Int
// }

// type DiscountRateInput {
//   riskFreeRate: Float,
//   beta: Float,
//   equityRiskPremium: Float,
//   bondRate: Float,
//   taxRate: Float,
//   debtToEquity: Float
// }

// type DCFInput {
//   forecasts: [ForecastInput],
//   assumptions: AssumptionsInput
// }

const CREATE_DCF = gql
`
  mutation createDCF($dcfData: DCFInput!) {
    createDCF(dcfData: $dcfData) {
      id
      forecasts {
        revenue
        cogs
        grossProfit
      }
      assumptions {
        discountRate {
          wacc
        }
      }
      pvOfDiscountedCashFlows
      pvOfTerminalValue
    }
  }
`

function App() {
  const [createDCF, { data }] = useMutation(CREATE_DCF);
  const valDate = new Date("10/01/2020")
  const fye = new Date("12/31/2020")

  useEffect(() => {
    const getDcf = async () => {
      const DCF = await createDCF(
        {variables: 
          { dcfData: {
            forecasts: 
            [
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
    }})

    return DCF;
    }

    const result = getDcf();
    console.log(data)
  }, [])

  return (
    <div className="App">

    </div>
  );
}

export default App;
