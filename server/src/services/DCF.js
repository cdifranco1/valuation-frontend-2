const DCF1 = require("../dummyData");

module.exports = {
  buildDCF
}

const DAY_MILLISECONDS = 24 * 60 * 60 * 1000;
const YEAR_MILLISECONDS = DAY_MILLISECONDS * 365.25;

/**
 *  Class for each forecast within the input object
 * @param {Object} forecastObj - An object containing forecast input line items
 */

class Forecast {
  constructor(forecastObj = {}) {
    this.forecastPeriod = forecastObj.forecastPeriod
    this.revenue = forecastObj.revenue
    this.cogs = forecastObj.cogs
    this.opEx = forecastObj.opEx
    this.depreciation = forecastObj.depreciation
    this.amortization = forecastObj.amortization
    this.capex = forecastObj.capex
    this.taxRate = forecastObj.taxRate

    this.gp = null
    this.ebitda = null
    this.ebit = null
    this.taxes = null
    this.nopat = null
    this.fcf = null
    this.pvFactor = null
    this.discountedFCF = null

    this.discountPeriod = null
  }

  initForecast() {
    this.gp = this.calcGP()
    this.ebitda = this.calcEBITDA()
    this.ebit = this.calcEBIT()
    this.taxes = this.calcTaxes()
    this.nopat = this.calcNOPAT()
    this.fcf = this.calcFCF() 
  }

  calcGP() {
    return this.revenue - this.cogs;
  }

  calcEBITDA() {
    return this.gp - this.opEx;
  }

  calcEBIT() {
    return this.ebitda - this.amortization - this.depreciation;
  }

  calcTaxes() {
    return this.taxRate * this.ebit;
  }

  calcNOPAT() {
    return this.ebit - this.taxes
  }

  calcFCF() {
    return this.nopat + this.amortization + this.depreciation
  }

  calcDiscountPeriod(partialPeriod) {
    if (this.forecastPeriod === 1) {
      this.discountPeriod = partialPeriod / 2;
    } else if (this.forecastPeriod === 2) {
      this.discountPeriod = partialPeriod + 0.5 
    } else {
      this.discountPeriod = partialPeriod + 0.5 + (this.forecastPeriod - 2) 
    }
  }

  calcPVFactor(discountRate){
    
    this.pvFactor = 1 / Math.pow((1 + discountRate), this.discountPeriod);
  }
  
  calcDiscountedFCF(){
    this.discountedFCF = this.pvFactor * this.fcf;
  }

}


/**
 * @param {Array<Forecast>} forecasts - Array of Forecasts
 * @param {Assumptions} assumptions - Assumptions contains DiscountRate object,
 * ltgr, valDate, and periods
*/
class DCF {
  constructor(forecasts=[], assumptions) {
    this.forecasts = forecasts
    this.assumptions = assumptions
    
    this.pvOfDiscountedCashFlows = null
    this.pvOfTerminalValue = null
  }

  sumPVOFDiscountedFCF(){
    this.pvOfDiscountedCashFlows = this.forecasts.reduce((sum, forecast) => {
      return sum + forecast.discountedFCF;
    }, 0)
    return this.pvOfDiscountedCashFlows;
  }

  calcTerminalValue() {
    const terminalFactor = 1 / (this.assumptions.discountRate.wacc - this.assumptions.ltgr);

    const terminalCashFlow = this.forecasts[this.forecasts.length - 1].fcf * (1 + this.assumptions.ltgr);
    const terminalValue = terminalFactor * terminalCashFlow;
    this.pvOfTerminalValue = terminalValue * this.forecasts[this.forecasts.length - 1].pvFactor;
  }

}


/**
 * @param {DiscountRate} discountRate
 * @param {Number} ltgr
 * @param {Date} valDate
 * @param {Date} fye
 * @param {Number} periods
 * 
 */
class Assumptions {
  constructor(discountRate, ltgr, valDate, periods, fye) {
    this.discountRate = discountRate
    this.ltgr = ltgr
    this.valDate = new Date(valDate);
    this.fye = new Date(fye);
    this.periods = periods

    // this is prob too precise - should be day over dayYears 
    // but okay for now
    this.partialPeriod = (this.fye.getTime() - this.valDate.getTime()) / YEAR_MILLISECONDS;
  }
}


class DiscountRate {
  constructor(inputs) {
    this.rfr = inputs.riskFreeRate || 0
    this.beta = inputs.beta || 0 
    this.erp = inputs.equityRiskPremium || 0
    this.taxRate = inputs.taxRate || 0
    this.bondRate = inputs.bondRate || 0
    this.debtToEquity = inputs.debtToEquity || 0
    
    this.costOfEquity = null
    this.costOfDebt = null
    this.wacc = null
    this.dirty = true //may use this as a switch to know when the rate is fresh
  }

  calcWACC() {
    if (this.value && !this.dirty) {
      return this.value;
    }

    this.costOfEquity = this.rfr + (this.beta * this.erp)
    this.costOfDebt = this.bondRate * (1 - this.taxRate)

    const equityWeight = (this.debtToEquity + 1) / 1
    const debtWeight = 1 - equityWeight

    const wacc = (equityWeight * this.costOfEquity) + (debtWeight * this.costOfDebt)
    this.wacc = wacc;
    return wacc;
  }
}


function buildDCF(DCFInput) {
  const { forecasts } = DCFInput;
  const { 
    assumptions: {
      ltgr,
      discountRate,
      valDate,
      periods,
      fye
    }
  } = DCFInput;

  const wacc = new DiscountRate(discountRate)
  wacc.calcWACC()

  const assumptions = new Assumptions(wacc, ltgr, valDate, periods, fye)

  const initializedForecasts = forecasts.map(forecastInput => {
    const currForecast = new Forecast(forecastInput);
    currForecast.initForecast();
    currForecast.calcDiscountPeriod(assumptions.partialPeriod);
    currForecast.calcPVFactor(assumptions.discountRate.wacc);
    currForecast.calcDiscountedFCF()
    return currForecast;
  })
  
  const dcf = new DCF(initializedForecasts, assumptions);
  dcf.calcTerminalValue()
  dcf.sumPVOFDiscountedFCF()

  return dcf;
}

// const testOutput = buildDCF(DCF1);
// console.log(testOutput);