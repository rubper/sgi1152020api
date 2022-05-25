import { Module } from '@nestjs/common';
import { GraphQLUUID } from 'shared/graphql/scalar-types/uuid.gql-type';
import { AccountResolver } from './account.resolver';
import { BudgetResolver } from './budget.resolver';
import { ConfigurationResolver } from './configuration.resolver';
import { DebtResolver } from './debt.resolver';
import { ExpectedTransactionResolver } from './expected-transaction.resolver';
import { FinancialStateResolver } from './financial-state.resolver';
import { KeyHashResolver } from './key-hash.resolver';
import { RoleResolver } from './role.resolver';
import { TermResolver } from './term.resolver';
import { ThemePreferenceResolver } from './theme-preference.resolver';
import { TransactionDetailResolver } from './transaction-detail.resolver';
import { TransactionHistoryResolver } from './transaction-history.resolver';
import { TransactionResolver } from './transaction.resolver';
import { UserProfileResolver } from './user-profile.resolver';
import { UserResolver } from './user.resolver';

@Module({
  exports: [
    AccountResolver,
    BudgetResolver,
    ConfigurationResolver,
    DebtResolver,
    ExpectedTransactionResolver,
    FinancialStateResolver,
    KeyHashResolver,
    RoleResolver,
    TermResolver,
    ThemePreferenceResolver,
    TransactionDetailResolver,
    TransactionHistoryResolver,
    TransactionResolver,
    UserProfileResolver,
    UserResolver,
  ],
  providers: [
    AccountResolver,
    BudgetResolver,
    ConfigurationResolver,
    DebtResolver,
    ExpectedTransactionResolver,
    FinancialStateResolver,
    KeyHashResolver,
    RoleResolver,
    TermResolver,
    ThemePreferenceResolver,
    TransactionDetailResolver,
    TransactionHistoryResolver,
    TransactionResolver,
    UserProfileResolver,
    UserResolver,
    GraphQLUUID,
  ],
})
export class GraphQLResolversModule {}
