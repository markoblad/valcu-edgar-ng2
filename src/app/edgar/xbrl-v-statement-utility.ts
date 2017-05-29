import { Injectable } from '@angular/core';
import { XbrlUtility } from '../edgar';

@Injectable()
export class XbrlVStatementUtility {

  public static get BALANCE_SHEET_BANK(): any {
    return [
      'Assets',
        'CashCashEquivalentsAndFederalFundsSold',
          'CashAndCashEquivalentsAtCarryingValue',
          'FederalFundsSoldAndSecuritiesPurchasedUnderAgreementsToResell',
        'RestrictedCashAndInvestments',
        'MarketableSecurities',
        'FederalHomeLoanBankStockAndFederalReserveBankStock',
        'InvestmentsInAffiliatesSubsidiariesAssociatesAndJointVentures',
        'AssetsHeldForSaleAtCarryingValue',
        'PremiumsReceivableAtCarryingValue',
        'LoansPledgedAsCollateral',
        'AccountsReceivableNet',
        'NotesReceivableNet',
        'AccountsReceivableFromSecuritization',
        'AssetsUnderManagementCarryingAmount',
        'DefinedBenefitPlanAssetsForPlanBenefitsCurrentAndNoncurrent',
        'LoansAndLeasesReceivableNetReportedAmountCoveredAndNotCovered',

        'PropertyPlantAndEquipmentNet',
          'PropertyPlantAndEquipmentGross',
          'AccumulatedDepreciationDepletionAndAmortizationPropertyPlantAndEquipment',
        'Goodwill',
        'IntangibleAssetsNetExcludingGoodwill',

      'LiabilitiesAndStockholdersEquity',
        'Liabilities',
          'Deposits',
          'FederalFundsPurchasedAndSecuritiesSoldUnderAgreementsToRepurchase',
          'AccountsPayableAndAccruedLiabilitiesCurrentAndNoncurrent',
          'DebtAndCapitalLeaseObligations',
            'ShortTermBorrowings',
            'LongTermDebt',
          'LiabilitiesOfDisposalGroupIncludingDiscontinuedOperation',
        'CommitmentsAndContingencies',
        'TemporaryEquityCarryingAmountIncludingPortionAttributableToNoncontrollingInterests',
        'StockholdersEquityIncludingPortionAttributableToNoncontrollingInterest',
    ];
  }

  public static get BALANCE_SHEET_BROKER(): any {
    return [
      'Assets',
        'CashAndCashEquivalentsAtCarryingValue',
        'CashAndSecuritiesSegregatedUnderFederalAndOtherRegulations',
        'CollateralizedAgreements',
        'ReceivablesFromBrokersDealersAndClearingOrganizations',
        'ReceivablesFromCustomers',
        'InterestReceivable',
        'PremiumsReceivableAtCarryingValue',
        'NotesReceivableNet',
        'FinancialInstrumentsOwnedAtFairValue',
        'PrepaidExpenseAndOtherAssets',
        'DefinedBenefitPlanAssetsForPlanBenefitsCurrentAndNoncurrent',
        'AssetsUnderManagementCarryingAmount',

        'PropertyPlantAndEquipmentNet',
          'PropertyPlantAndEquipmentGross',
          'AccumulatedDepreciationDepletionAndAmortizationPropertyPlantAndEquipment',
        'Goodwill',
        'IntangibleAssetsNetExcludingGoodwill',

      'LiabilitiesAndStockholdersEquity',
        'Liabilities',
          'ShortTermBorrowings',
          'CustomerAdvancesAndDeposits',
          'CollateralizedFinancings',
          'PayablesToCustomers',
          'InterestAndDividendsPayableCurrentAndNoncurrent',
          'LongTermDebt',
          'PayablesToBrokerDealersAndClearingOrganizations',
          'LiabilitiesOfDisposalGroupIncludingDiscontinuedOperation',
        'CommitmentsAndContingencies',
        'TemporaryEquityCarryingAmountIncludingPortionAttributableToNoncontrollingInterests',
        'StockholdersEquityIncludingPortionAttributableToNoncontrollingInterest',
    ];
  }

  public static get BALANCE_SHEET_INSURANCE(): any {
    return [
      'Assets',
        'InvestmentsAndCash',
          'Investments',
            'MarketableSecurities',
            'RealEstateInvestments',
            'MortgageLoansOnRealEstateCommercialAndConsumerNet',
            'SecuritiesPurchasedUnderAgreementsToResell',
          'CashAndCashEquivalentsAtCarryingValue',
        'AccruedInvestmentIncomeReceivable',
        'PremiumsAndOtherReceivablesNet',
          'PremiumsReceivableAtCarryingValue',
          'AccountsReceivableNet',
          'NotesReceivableNet',
        'ReinsuranceRecoverables',
        'DeferredPolicyAcquisitionCostsAndValueOfBusinessAcquired',
        'AssetsUnderManagementCarryingAmount',

        'PropertyPlantAndEquipmentNet',
          'PropertyPlantAndEquipmentGross',
          'AccumulatedDepreciationDepletionAndAmortizationPropertyPlantAndEquipment',
        'Goodwill',

        'LiabilitiesAndStockholdersEquity',
        'Liabilities',
          'LiabilityForFuturePolicyBenefitsAndUnpaidClaimsAndClaimsAdjustmentExpense',
            'LiabilityForFuturePolicyBenefits  ',
            'LiabilityForClaimsAndClaimsAdjustmentExpense',
          'PolicyholderFunds',
          'ReserveForLossesAndLossAdjustmentExpenses',
          'DebtAndCapitalLeaseObligations',
            'ShortTermBorrowings',
            'LongTermDebt',
            'CapitalLeaseObligations',
        'TemporaryEquityCarryingAmountIncludingPortionAttributableToNoncontrollingInterests',
        'StockholdersEquityIncludingPortionAttributableToNoncontrollingInterest ',
    ];
  }

