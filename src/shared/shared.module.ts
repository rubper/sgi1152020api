import { Global, Module } from '@nestjs/common';
import { AccountService } from './services/account.service';
import { BudgetService } from './services/budget.service';
import { ConfigurationService } from './services/configuration.service';
import { DebtService } from './services/debt.service';
import { ExpectedTransactionService } from './services/expected-transaction.service';
import { FinancialStateService } from './services/financial-state.service';
import { KeyHashService } from './services/key-hash.service';
import { RoleService } from './services/role.service';
import { TermService } from './services/term.service';
import { ThemePreferenceService } from './services/theme-preference.service';
import { TransactionDetailService } from './services/transaction-detail.service';
import { TransactionHistoryService } from './services/transaction-history.service';
import { TransactionService } from './services/transaction.service';
import { UserProfileService } from './services/user-profile.service';
import { UserService } from './services/user.service';

@Global()
@Module({
  exports: [
    AccountService,
    BudgetService,
    ConfigurationService,
    DebtService,
    ExpectedTransactionService,
    FinancialStateService,
    KeyHashService,
    RoleService,
    TermService,
    ThemePreferenceService,
    TransactionDetailService,
    TransactionHistoryService,
    TransactionService,
    UserProfileService,
    UserService,
  ],
  providers: [
    AccountService,
    BudgetService,
    ConfigurationService,
    DebtService,
    ExpectedTransactionService,
    FinancialStateService,
    KeyHashService,
    RoleService,
    TermService,
    ThemePreferenceService,
    TransactionDetailService,
    TransactionHistoryService,
    TransactionService,
    UserProfileService,
    UserService,
  ]
})
export class SharedModule {}
