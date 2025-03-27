# Finance App

A comprehensive Next.js application for personal finance management, budgeting, and investment planning.

## Features

- **Interactive Dashboard**: Visualize your financial data at a glance
- **Budget Management**: Track and manage your monthly budget with BudgetProvider
- **Budget History**: View and analyze your spending history over time
- **Investment Calculator**: Plan your investments and see potential returns
- **Savings Calculator**: Set goals and calculate your savings trajectory
- **Yearly Analysis**: Get detailed insights into your annual financial patterns
- **Dark/Light Theme**: Choose your preferred appearance with ThemeProvider

## Tech Stack

- **Framework**: Next.js with App Router
- **Frontend**: React
- **Styling**: Custom UI components with tabs and layouts
- **State Management**: Context API for budget management
- **Performance**: Server and client components for optimal rendering

## Getting Started

```bash
# Clone the repository
git clone https://github.com/yourusername/finance-app.git

# Navigate to project directory
cd finance-app

# Install dependencies
npm install

# Run the development server
npm run dev
```

## Project Structure

- `/app`: Next.js app router pages and layouts
- `/components`:
  - `budget-context.tsx`: Budget state management
  - `budget-history.tsx`: Historical budget visualization
  - `dashboard.tsx`: Main overview interface
  - `investment-calculator.tsx`: Investment planning tools
  - `savings-calculator.tsx`: Savings goal calculator
  - `yearly-analysis.tsx`: Annual financial reports
  - `theme-provider.tsx`: Dark/light mode functionality
  - `/ui`: Reusable UI components like tabs

## Future Enhancements

- Mobile application
- Expense categorization with AI
- Financial advice based on spending patterns
- Integration with banking APIs

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For support or inquiries, please open an issue in the GitHub repository.