  public static get INCOME_STATEMENT_INSURANCE(): any {
    return [
      'NetIncomeLossAvailableToCommonStockholdersBasic',
        'NetIncomeLoss',
          'ProfitLoss',
            'ExtraordinaryItemNetOfTax',
            'IncomeLossBeforeExtraordinaryItemsAndCumulativeEffectOfChangeInAccountingPrinciple',
              'IncomeLossFromContinuingOperationsIncludingPortionAttributableToNoncontrollingInterest',
                'IncomeLossFromContinuingOperationsBeforeIncomeTaxesMinorityInterestAndIncomeLossFromEquityMethodInvestments',
                  'OperatingIncomeLoss',
                    'BenefitsLossesAndExpenses',
                      'PolicyholderBenefitsAndClaimsIncurredNet',
                        'PolicyholderBenefitsAndClaimsIncurredGross',
                        'ReinsuranceCostsAndRecoveriesNet',
                      'LiabilityForFuturePolicyBenefitsPeriodExpense',
                      'InterestCreditedToPolicyholdersAccountBalances',
                      'PolicyholderDividends',
                      'OperatingExpenses',
                        'SellingGeneralAndAdministrativeExpense',
                        'DemutualizationCostAndExpense',
                        'InsuranceCommissions',
                        'InterestExpense',
                        'DepreciationAndAmortization',
                          'AmortizationOfDeferredCharges',
                          'DepreciationNonproduction',
                          'OtherDepreciationAndAmortization',
                        'RestructuringSettlementAndImpairmentProvisions',
                        'LegalFees',
                      'DeferredPolicyAcquisitionCostAmortizationExpense',
                      'AmortizationOfValueOfBusinessAcquiredVOBA',
                      'ContractAdministrationExpense',
                      'BenefitClaimsInExcessOfRelatedPolicyholderBalances',
                    'Revenues',
                      'PremiumsEarnedNet',
                      'PolicyChargesInsurance',
                      'FeesAndCommissions',
                      'NetInvestmentIncome',
                      'GainLossOnInvestmentsExcludingOtherThanTemporaryImpairments',
                      'RealizedInvestmentGainsLosses',
                      'OtherIncome',
                  'OtherNonoperatingIncomeExpense',
                'IncomeTaxExpenseBenefit',
                'IncomeLossFromEquityMethodInvestments',
              'IncomeLossFromDiscontinuedOperationsNetOfTax',
          'NetIncomeLossAttributableToNoncontrollingInterest',
        'PreferredStockDividendsAndOtherAdjustments',
    ];
  }

  public static get TEST_EQUITY_COMPONENT_SCHEMA(): any {
    return [
      '*StatementEquityComponentsAxis',
      '**EquityComponentDomain',
      '***ParentMember',
      '****CommonStockMember',
      '****PreferredStockMember',
      '****CapitalUnitsMember',
      '****AdditionalPaidInCapitalMember',
      '****TreasuryStockMember',
      '****RetainedEarningsMember',
      '****AccumulatedOtherComprehensiveIncomeMember',
      '***NoncontrollingInterestMember',
      '***ComprehensiveIncomeMember',
    ];
  }

  public static get TEST_STATEMENT_LINE_ITEM(): any {
    return [
      '*StatementLineItems',
      '**IncreaseDecreaseInStockholdersEquityRollForward',
      '***StockholdersEquityIncludingPortionAttributableToNoncontrollingInterest',
      '***CumulativeEffectOfProspectiveApplicationOfNewAccountingPrinciple',
      '***StockholdersEquityIncludingPortionAttributableToNoncontrollingInterestAdjustedBalance',
      '***CommonStockSharesOutstanding',
      '***PreferredStockSharesOutstanding',
      '***StockIssuedDuringPeriodValueNewIssues',
      '****StockIssuedDuringPeriodSharesNewIssues',
      '***StockIssuedDuringPeriodValueIssuedForServices',
      '****StockIssuedDuringPeriodSharesIssuedForServices',
      '***StockIssuedDuringPeriodValueAcquisitions',
      '****StockIssuedDuringPeriodSharesAcquisitions',
      '***StockIssuedDuringPeriodValueConversionOfConvertibleSecuritiesNetOfAdjustmentsAbstract',
      '****StockIssuedDuringPeriodSharesConversionOfConvertibleSecurities',
      '***StockIssuedDuringPeriodValueStockDividend',
      '***StockIssuedDuringPeriodValueDividendReinvestmentPlan',
      '****StockIssuedDuringPeriodSharesDividendReinvestmentPlan',
      '***StockIssuedDuringPeriodValuePurchaseOfAssets',
      '****StockIssuedDuringPeriodSharesPurchaseOfAssets',
      '***StockIssuedDuringPeriodValueTreasuryStockReissued',
      '***StockIssuedDuringPeriodSharesStockSplits',
      '***StockIssuedDuringPeriodSharesReverseStockSplits',
      '***StockRepurchasedAndRetiredDuringPeriodValue',
      '****StockRepurchasedAndRetiredDuringPeriodShares',
      '***StockRepurchasedDuringPeriodValue',
      '****StockRepurchasedDuringPeriodShares',
      '***TreasuryStockTransactionsExcludingValueOfSharesReissuedAbstract',
      '***AdjustmentsToAdditionalPaidInCapitalAbstract',
      '***ProfitLoss',
      '***OtherComprehensiveIncomeLossNetOfTax',
      '***ReclassificationsOfTemporaryToPermanentEquity',
      '***DividendsAbstract',
      '****DividendsCommonStockAbstract',
      '****DividendsPreferredStockAbstract',
      '****DividendsShareBasedCompensationAbstract',
      '****DividendsShareBasedCompensation',
      '***StockholdersEquityPeriodIncreaseDecrease',
      '****StockIssuedDuringPeriodSharesPeriodIncreaseDecrease',
      '**IncreaseDecreaseInTemporaryEquityRollForward',
      '**StockTransactionsParentheticalDisclosuresAbstract',
      '**NoncontrollingInterestItemsAbstract',
      '*special_item',
    ];
  }

  // StockIssuedDuringPeriodSharesStockSplits
  // add other in manually select
  // add something other than Abstract
  // name space, taxonomy in db

  public static get TEST_STATEMENT_LINE_ITEM_2(): any {
    return [
      '*StatementLineItems',
      '**IncreaseDecreaseInStockholdersEquityRollForward',
      '***StockholdersEquityIncludingPortionAttributableToNoncontrollingInterest',
      '***CumulativeEffectOfProspectiveApplicationOfNewAccountingPrinciple',
      '***StockholdersEquityIncludingPortionAttributableToNoncontrollingInterestAdjustedBalance',
      '***CommonStockSharesOutstanding',
      '***PreferredStockSharesOutstanding',
      '***StockIssuedDuringPeriodValueNewIssues',
      '****StockIssuedDuringPeriodSharesNewIssues',
      '***StockIssuedDuringPeriodValuePurchaseOfAssets',
      '****StockIssuedDuringPeriodSharesPurchaseOfAssets',
      '***StockRepurchasedDuringPeriodValue',
      '****StockRepurchasedDuringPeriodShares',
      '***TreasuryStockTransactionsExcludingValueOfSharesReissuedAbstract',
      '***AdjustmentsToAdditionalPaidInCapitalAbstract',
      '***ProfitLoss',
      '***OtherComprehensiveIncomeLossNetOfTax',
      '***ReclassificationsOfTemporaryToPermanentEquity',
      '***DividendsAbstract',
      '****DividendsCommonStockAbstract',
      '****DividendsPreferredStockAbstract',
      '****DividendsShareBasedCompensationAbstract',
      '****DividendsShareBasedCompensation',
      '***StockholdersEquityPeriodIncreaseDecrease',
      '****StockIssuedDuringPeriodSharesPeriodIncreaseDecrease',
      '**IncreaseDecreaseInTemporaryEquityRollForward',
      '**StockTransactionsParentheticalDisclosuresAbstract',
      '**NoncontrollingInterestItemsAbstract',
    ];
  }

