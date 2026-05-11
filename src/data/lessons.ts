import { Module } from '../types';

export const MODULES: Module[] = [
  {
    id: 'basics',
    title: 'The Foundation',
    description: 'Learn the core of Excel: Summing numbers and basic arithmetic.',
    unlocked: true,
    difficulty: 'Easy',
    lessons: [
      {
        id: 'sum-1',
        title: 'Your First Formula',
        description: 'The =SUM() function is the heart of Excel.',
        instructions: 'In cell B5, calculate the total cost of all items using =SUM(B1:B4).',
        initialData: {
          'A1': 'Apples', 'B1': 10,
          'A2': 'Bananas', 'B2': 5,
          'A3': 'Cherries', 'B3': 15,
          'A4': 'Dates', 'B4': 8,
          'A5': 'TOTAL', 'B5': ''
        },
        targetCell: 'B5',
        expectedResult: 38,
        correctFormula: '=SUM(B1:B4)',
        hints: [
          "Start every formula with an equals sign (=).",
          "Use SUM followed by a range like (B1:B4).",
          "The full formula should look like =SUM(B1:B4)"
        ],
        type: 'formula',
        successMessage: 'Great job! You just mastered the most used function in the world!',
        explanation: 'The =SUM() function adds up all the numbers in a range. Instead of typing =B1+B2+B3, you can just use =SUM(B1:B3) to be much faster!'
      }
    ]
  },
  {
    id: 'arithmetic-module',
    title: 'Basic Math',
    description: 'Excel is a powerful calculator.',
    unlocked: false,
    difficulty: 'Easy',
    lessons: [
      {
        id: 'arithmetic-1',
        title: 'Manual Math',
        description: 'Excel is a powerful calculator.',
        instructions: 'In cell C2, calculate the profit for bananas. Subtract the cost (B2) from the price (A2).',
        initialData: {
          'A1': 'Price', 'B1': 'Cost', 'C1': 'Profit',
          'A2': 10, 'B2': 4, 'C2': ''
        },
        targetCell: 'C2',
        expectedResult: 6,
        correctFormula: '=A2-B2',
        hints: [
          "Formulas can use cell references directly.",
          "Use the minus sign (-) to subtract.",
          "Try entering =A2-B2"
        ],
        type: 'formula',
        successMessage: 'Perfect! You can mix and match cells just like variables in math.',
        explanation: 'Cell references act like placeholders. If you change the price in A2, the profit in C2 will update automatically!'
      }
    ]
  },
  {
    id: 'stats',
    title: 'Data Insights',
    description: 'Find patterns in your data using stats functions.',
    unlocked: false,
    difficulty: 'Medium',
    lessons: [
      {
        id: 'avg-1',
        title: 'Finding the Average',
        description: 'The AVERAGE() function helps you find the middle ground.',
        instructions: 'Calculate the average score of the students in cell B6.',
        initialData: {
          'A1': 'Student', 'B1': 'Score',
          'A2': 'Alice', 'B2': 85,
          'A3': 'Bob', 'B3': 92,
          'A4': 'Charlie', 'B4': 78,
          'A5': 'David', 'B5': 88,
          'A6': 'Average', 'B6': ''
        },
        targetCell: 'B6',
        expectedResult: 85.75,
        hints: [
          "Use =AVERAGE(B2:B5).",
          "Check your range carefully!"
        ],
        successMessage: 'Statistically speaking, you are doing amazing!',
        explanation: 'AVERAGE finds the arithmetic mean. It sums up all values and divides by the count of numbers in that range.',
        type: 'formula'
      },
      {
        id: 'max-min-1',
        title: 'Highs and Lows',
        description: 'MAX and MIN find the largest and smallest values.',
        instructions: 'Find the highest score in B2:B5 and put it in B6.',
        initialData: {
          'A1': 'Student', 'B1': 'Score',
          'A2': 'Alice', 'B2': 88,
          'A3': 'Bob', 'B3': 76,
          'A4': 'Charlie', 'B4': 92,
          'A5': 'Diana', 'B5': 84,
          'B6': ''
        },
        targetCell: 'B6',
        expectedResult: 92,
        correctFormula: '=MAX(B2:B5)',
        hints: [
          "Use =MAX(B2:B5)",
          "MIN works exactly the same way but finds the lowest!"
        ],
        successMessage: 'You found the peak!',
        explanation: 'MAX and MIN are vital for finding outliers or identifying top performance in large datasets.',
        type: 'formula'
      }
    ]
  },
  {
    id: 'logic',
    title: 'Logic & Decisions',
    description: 'Make your spreadsheets think for themselves with logical operators.',
    unlocked: false,
    difficulty: 'Medium',
    lessons: [
      {
        id: 'if-1',
        title: 'The "IF" Decision',
        description: 'IF allows you to return one value if a condition is true, and another if false.',
        instructions: 'In B2, return "Pass" if A2 >= 50, otherwise return "Fail". Use =IF(A2>=50, "Pass", "Fail")',
        initialData: {
          'A1': 'Score', 'B1': 'Status',
          'A2': 65, 'B2': ''
        },
        targetCell: 'B2',
        expectedResult: 'Pass',
        correctFormula: '=IF(A2>=50, "Pass", "Fail")',
        hints: [
          "IF takes 3 parts: Condition, Result if True, Result if False.",
          "Text values must be in double quotes.",
          "Try =IF(A2>=50, \"Pass\", \"Fail\")"
        ],
        successMessage: 'You are a logic master!',
        explanation: 'Numerical comparisons like >= (greater than or equal) are the backbone of many Excel reports.',
        type: 'formula'
      },
      {
        id: 'count-1',
        title: 'Counting Entries',
        description: 'COUNT tells you how many numeric entries are in a range.',
        instructions: 'Count the number of items in B2:B5 in cell B6.',
        initialData: {
          'A1': 'Item', 'B1': 'Price',
          'A2': 'Apple', 'B2': 1.2,
          'A3': 'Banana', 'B3': 0.5,
          'A4': 'Cherry', 'B4': 2.0,
          'A5': 'Date', 'B5': 3.5,
          'B6': ''
        },
        targetCell: 'B6',
        expectedResult: 4,
        correctFormula: '=COUNT(B2:B5)',
        hints: [
          "Use =COUNT(B2:B5)",
          "COUNT only counts numbers, while COUNTA counts everything!"
        ],
        successMessage: 'One, two, three... Master!',
        explanation: 'COUNT is great for verifying data completeness in large reports.',
        type: 'formula'
      }
    ]
  },
  {
    id: 'text',
    title: 'Text Wizardry',
    description: 'Clean and manipulate text data like a pro.',
    unlocked: false,
    difficulty: 'Hard',
    lessons: [
      {
        id: 'concat-1',
        title: 'Joining Words',
        description: 'CONCAT merges multiple values into one string.',
        instructions: 'Join the first name (A2) and last name (B2) in C2. Hint: they need a space!',
        initialData: {
          'A1': 'First', 'B1': 'Last', 'C1': 'Full Name',
          'A2': 'John', 'B2': 'Smith', 'C2': ''
        },
        targetCell: 'C2',
        expectedResult: 'John Smith',
        correctFormula: '=CONCAT(A2, " ", B2)',
        hints: [
          "Use =CONCAT(A2, \" \", B2)",
          "Don't forget the space in quotes!"
        ],
        successMessage: 'Clean data is happy data!',
        explanation: 'CONCAT (or CONCATENATE) is essential for building readable identifiers and names from database exports.',
        type: 'formula'
      },
      {
        id: 'len-1',
        title: 'Measuring Strings',
        description: 'LEN tells you how many characters are in a cell.',
        instructions: 'Count the characters in cell A2 and put the result in B2.',
        initialData: {
          'A1': 'Product Code', 'B1': 'Length',
          'A2': 'SKU-9920-X', 'B2': ''
        },
        targetCell: 'B2',
        expectedResult: 10,
        correctFormula: '=LEN(A2)',
        hints: [
          "Use =LEN(A2)",
          "Spaces and hyphens also count as characters!"
        ],
        type: 'formula',
        successMessage: 'Character count perfect!',
        explanation: 'LEN is often used with IF to validate that data (like IDs or passwords) has the correct length.'
      }
    ]
  },
  {
    id: 'advanced-data',
    title: 'Data Ninja',
    description: 'Use advanced tools like SUMIF and IFERROR.',
    unlocked: false,
    difficulty: 'Hard',
    lessons: [
      {
        id: 'sumif-1',
        title: 'Conditional Summing',
        description: 'SUMIF adds values that meet a specific criteria.',
        instructions: 'Total the values in B2:B5 only if they are greater than 100. Enter the formula in B6.',
        initialData: {
          'A1': 'Category', 'B1': 'Amount',
          'A2': 'Sales', 'B2': 150,
          'A3': 'Tax', 'B3': 20,
          'A4': 'Sales', 'B4': 200,
          'A5': 'Tax', 'B5': 40,
          'B6': ''
        },
        targetCell: 'B6',
        expectedResult: 350,
        correctFormula: '=SUMIF(B2:B5, ">100")',
        hints: [
          "Use =SUMIF(B2:B5, \">100\")",
          "Criteria like \">100\" must be in quotes."
        ],
        type: 'formula',
        successMessage: 'Strategic sums completed!',
        explanation: 'SUMIF is incredibly powerful for filtering data directly within a calculation.'
      },
      {
        id: 'round-1',
        title: 'Rounding Off',
        description: 'The ROUND function cleans up long decimals.',
        instructions: 'Round the average in A2 to 2 decimal places in cell B2.',
        initialData: {
          'A1': 'Average', 'B1': 'Rounded',
          'A2': 85.12345, 'B2': ''
        },
        targetCell: 'B2',
        expectedResult: 85.12,
        correctFormula: '=ROUND(A2, 2)',
        hints: [
          "=ROUND(A2, 2)",
          "The 2 represents the number of digits after the decimal point."
        ],
        type: 'formula',
        successMessage: 'Precision achieved!',
        explanation: 'Rounding is standard practice for financial reports and presentations.'
      },
      {
        id: 'vlookup-1',
        title: 'The Great Lookup',
        description: 'VLOOKUP searches for a value in the first column of a table.',
        instructions: 'Find the price of "Apple" using =VLOOKUP("Apple", A2:B5, 2).',
        initialData: {
          'A1': 'Item', 'B1': 'Price',
          'A2': 'Apple', 'B2': 1.2,
          'A3': 'Banana', 'B3': 0.5,
          'A4': 'Cherry', 'B4': 2.0,
          'A5': 'Date', 'B5': 3.5,
          'B6': ''
        },
        targetCell: 'B6',
        expectedResult: 1.2,
        correctFormula: '=VLOOKUP("Apple", A2:B5, 2)',
        hints: [
          "Use =VLOOKUP(\"Apple\", A2:B5, 2)",
          "1st arg: search value, 2nd: range, 3rd: column index (2 for Price)."
        ],
        type: 'formula',
        successMessage: 'Data retrieved!',
        explanation: 'VLOOKUP is the most famous search function in Excel.'
      },
      {
        id: 'iferror-1',
        title: 'Error Handling',
        description: 'IFERROR catches errors and shows a friendly message instead.',
        instructions: 'The formula in B2 might fail (dividing by zero). Use IFERROR in B2 to show 0 if an error occurs. (Note: Formula is A2/B1)',
        initialData: {
          'A1': 'Value', 'B1': 0, 'A2': 100, 'B2': ''
        },
        targetCell: 'B2',
        expectedResult: 0,
        correctFormula: '=IFERROR(A2/B1, 0)',
        hints: [
          "Use =IFERROR(A2/B1, 0)",
          "The first part is the formula, the second is the fallback value."
        ],
        type: 'formula',
        successMessage: 'No more confusing #DIV/0! errors!',
        explanation: 'IFERROR keeps your spreadsheets looking professional by hiding technical error codes.'
      }
    ]
  },
  {
    id: 'mathematical-elite',
    title: 'Mathematical Elite',
    description: 'Master higher-order calculations.',
    unlocked: false,
    difficulty: 'Expert',
    lessons: [
      {
        id: 'sumproduct-1',
        title: 'The Multiplier',
        description: 'SUMPRODUCT multiplies ranges and then sums them.',
        instructions: 'Calculate the total value by multiplying Price (A2:A3) by Quantity (B2:B3). Put the result in B4.',
        initialData: {
          'A1': 'Price', 'B1': 'Qty',
          'A2': 10, 'B2': 2,
          'A3': 5, 'B3': 4,
          'B4': ''
        },
        targetCell: 'B4',
        expectedResult: 40,
        correctFormula: '=SUMPRODUCT(A2:A3, B2:B3)',
        hints: [
          "Use =SUMPRODUCT(A2:A3, B2:B3)",
          "This equals (10*2) + (5*4)."
        ],
        type: 'formula',
        successMessage: 'Elite calculation complete!',
        explanation: 'SUMPRODUCT is a heavy hitter for weighted averages and inventory totals.'
      }
    ]
  },
  {
    id: 'date-time',
    title: 'Time Traveler',
    description: 'Work with dates and times.',
    unlocked: false,
    difficulty: 'Hard',
    lessons: [
      {
        id: 'today-1',
        title: 'Present Moment',
        description: 'TODAY() returns the current date.',
        instructions: 'Enter the current date function in A1.',
        initialData: {
          'A1': ''
        },
        targetCell: 'A1',
        expectedResult: new Date().toLocaleDateString(),
        hints: [
          "Use =TODAY()",
          "This function takes no arguments!"
        ],
        type: 'formula',
        successMessage: 'Timely work!',
        explanation: 'TODAY is dynamic—it updates every time you open the spreadsheet.'
      }
    ]
  }
];
