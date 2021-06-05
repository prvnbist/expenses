## Expenses App

> A self-hosted app built with Hasura/Postgres, NextJS/React, Apollo Client/GraphQL.

#### Features

##### Transactions

![Transactions](https://res.cloudinary.com/prvnbist/image/upload/v1622888920/expenses/transactions.png 'Transactions')

-  [x] Transactions CRUD.
-  [x] Listing of all credit/debit transactions in one place.
-  [x] Filter by global search, category, payment method and account.
-  [x] Sort by title, date, debit, credit, category, payment method and account. Multiple sort by is also supported.
-  [x] Aggregate analytics for filtered transaction.
-  [x] Pagination and go to page.
-  [x] Delete multiple transactions at once.
-  [ ] Batch edit functionality.

##### Accounts

![Accounts](https://res.cloudinary.com/prvnbist/image/upload/v1622889493/expenses/accounts.png 'Accounts')

-  [x] Accounts CRUD.
-  [x] Total expenses per account.
-  [x] Total income per account.
-  [x] Balance remaining.
-  [x] Balance auto update on adding/updating/deleting transactions.

##### Reports

![Reports](https://res.cloudinary.com/prvnbist/image/upload/v1622889793/expenses/reports.png 'Reports')

-  [x] View monthly expenses by year.
-  [x] View monthly incomes by year.

##### Analytics

![Analytics](https://res.cloudinary.com/prvnbist/image/upload/v1622889960/expenses/analytics.png 'Analytics')

-  [x] Metrics: total income, total expense, balance remaining.
-  [x] Chart/Table View
   -  [x] Expenses by category, year and month.
   -  [x] Incomes by category, year and month.

#### Contribution

1. Clone the repo locally.

```bash
> git clone https://github.com/prvnbist/expenses.git
```

2. This project uses yarn, to isntall packages run:

```bash
> cd expenses
> yarn
```

3. This project requires graphql endpoint to work. Simply create an `.env` file and add these variables. The endpoint urls provided link the app to graphql api served by hasura.

```
WS_GRAPHQL_ENDPOINT=wss://x-expense.herokuapp.com/v1/graphql
GRAPHQL_ENDPOINT=https://x-expense.herokuapp.com/v1/graphql
```

1. To run the server, use following command and navigate to `localhost:3000` in your browser.

```bash
> yarn dev
```

#### Contact

> Reach out to my [twitter](https://twitter.com/prvnbist 'twitter') or my email: prvnbist@gmail.com for further queries.