  public static get SHAREHOLDERS_EQUITY_STATEMENT_SECTION_SCHEMA(): any {
    return [
      '@*StockholdersEquityIncludingPortionAttributableToNoncontrollingInterest',
      '*StockholdersEquityPeriodIncreaseDecrease',
      '**CumulativeEffectOfProspectiveApplicationOfNewAccountingPrinciple',
      '**AdjustmentsToAdditionalPaidInCapitalStockIssuedIssuanceCosts',
      '**AdjustmentsToAdditionalPaidInCapitalSharebasedCompensationRequisiteServicePeriodRecognitionValue',
      '**AdjustmentsToAdditionalPaidInCapitalTerminationOfSCorporationElection',
      '**AdjustmentsToAdditionalPaidInCapitalMarkToMarket',
      '**AdjustmentsToAdditionalPaidInCapitalConvertibleDebtWithConversionFeature',
      '**AdjustmentsToAdditionalPaidInCapitalReallocationOfMinorityInterest',
      '**AdjustmentsToAdditionalPaidInCapitalDividendsInExcessOfRetainedEarnings',
      '**AdjustmentsToAdditionalPaidInCapitalStockSplit',
      '**AdjustmentsToAdditionalPaidInCapitalWarrantIssued',
      '**AdjustmentsToAdditionalPaidInCapitalIncreaseInCarryingAmountOfRedeemablePreferredStock',
      '**AdjustmentsToAdditionalPaidInCapitalStockIssuedOwnshareLendingArrangementIssuanceCosts',
      '**AdjustmentsToAdditionalPaidInCapitalOther',
      '**ReclassificationsOfTemporaryToPermanentEquity',
      '**Dividends',
      '***DividendsCommonStock',
      '***DividendsPreferredStock',
      '***DividendsShareBasedCompensation',
      '**StockIssuedDuringPeriodValueNewIssues',
      '**StockIssuedDuringPeriodValueIssuedForServices',
      '**StockIssuedDuringPeriodValueShareBasedCompensation',
      '**StockGrantedDuringPeriodValueSharebasedCompensation',
      '**StockIssuedDuringPeriodValueEmployeeStockPurchasePlan',
      '**StockIssuedDuringPeriodValueEmployeeBenefitPlan',
      '**StockIssuedDuringPeriodValueEmployeeStockOwnershipPlan',
      '**StockIssuedDuringPeriodValueRestrictedStockAwardNetOfForfeitures',
      '**StockIssuedDuringPeriodValueAcquisitions',
      '**StockIssuedDuringPeriodValueStockOptionsExercised',
      '**StockIssuedDuringPeriodValueConversionOfUnits',
      '**StockIssuedDuringPeriodValueStockDividend',
      '**StockIssuedDuringPeriodValueDividendReinvestmentPlan',
      '**StockIssuedDuringPeriodValuePurchaseOfAssets',
      '**StockIssuedDuringPeriodValueOther',
      '**StockRepurchasedAndRetiredDuringPeriodValue',
      '**StockRepurchasedDuringPeriodValue',
      '**StockRedeemedOrCalledDuringPeriodValue',
      '**StockIssuedDuringPeriodValueConversionOfConvertibleSecuritiesNetOfAdjustments',
      '**ComprehensiveIncomeNetOfTaxIncludingPortionAttributableToNoncontrollingInterest',
      '***ProfitLoss',
      '***OtherComprehensiveIncomeLossNetOfTax',
    ];
  }

  // TODO : Cash & Cash equil
  public static get BALANCE_SHEET_SECTION_SCHEMA(): any {
    return [
      '=Assets',
      '+*Assets',
      '=CurrentAssets',
      '+**AssetsCurrent',
      '+***CashCashEquivalentsAndShortTermInvestments',
      '+****CashAndCashEquivalentsAtCarryingValue',
      '+*****Cash',
      '+*****CashEquivalentsAtCarryingValue',
      '+****ShortTermInvestments',
      '+****RestrictedCashAndInvestmentsCurrent',
      '+***ReceivablesNetCurrent',
      '+****AccountsNotesAndLoansReceivableNetCurrent',
      '+*****AccountsReceivableNetCurrent',
      '+******AccountsReceivableGrossCurrent',
      '-******AllowanceForDoubtfulAccountsReceivableCurrent',
      '+***InventoryNet',
      '+***PrepaidExpenseAndOtherAssetsCurrent',
      '+***DeferredCostsCurrent',
      '+***DerivativeInstrumentsAndHedges',
      '+***DeferredTaxAssetsLiabilitiesNetCurrent',
      '=NoncurrentAssets',
      '+**AssetsNoncurrent',
      '+***InventoryNoncurrent',
      '+***PropertyPlantAndEquipmentNet',
      '+****PropertyPlantAndEquipmentGross',
      '-****AccumulatedDepreciationDepletionAndAmortizationPropertyPlantAndEquipment',
      '+***LongTermInvestmentsAndReceivablesNet',
      '+***Goodwill',
      '+***IntangibleAssetsNetExcludingGoodwill',
      '+***InvestmentsAndOtherNoncurrentAssets',
      '+***DeferredCosts',
      '+***DeferredTaxAssetsLiabilitiesNetNoncurrent',
      '=LiabilitiesAndShareholders\'Equity',
      '+*LiabilitiesAndStockholdersEquity',
      '=Liabilities',
      '+**Liabilities',
      '=CurrentLiabilities',
      '+***LiabilitiesCurrent',
      '+****AccountsPayableAndAccruedLiabilitiesCurrent',
      '+****DebtCurrent',
      '+*****ShortTermBorrowings',
      '+*****LongTermDebtAndCapitalLeaseObligationsCurrent',
      '+****DeferredRevenueAndCreditsCurrent',
      '+****DeferredTaxLiabilitiesCurrent',
      '=NoncurrentLiabilities',
      '+***LiabilitiesNoncurrent',
      '+****LongTermDebtAndCapitalLeaseObligations',
      '+*****LongTermDebtNoncurrent',
      '+*****CapitalLeaseObligationsNoncurrent',
      '+****LiabilitiesOtherThanLongtermDebtNoncurrent',
      '+*****DeferredTaxLiabilitiesNoncurrent',
      '=CommitmentsAndContingencies',
      '+**CommitmentsAndContingencies',
      '=Shareholders\'Equity',
      '+**TemporaryEquityCarryingAmountIncludingPortionAttributableToNoncontrollingInterests',
      '+**StockholdersEquityIncludingPortionAttributableToNoncontrollingInterest',
      '+***StockholdersEquity',
      '+****PreferredStockValue',
      '+****CommonStockValue',
      '+****AdditionalPaidInCapital',
      '+*****AdditionalPaidInCapitalCommonStock',
      '+*****AdditionalPaidInCapitalPreferredStock',
      '+****RetainedEarningsAccumulatedDeficit',
      '+***MinorityInterest',
    ];
  }

