# Expense Tracker CLI

A simple command-line application to track and manage personal expenses. Add, update, delete, and view expenses, organize them by category, set monthly budgets with warnings, and export everything to CSV.

## Features

- Add an expense with a description and amount
- Update an existing expense's description, amount, and/or category
- Delete an expense by ID
- View a list of all expenses
- View a summary of total expenses
- View a summary of expenses for a specific month of the current year
- Assign a category to expenses and filter expenses by category
- Set a monthly budget and get warned when you're near or over it
- Update an existing month's budget
- Export all expenses to a CSV file
- Input validation throughout (missing fields, invalid/negative amounts, non-existent IDs, invalid months, duplicate budgets)

## Requirements

- [Node.js](https://nodejs.org/) (v18 or later recommended)

## Installation

No external dependencies are required — the app uses only Node's built-in modules (`fs`, `path`, `url`, `process`).

```bash
git clone https://github.com/Hicham-Hal/Expense-Tracker.git
```

## Usage

Run commands with:

```bash
node index.js <command> [options]
```

Expense data is stored in `data.json` and budgets in `budget.json`, both in the same directory as `index.js`. These files are created automatically the first time you add an expense or set a budget.

### Add an expense

```bash
node index.js add --description "Lunch" --amount 20
# Expense added successfully (ID: 1)
```

```bash
node index.js add --description "Groceries" --amount 45 --category food
```

- `--description` and `--amount` are required.
- `--amount` must be a valid, non-negative number.
- `--category` is optional; defaults to `general` if not provided.
- If a budget is set for the current month, you'll get a warning if this expense pushes you near or over it.

### Update an expense

```bash
node index.js update --id 1 --amount 25
# Expense updated successfully (ID: 1)
```

- `--id` is required.
- `--description`, `--amount`, and `--category` are optional — only the fields you pass are changed.
- `--amount`, if provided, must be a valid, non-negative number.

### List all expenses

```bash
node index.js list
```

```
ID   Date          Description   Amount
1    27-07-2026    Lunch         $25
2    27-07-2026    Dinner        $10
```

### List expenses by category

```bash
node index.js list --category food
```

```
ID  Description   Date          Amount
3   Groceries     27-07-2026    $45
```

### View a summary of all expenses

```bash
node index.js summary
# Total expenses: 35$
```

### View a summary for a specific month (current year)

```bash
node index.js summary --month 7
# Total expenses for July : 35$
```

- `--month` must be a number between 1 and 12.
- Only expenses from the **current year** are included.

### Delete an expense

```bash
node index.js delete --id 2
# Expense deleted successfully
```

- `--id` is required and must match an existing expense.

### Set a monthly budget

```bash
node index.js budget --month 7 --budget 500
```

- `--month` and `--budget` are required.
- `--year` is optional; defaults to the current year.
- Only one budget can be set per month/year — setting a second one for the same month and year returns an error. Use `update-budget` to change it instead.

### Update a monthly budget

```bash
node index.js update-budget --month 7 --budget 700
# Budget updated successfully
```

- `--year` is optional; defaults to the current year.
- Errors if no budget exists yet for that month/year.

### Budget warnings

When adding or updating an expense in a month with a budget set, you may see:
```
Warning: you are almost to reach the limit budget: 30$
```
or
```
Warning: you are acceding the limit budget so this expense would not be added
```
depending on how close to or over the budget the month's total is.

### Export expenses to CSV

```bash
node index.js csv
# Csv file created successfully
```

Creates `exprense.csv` in the project directory with all expenses, including category.

## Error Handling

The app validates input and exits with a clear error message in cases such as:

- Missing required flags (`--description`, `--amount`, `--id`, `--month`, `--budget`, `--category`)
- Negative or non-numeric amounts
- Deleting or updating a non-existent expense ID
- An invalid or out-of-range month (`--month` must be 1–12)
- Setting a budget for a month/year that already has one
- Updating a budget for a month/year that doesn't have one yet
- Exporting to CSV with no expenses to export
- Running an unrecognized command

## Data Storage

**Expenses** are stored as a JSON array in `data.json`:

```json
{
  "id": 1,
  "description": "Lunch",
  "amount": 20,
  "category": "general",
  "date": "27-07-2026"
}
```

**Budgets** are stored as a JSON array in `budget.json`:

```json
{
  "month": 7,
  "budget": 500,
  "year": 2026
}
```

Dates are stored in `DD-MM-YYYY` format.

## Known Limitations

- Dates are stored/displayed as `DD-MM-YYYY` rather than ISO format (`YYYY-MM-DD`)
- CSV export doesn't quote fields, so descriptions containing commas may break the CSV format
- Deleting the highest-ID expense means the next added expense can reuse that same ID number

## Possible Future Improvements

- [ ] Switch to ISO date format
- [ ] Quote/escape CSV fields properly
- [ ] Package as a global CLI command (`expense-tracker`) via `package.json` `bin` field
- [ ] Allow deleting or listing budgets

This projet is from roadmap.sh
https://roadmap.sh/projects/expense-tracker