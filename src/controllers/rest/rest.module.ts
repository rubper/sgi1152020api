import { Module } from '@nestjs/common';
import { AccountController } from './account.controller';
import { BudgetController } from './budget.controller';
import { ConfigurationController } from './configuration.controller';
import { DebtController } from './debt.controller';
import { ExpectedTransactionController } from './expected-transaction.controller';
import { FinancialStateController } from './financial-state.controller';
import { KeyHashController } from './key-hash.controller';
import { RoleController } from './role.controller';
import { TermController } from './term.controller';
import { ThemePreferenceController } from './theme-preference.controller';
import { TransactionDetailController } from './transaction-detail.controller';
import { TransactionHistoryController } from './transaction-history.controller';
import { TransactionController } from './transaction.controller';
import { UserProfileController } from './user-profile.controller';
import { UserController } from './user.controller';

/**
 * Module containing the rest controllers
 */
@Module({
  controllers: [
    AccountController,
    BudgetController,
    ConfigurationController,
    DebtController,
    ExpectedTransactionController,
    FinancialStateController,
    KeyHashController,
    RoleController,
    TermController,
    ThemePreferenceController,
    TransactionDetailController,
    TransactionHistoryController,
    TransactionController,
    UserProfileController,
    UserController,
  ],
  exports: [
    AccountController,
    BudgetController,
    ConfigurationController,
    DebtController,
    ExpectedTransactionController,
    FinancialStateController,
    KeyHashController,
    RoleController,
    TermController,
    ThemePreferenceController,
    TransactionDetailController,
    TransactionHistoryController,
    TransactionController,
    UserProfileController,
    UserController,
  ],
  providers: [
    AccountController,
    BudgetController,
    ConfigurationController,
    DebtController,
    ExpectedTransactionController,
    FinancialStateController,
    KeyHashController,
    RoleController,
    TermController,
    ThemePreferenceController,
    TransactionDetailController,
    TransactionHistoryController,
    TransactionController,
    UserProfileController,
    UserController,
  ],
})
export class RestModule {}