  public static get BALANCE_SHEET_SECTION_SCHEMA_V2(): any {
    return [
      '=Assets',
      '+*Assets',
      '=CurrentAssets',
      '+**AssetsCurrent',
      '+***CashCashEquivalentsAndShortTermInvestments',
      '+****CashAndCashEquivalentsAtCarryingValue',
      '+****ShortTermInvestments',
      '+****RestrictedCashAndInvestmentsCurrent',
      '+***ReceivablesNetCurrent',
      '+***InventoryNet',
      '+***DeferredTaxAssetsLiabilitiesNetCurrent',
      '=NoncurrentAssets',
      '+**AssetsNoncurrent',
      '+***PropertyPlantAndEquipmentNet',
      '+****PropertyPlantAndEquipmentGross',
      '-****AccumulatedDepreciationDepletionAndAmortizationPropertyPlantAndEquipment',
      '+***LongTermInvestmentsAndReceivablesNet',
      '+***Goodwill',
      '+***IntangibleAssetsNetExcludingGoodwill',
      '+***DeferredTaxAssetsLiabilitiesNetNoncurrent',
      '=LiabilitiesAndShareholdersEquity',
      '+*LiabilitiesAndStockholdersEquity',
      '=Liabilities',
      '+**Liabilities',
      '=CurrentLiabilities',
      '+***LiabilitiesCurrent',
      '+****AccountsPayableAndAccruedLiabilitiesCurrent',
      '+****DebtCurrent',
      '+*****ShortTermBorrowings',
      '+*****LongTermDebtAndCapitalLeaseObligationsCurrent',
      '+****DeferredRevenueAndCreditsCurrent',
      '+****DeferredTaxLiabilitiesCurrent',
      '=NoncurrentLiabilities',
      '+***LiabilitiesNoncurrent',
      '+****LongTermDebtAndCapitalLeaseObligations',
      '+*****LongTermDebtNoncurrent',
      '+*****CapitalLeaseObligationsNoncurrent',
      '+****LiabilitiesOtherThanLongtermDebtNoncurrent',
      '+*****DeferredTaxLiabilitiesNoncurrent',
      '=CommitmentsAndContingencies',
      '+**CommitmentsAndContingencies',
      '=ShareholdersEquity',
      '+**StockholdersEquityIncludingPortionAttributableToNoncontrollingInterest',
      '+***AccumulatedOtherComprehensiveIncomeLossNetOfTax',
      '+***StockholdersEquity',
      '+****PreferredStockValue',
      '+****CommonStockValue',
      '+****AdditionalPaidInCapital',
      '+*****AdditionalPaidInCapitalCommonStock',
      '+*****AdditionalPaidInCapitalPreferredStock',
      '+****RetainedEarningsAccumulatedDeficit',
      '+***MinorityInterest',
    ];
  }

   // items to deprecate
     // +****CashAndCashEquivalentsAtCarryingValue
     // +****ShortTermInvestments
     // +****RestrictedCashAndInvestmentsCurrent

  public static get INCOME_STATEMENT_SECTION_SCHEMA_V2(): any {
    return [
      '+*NetIncomeLossAvailableToCommonStockholdersBasic',
      '+**ProfitLoss',
      '+***IncomeLossFromContinuingOperationsIncludingPortionAttributableToNoncontrollingInterest',
      '+****IncomeLossFromContinuingOperationsBeforeIncomeTaxesExtraordinaryItemsNoncontrollingInterest',
      '=OperatingIncome',
      '+*****OperatingIncomeLoss',
      '+******GrossProfit',
      '+*******Revenues',
      '-*******CostOfRevenue',
      '=OperatingExpenses',
      '-******OperatingExpenses',
      '-*******DepreciationAndAmortization',
      '-*******SellingGeneralAndAdministrativeExpense',
      '+*******GainLossOnSaleOfPropertyPlantEquipment',
      '=NonoperatingIncome',
      '+*****NonoperatingIncomeExpense',
      '-******InterestAndDebtExpense',
      '+******InvestmentIncomeNonoperating',
      '+******IncomeLossFromEquityMethodInvestments',
      '-****IncomeTaxExpenseBenefit',
      '-****ExtraordinaryItemNetOfTax',
      '-***NetIncomeLossAttributableToNoncontrollingInterest',
      '+**IncomeLossFromDiscontinuedOperationsNetOfTax',
      '-**PreferredStockDividendsAndOtherAdjustments',
    ];
  }

  // When display, chage NonoperatingIncomeExpense to Investment Income and interest expense

  public static get CASH_FLOW_STATEMENT_SECTION_SCHEMA_V2(): any {
    return [
      '+*CashAndCashEquivalentsPeriodIncreaseDecrease',
      '=CashProvidedByUsedInOperatingActivities',
      '+**NetCashProvidedByUsedInOperatingActivities',
      '+***NetCashProvidedByUsedInOperatingActivitiesContinuingOperations',
      '+****ProfitLoss',
      '+****AdjustmentsNoncashItemsToReconcileNetIncomeLossToCashProvidedByUsedInOperatingActivities',
      '+*****DepreciationDepletionAndAmortization',
      '+*****AccretionExpenseIncludingAssetRetirementObligations',
      '-*****RecognitionOfDeferredRevenue',
      '+*****InventoryWriteDown',
      '-*****GainLossOnSaleOfPropertyPlantEquipment',
      '-*****GainLossOnInvestments',
      '-*****IncomeLossFromEquityMethodInvestmentsNetOfDividendsOrDistributions',
      '+****IncreaseDecreaseInOperatingCapital',
      '-*****IncreaseDecreaseInOperatingAssets',
      '+*****IncreaseDecreaseInOperatingLiabilities',
      '+*****IncreaseDecreaseInIncomeTaxesPayableNetOfIncomeTaxesReceivable',
      '=CashProvidedByUsedInInvestingActivities',
      '+**NetCashProvidedByUsedInInvestingActivities',
      '+***NetCashProvidedByUsedInInvestingActivitiesContinuingOperations',
      '-****PaymentsForProceedsFromProductiveAssets',
      '-****PaymentsForProceedsFromInvestments',
      '-****PaymentsForProceedsFromBusinessesAndInterestInAffiliates',
      '+****ProceedsFromEquityMethodInvestmentDividendsOrDistributionsReturnOfCapital',
      '=CashProvidedByUsedInFinancingActivities',
      '+**NetCashProvidedByUsedInFinancingActivities',
      '+***NetCashProvidedByUsedInFinancingActivitiesContinuingOperations',
      '+****ProceedsFromRepaymentsOfDebt',
      '-****PaymentsForProceedsFromHedgeFinancingActivities',
      '-****PaymentsForProceedsFromDerivativeInstrumentFinancingActivities',
      '+****ProceedsFromPaymentsToMinorityShareholders',
      '+****ProceedsFromRepurchaseOfRedeemablePreferredStock',
      '+*****ProceedsFromIssuanceOfRedeemablePreferredStock',
      '-*****PaymentsForRepurchaseOfRedeemablePreferredStock',
      '+****ProceedsFromRepurchaseOfEquity',
      '+*****ProceedsFromIssuanceOrSaleOfEquity',
      '-*****PaymentsForRepurchaseOfEquity',
      '-****PaymentsOfDividends',
      '+**EffectOfExchangeRateOnCashAndCashEquivalents',
    ];
  }

  public static get BALANCE_SHEET_SECTION_SCHEMA_HASH(): any {
    return {
      '=Assets': 'Assets',
      '+*Assets': 'Total Assets',
      '=CurrentAssets': 'Current Assets',
      '+**AssetsCurrent': 'Total Current Assets',
      '+***CashCashEquivalentsAndShortTermInvestments': 'Cash, Cash Equivalents and Short-term Investments',
      '+****CashAndCashEquivalentsAtCarryingValue': 'Cash and Cash Equivalents',
      '+****ShortTermInvestments': 'Short-term Investments',
      '+****RestrictedCashAndInvestmentsCurrent': 'Restricted Cash and Short-term Investments',
      '+***ReceivablesNetCurrent': 'Net Receivables',
      '+***InventoryNet': 'Net Inventory',
      '+***DeferredTaxAssetsLiabilitiesNetCurrent': 'Net Deferred Tax Assets/Liabilities',
      '=NoncurrentAssets': 'Noncurrent Assets',
      '+**AssetsNoncurrent': 'Total Noncurrent Assets',
      '+***PropertyPlantAndEquipmentNet': 'Net Property, Plant and Equipment',
      '+****PropertyPlantAndEquipmentGross': 'Gross Property, Plant and Equipment',
      '-****AccumulatedDepreciationDepletionAndAmortizationPropertyPlantAndEquipment': 'Accumulated Depreciation and Amortization',
      '+***LongTermInvestmentsAndReceivablesNet': 'Net Long-term Investments and Receivables',
      '+***Goodwill': 'Goodwill',
      '+***IntangibleAssetsNetExcludingGoodwill': 'Net Intangible Assets',
      '+***DeferredTaxAssetsLiabilitiesNetNoncurrent': 'Noncurrent Net Deferred Tax Assets/Liabilities',
      '=LiabilitiesAndShareholdersEquity': 'Liabilities and Shareholders\' Equity',
      '+*LiabilitiesAndStockholdersEquity': 'Total Liabilities and Shareholders\' Equity',
      '=Liabilities': 'Liabilities',
      '+**Liabilities': 'Total Liabilities',
      '=CurrentLiabilities': 'Current Liabilities',
      '+***LiabilitiesCurrent': 'Total Current Liabilities',
      '+****AccountsPayableAndAccruedLiabilitiesCurrent': 'Accounts Payable and Other Accrued Liabilities',
      '+****DebtCurrent': 'Total Current Debt',
      '+*****ShortTermBorrowings': 'Short-term Borrowings',
      '+*****LongTermDebtAndCapitalLeaseObligationsCurrent': 'Current Portion of Long-term Debt and Capital Lease Obligation',
      '+****DeferredRevenueAndCreditsCurrent': 'Deferred Revenue and Credits',
      '+****DeferredTaxLiabilitiesCurrent': 'Deferred Tax Liabilities',
      '=NoncurrentLiabilities': 'Noncurrent Liabilities',
      '+***LiabilitiesNoncurrent': 'Total Noncurrent Liabilities',
      '+****LongTermDebtAndCapitalLeaseObligations': 'Total Long-term Debt and Capital Lease Obligation (ex Current Portion)',
      '+*****LongTermDebtNoncurrent': 'Long-term Debt (ex Current Portion)',
      '+*****CapitalLeaseObligationsNoncurrent': 'Capital Lease Obligation (ex Current Portion)',
      '+****LiabilitiesOtherThanLongtermDebtNoncurrent': 'Noncurrent Liabilities Other Than Long-term Debt',
      '+*****DeferredTaxLiabilitiesNoncurrent': 'Noncurrent Deferred Tax Liabilities',
      '=CommitmentsAndContingencies': 'Commitments and Contingencies',
      '+**CommitmentsAndContingencies': 'Commitments and Contingencies',
      '=ShareholdersEquity': 'Shareholders\' Equity',
      '+**StockholdersEquityIncludingPortionAttributableToNoncontrollingInterest': 'Shareholders\' Equity (Including Noncontrolling Interest)',
      '+***AccumulatedOtherComprehensiveIncomeLossNetOfTax': 'Accumulated Other Comprehensive Income (Net of Tax)',
      '+***StockholdersEquity': 'Shareholders\' Equity',
      '+****PreferredStockValue': 'Preferred Stock',
      '+****CommonStockValue': 'Common Stock',
      '+****AdditionalPaidInCapital': 'Additional Paid in Capital',
      '+*****AdditionalPaidInCapitalCommonStock': 'Additional Paid in Capital for Common Stock',
      '+*****AdditionalPaidInCapitalPreferredStock': 'Additional Paid in Capital for Preferred Stock',
      '+****RetainedEarningsAccumulatedDeficit': 'Retained Earnings',
      '+***MinorityInterest': 'Minority Interest'
    };
  }

  public static get INCOME_STATEMENT_SECTION_SCHEMA_HASH(): any {
    return {
      '+*NetIncomeLossAvailableToCommonStockholdersBasic': 'Net Income/Loss Available to Common Stockholders',
      '+**ProfitLoss': 'Net Income/Loss',
      '+***IncomeLossFromContinuingOperationsIncludingPortionAttributableToNoncontrollingInterest': 'Income/Loss from Continuing Operations',
      '+****IncomeLossFromContinuingOperationsBeforeIncomeTaxesExtraordinaryItemsNoncontrollingInterest': 'Income/Loss from Operations before Extraordinary Items',
      '=OperatingIncome': 'Operating Income',
      '+*****OperatingIncomeLoss': 'Total Operating Income/Loss',
      '+******GrossProfit': 'Gross Profit',
      '+*******Revenues': 'Revenues',
      '-*******CostOfRevenue': 'Cost of Revenues',
      '=OperatingExpenses': 'Operating Expenses',
      '-******OperatingExpenses': 'Total Operating Expenses',
      '-*******DepreciationAndAmortization': 'Depreciation and Amortization',
      '-*******SellingGeneralAndAdministrativeExpense': 'Selling, General and Administrative Expense',
      '+*******GainLossOnSaleOfPropertyPlantEquipment': 'Gain/Loss on Disposal of Property, Plant and Equipment',
      '=NonoperatingIncome': 'Nonoperating Income',
      '+*****NonoperatingIncomeExpense': 'Total Nonoperating Income',
      '-******InterestAndDebtExpense': 'Interest and Debt Expense',
      '+******InvestmentIncomeNonoperating': 'Interest and Other Income',
      '+******IncomeLossFromEquityMethodInvestments': 'Income/Loss from Equity Method Investment',
      '-****IncomeTaxExpenseBenefit': 'Income Taxes',
      '-****ExtraordinaryItemNetOfTax': 'Extraordinary Items (Net of Tax)',
      '-***NetIncomeLossAttributableToNoncontrollingInterest': 'Net Income/Loss Attributable to Noncontrolling Interest',
      '+**IncomeLossFromDiscontinuedOperationsNetOfTax': 'Income/Loss from Discontinued Operations',
      '-**PreferredStockDividendsAndOtherAdjustments': 'Preferred Stock Dividends and Other Adjustments',
      '*EarningsPerShareBasicAndDiluted': 'Earnings Per Share Basic And Diluted',
      '**IncomeLossFromExtraordinaryItemsNetOfTaxPerBasicAndDilutedShare': 'Income/Loss From Extraordinary Items (Net Of Tax) Per Basic And Diluted Share',
      '**IncomeLossFromOperationsBeforeExtraordinaryItemsPerBasicAndDilutedShare':
        'Income/Loss From Operations Before Extraordinary Items Per Basic And Diluted Share',
      '***IncomeLossFromContinuingOperationsPerBasicAndDilutedShare':
        'Income/Loss From Continuing Operations Per Basic And Diluted Share',
      '***IncomeLossFromDiscontinuedOperationsNetOfTaxPerBasicAndDilutedShare': 'Income/Loss From Discontinued Operations (Net Of Tax) Per Basic And Diluted Share',
      '*EarningsPerShareBasic': 'Earnings Per Share Basic',
      '**IncomeLossFromExtraordinaryItemsNetOfTaxPerBasicShare': 'Income/Loss From Extraordinary Items (Net Of Tax) Per Basic Share',
      '**IncomeLossBeforeExtraordinaryItemsAndCumulativeEffectOfChangeInAccountingPrinciplePerBasicShare':
        'Income/Loss Before Extraordinary Items And Cumulative Effect Of Change In Accounting Principle Per Basic Share',
      '***IncomeLossFromContinuingOperationsPerBasicShare': 'IncomeLossFromContinuingOperationsPerBasicShare',
      '***IncomeLossFromDiscontinuedOperationsNetOfTaxPerBasicShare': 'Income/Loss From Discontinued Operations (Net Of Tax) Per Basic Share',
      '*EarningsPerShareDiluted': 'Earnings Per Share Diluted',
      '**IncomeLossFromExtraordinaryItemsNetOfTaxPerDilutedShare': 'Income/Loss From Extraordinary Items (Net Of Tax) Per Diluted Share',
      '**IncomeLossBeforeExtraordinaryItemsAndCumulativeEffectOfChangeInAccountingPrinciplePerDilutedShare':
        'Income/Loss Before Extraordinary Items And Cumulative Effect Of Change In Accounting Principle Per Diluted Share',
      '***IncomeLossFromContinuingOperationsPerDilutedShare': 'Income/Loss From Continuing Operations Per Diluted Share',
      '***IncomeLossFromDiscontinuedOperationsNetOfTaxPerDilutedShare': 'Income Loss From Discontinued Operations (Net Of Tax) Per Diluted Share',
    };
  }
  // When display, change NonoperatingIncomeExpense to Investment Income and interest expense

  public static get CASH_FLOW_STATEMENT_SECTION_SCHEMA_HASH(): any {
    return {
      '@*CashAndCashEquivalentsAtCarryingValue': 'Cash and Cash Equivalents',
      '+*CashAndCashEquivalentsPeriodIncreaseDecrease': 'Increase/Decrease in Cash for the Period',
      '=CashProvidedByUsedInOperatingActivities': 'Cash from Operating Activities',
      '+**NetCashProvidedByUsedInOperatingActivities': 'Net Cash from Operating Activities',
      '+***NetCashProvidedByUsedInOperatingActivitiesContinuingOperations': 'Net Cash from Operating Activities (Continuing Operations)',
      '+****ProfitLoss': 'Net Income/Loss',
      '+****AdjustmentsNoncashItemsToReconcileNetIncomeLossToCashProvidedByUsedInOperatingActivities': 'Total Adjustments to Reconcile Net Income/Loss to Cash from Operating Activities',
      '+*****DepreciationDepletionAndAmortization': 'Depreciation and Amortization',
      '+*****AccretionExpenseIncludingAssetRetirementObligations': 'Accretion Expense',
      '-*****RecognitionOfDeferredRevenue': 'Recognition of Deferred Revenues',
      '+*****InventoryWriteDown': 'Inventory Write Down',
      '-*****GainLossOnSaleOfPropertyPlantEquipment': 'Disposal of Property, Plant and Equipment',
      '-*****GainLossOnInvestments': 'Gain/Loss on Investments',
      '-*****IncomeLossFromEquityMethodInvestmentsNetOfDividendsOrDistributions': 'Income/Loss from Equity Method Investment',
      '+****IncreaseDecreaseInOperatingCapital': 'Total Change in Working Capital',
      '-*****IncreaseDecreaseInOperatingAssets': 'Change in Operating Assets',
      '+*****IncreaseDecreaseInOperatingLiabilities': 'Change in Operating Liabilities',
      '+*****IncreaseDecreaseInIncomeTaxesPayableNetOfIncomeTaxesReceivable': 'Net Change in Income Taxes Payable',
      '=CashProvidedByUsedInInvestingActivities': 'Cash from Investing Activities',
      '+**NetCashProvidedByUsedInInvestingActivities': 'Net Cash from Investing Activities',
      '+***NetCashProvidedByUsedInInvestingActivitiesContinuingOperations': 'Net Cash from Investing Activities (Continuing Operations)',
      '-****PaymentsForProceedsFromProductiveAssets': 'Payments for Productive Assets',
      '-****PaymentsForProceedsFromInvestments': 'Payments for Investments',
      '-****PaymentsForProceedsFromBusinessesAndInterestInAffiliates': 'Payments for Businesses and Interests in Affiliates',
      '+****ProceedsFromEquityMethodInvestmentDividendsOrDistributionsReturnOfCapital': 'Proceeds from Equity Method Investment',
      '=CashProvidedByUsedInFinancingActivities': 'Cash from Investing Activities',
      '+**NetCashProvidedByUsedInFinancingActivities': 'Net Cash from Financing Activities',
      '+***NetCashProvidedByUsedInFinancingActivitiesContinuingOperations': 'Net Cash from Financing Activities (Continuing Operations)',
      '+****ProceedsFromRepaymentsOfDebt': 'Net Proceeds from / Repayments of Debt',
      '-****PaymentsForProceedsFromHedgeFinancingActivities': 'Net Payments for Hedging',
      '-****PaymentsForProceedsFromDerivativeInstrumentFinancingActivities': 'Net Payments for Derivative Instruments',
      '+****ProceedsFromPaymentsToMinorityShareholders': 'Net Proceeds from Minority Shareholders',
      '+****ProceedsFromRepurchaseOfRedeemablePreferredStock': 'Net Proceeds from Redeemable Preferred Stock',
      '+*****ProceedsFromIssuanceOfRedeemablePreferredStock': 'Issuances of Redeemable Preferred Stock',
      '-*****PaymentsForRepurchaseOfRedeemablePreferredStock': 'Repurchases of Redeemable Preferred Stock',
      '+****ProceedsFromRepurchaseOfEquity': 'Net Proceeds from Common Equity Repurchases/Issuances',
      '+*****ProceedsFromIssuanceOrSaleOfEquity': 'Proceeds from Issuances of Common Equity',
      '-*****PaymentsForRepurchaseOfEquity': 'Payments for Repurchases of Common Equity',
      '-****PaymentsOfDividends': 'Dividend Payments',
      '+**EffectOfExchangeRateOnCashAndCashEquivalents': 'Effects of Exchange Rates',
    };
  }

  // TODO : may use IncomeLose instead of ProfitLoss, may use DepreciationAndAmortization
  // TODO : add cash at beginning of period and ending of period
  public static get CASH_FLOW_STATEMENT_SECTION_SCHEMA(): any {
    return [
      '+*CashAndCashEquivalentsPeriodIncreaseDecrease',
      '=CashProvidedByUsedInOperatingActivities',
      '+**NetCashProvidedByUsedInOperatingActivities',
      '+***NetCashProvidedByUsedInOperatingActivitiesContinuingOperations',
      '+****ProfitLoss',
      '+****ExtraordinaryItemNetOfTax',
      '+****IncomeLossFromDiscontinuedOperationsNetOfTax',
      '+****AdjustmentsToReconcileNetIncomeLossToCashProvidedByUsedInOperatingActivities',
      '+*****AdjustmentsNoncashItemsToReconcileNetIncomeLossToCashProvidedByUsedInOperatingActivities',
      '+******DepreciationDepletionAndAmortization',
      '+******AccretionExpenseIncludingAssetRetirementObligations',
      '-******RecognitionOfDeferredRevenue',
      '+******InventoryWriteDown',
      '-******ForeignCurrencyTransactionGainLossUnrealized',
      '-******GainLossOnSaleOfPropertyPlantEquipment',
      '-******GainLossOnInvestments',
      '-******IncomeLossFromEquityMethodInvestmentsNetOfDividendsOrDistributions',
      '+*****IncreaseDecreaseInOperatingCapital',
      '-******IncreaseDecreaseInOperatingAssets',
      '-*******IncreaseDecreaseInReceivables',
      '-*******IncreaseDecreaseInInventories',
      '+******IncreaseDecreaseInOperatingLiabilities',
      '+*******IncreaseDecreaseInAccountsPayableAndAccruedLiabilities',
      '+*******IncreaseDecreaseInDeferredRevenueAndCustomerAdvancesAndDeposits',
      '+******IncreaseDecreaseInIncomeTaxesPayableNetOfIncomeTaxesReceivable',
      '+*****OtherOperatingActivitiesCashFlowStatement',
      '+***CashProvidedByUsedInOperatingActivitiesDiscontinuedOperations',
      '=CashProvidedByUsedInInvestingActivities',
      '+**NetCashProvidedByUsedInInvestingActivities',
      '+***NetCashProvidedByUsedInInvestingActivitiesContinuingOperations',
      '-****PaymentsForProceedsFromProductiveAssets',
      '-****PaymentsForProceedsFromInvestments',
      '-****PaymentsForProceedsFromBusinessesAndInterestInAffiliates',
      '+****ProceedsFromEquityMethodInvestmentDividendsOrDistributionsReturnOfCapital',
      '+***CashProvidedByUsedInInvestingActivitiesDiscontinuedOperations',
      '=CashProvidedByUsedInFinancingActivities',
      '+**NetCashProvidedByUsedInFinancingActivities',
      '+***NetCashProvidedByUsedInFinancingActivitiesContinuingOperations',
      '+****ProceedsFromRepaymentsOfDebt',
      '-****PaymentsForProceedsFromHedgeFinancingActivities',
      '-****PaymentsForProceedsFromDerivativeInstrumentFinancingActivities',
      '+****ProceedsFromPaymentsToMinorityShareholders',
      '+****ProceedsFromRepurchaseOfRedeemablePreferredStock',
      '+*****ProceedsFromIssuanceOfRedeemablePreferredStock',
      '-*****PaymentsForRepurchaseOfRedeemablePreferredStock',
      '+****ProceedsFromRepurchaseOfEquity',
      '+*****ProceedsFromIssuanceOrSaleOfEquity',
      '-*****PaymentsForRepurchaseOfEquity',
      '-****PaymentsOfDividends',
      '+***CashProvidedByUsedInFinancingActivitiesDiscontinuedOperations',
      '+**EffectOfExchangeRateOnCashAndCashEquivalents',
    ];
  }

  // items to deprecate:
    // +***NetCashProvidedByUsedInOperatingActivitiesContinuingOperations
    // +***CashProvidedByUsedInOperatingActivitiesDiscontinuedOperations

    // +***NetCashProvidedByUsedInInvestingActivitiesContinuingOperations
    // +***CashProvidedByUsedInInvestingActivitiesDiscontinuedOperations

    // +***NetCashProvidedByUsedInFinancingActivitiesContinuingOperations
    // +***CashProvidedByUsedInFinancingActivitiesDiscontinuedOperations

  public static get INCOME_STATEMENT_SECTION_SCHEMA(): any {
    return [
      '+*NetIncomeLossAvailableToCommonStockholdersBasic',
      '+**NetIncomeLoss',
      '+***ProfitLoss',
      '+****IncomeLossBeforeExtraordinaryItemsAndCumulativeEffectOfChangeInAccountingPrinciple',
      '+*****IncomeLossFromContinuingOperationsIncludingPortionAttributableToNoncontrollingInterest',
      '+******IncomeLossFromContinuingOperationsBeforeIncomeTaxesExtraordinaryItemsNoncontrollingInterest',
      '+*******IncomeLossFromContinuingOperationsBeforeIncomeTaxesMinorityInterestAndIncomeLossFromEquityMethodInvestments',
      '=OperatingIncome',
      '+********OperatingIncomeLoss',
      '+*********GrossProfit',
      '+**********Revenues',
      '-**********CostOfRevenue',
      '=OperatingExpenses',
      '-*********OperatingExpenses',
      '-**********OperatingCostsAndExpenses',
      '-***********DepreciationAndAmortization',
      '-**********SellingGeneralAndAdministrativeExpense',
      '+**********GainLossOnSaleOfPropertyPlantEquipment',
      '=NonoperatingIncome',
      '+********NonoperatingIncomeExpense',
      '+*********InvestmentIncomeNonoperating',
      '-*********InterestAndDebtExpense',
      '+*******IncomeLossFromEquityMethodInvestments',
      '-******IncomeTaxExpenseBenefit',
      '+*****IncomeLossFromDiscontinuedOperationsNetOfTax',
      '-****ExtraordinaryItemNetOfTax',
      '-***NetIncomeLossAttributableToNoncontrollingInterest',
      '-**PreferredStockDividendsAndOtherAdjustments',
    ];
  }

  public static get INCOME_STATEMENT_SECTION_SCHEMA_TO_DISPLAY(): any {
    return [
      '*********Revenues',
      '*********CostOfRevenue',
      '********GrossProfit',
      '*********OperatingCostsAndExpenses',
      '**********DepreciationAndAmortization',
      '*********SellingGeneralAndAdministrativeExpense',
      '*********GainLossOnSaleOfPropertyPlantEquipment',
      '********OperatingExpenses',
      '*******OperatingIncomeLoss',
      '********InvestmentIncomeNonoperating',
      '********InterestAndDebtExpense',
      '*******NonoperatingIncomeExpense',
      '******IncomeLossFromContinuingOperationsBeforeIncomeTaxesMinorityInterestAndIncomeLossFromEquityMethodInvestments',
      '******IncomeLossFromEquityMethodInvestments',
      '*****IncomeLossFromContinuingOperationsBeforeIncomeTaxesExtraordinaryItemsNoncontrollingInterest',
      '*****IncomeTaxExpenseBenefit',
      '****IncomeLossFromContinuingOperationsIncludingPortionAttributableToNoncontrollingInterest',
      '****IncomeLossFromDiscontinuedOperationsNetOfTax',
      '***IncomeLossBeforeExtraordinaryItemsAndCumulativeEffectOfChangeInAccountingPrinciple',
      '***ExtraordinaryItemNetOfTax',
      '**ProfitLoss',
      '**NetIncomeLossAttributableToNoncontrollingInterest',
      '*NetIncomeLoss',
      '*PreferredStockDividendsAndOtherAdjustments',
      'NetIncomeLossAvailableToCommonStockholdersBasic',
    ];
  }

  public static get STATEMENT_CATEGORIZER_GRAMMER(): any {
    return {
      balanceSheet: {
        add: 1001,
        statementType: 'sfp',
        industry: 'ci',
        standardStatementId: 1,
        typeExtension: 'cls',
        matches: [
          {
            w: 'balance sheet',
          },
          {
            w: 'condition',
          },
          {
            w: 'position',
          },
          {
            w: ['assets', 'liabilities', 'shareholder'],
          },
        ]
      },
      incomeStatement: {
        add: 2001,
        statementType: 'soi',
        industry: 'ci',
        standardStatementId: 2,
        typeExtension: null,
        matches: [
          {
            w: ['operation', 'comprehensive'],
          },
          {
            w: ['income', 'comprehensive'],
            wo: 'equity',
          },
          {
            w: ['earning', 'comprehensive'],
            wo: 'retained',
          },
        ],
      },
      cashFlowStatement: {
        add: 3001,
        statementType: 'scf',
        industry: 'ci',
        standardStatementId: 3,
        typeExtension: 'indir',
        matches: [
          {
            w: ['cash flow'],
          },
        ],
      },
      changeInEquityStatement: {
        add: 4001,
        statementType: 'sheci',
        industry: 'ci',
        standardStatementId: 4,
        typeExtension: null,
        matches: [
          {
            w: ['equity'],
          },
          {
            w: ['capital'],
          },
          {
            w: ['deficit'],
          },
        ],
      },
      comprehensiveIncomeStatement: {
        add: 5001,
        statementType: 'soc',
        industry: 'ci',
        standardStatementId: 5,
        typeExtension: null,
        matches: [
          {
            w: 'operation',
            wo: 'comprehensive',
          },
          {
            w: 'income',
            wo: ['equity', 'comprehensive'],
          },
          {
            w: 'earning',
            wo: ['retained', 'comprehensive'],
          },
        ],
      },
      parentheticalStatement: {
        add: 100,
        isParenthetical: true,
        matches: [
          {
            w: ['parenthetical'],
          },
        ],
      },
      calc2Statement: {
        add: 10,
        isCalc2: true,
        matches: [
          {
            w: ['calc2'],
          },
        ],
      }
    };
  }
  // tables
  // details
  // details 1
  // details textual
  // parenthetical
  // disclosure
  // policies

  // section_schema = EdgarStatementItemCategorizer::BALANCE_SHEET_SECTION_SCHEMA_HASH
  // parenthetical = statement_categorization.values.first == 1101 ? true : false

  // section_schema = EdgarStatementItemCategorizer::INCOME_STATEMENT_SECTION_SCHEMA_HASH
  // parenthetical = statement_categorization.values.first == 2101 ? true : false

  // section_schema = EdgarStatementItemCategorizer::CASH_FLOW_STATEMENT_SECTION_SCHEMA_HASH
  // parenthetical = statement_categorization.values.first == 3101 ? true : false

  // section_schema = EdgarStatementItemCategorizer::SHAREHOLDERS_EQUITY_STATEMENT_SECTION_SCHEMA
  // component_schema = EdgarStatementItemCategorizer::TEST_EQUITY_COMPONENT_SCHEMA
  // parenthetical = statement_categorization.values.first == 4101 ? true : false

  // # section_schema = EdgarStatementItemCategorizer::COMPREHENSIVE_INCOME_STATEMENT_SECTION_SCHEMA
  // # standard_statement_class = ComprehensiveIncomeStatement

  public static categorizeStatement(definition): any {
    let statementCategoryObj = {coreStatement: 0, statementCategory: 0};
    let lowerDefinition = definition.toLowerCase();
    let pieces = lowerDefinition.split('-');
    if (pieces[1] && pieces[1].toLowerCase().match(/statement/)) {
      statementCategoryObj.coreStatement = 1;
    }

    // Object.keys(XbrlVStatementUtility.STATEMENT_CATEGORIZER_GRAMMER).forEach()
    // if (statementCategoryObj.coreStatement) {
    //   if (XbrlUtility.BALANCE_SHEET_TERMS.some((terms) => {
    //     return XbrlUtility.isArray(terms) ? terms.every((term) => lowerDefinition.match(new RegExp(term))) : lowerDefinition.match(new RegExp(terms));
    //   }) {
    //     statementCategoryObj.statementCategory = statementCategoryObj.statementCategory + 1001;
    //   }
    // }
  }
}
