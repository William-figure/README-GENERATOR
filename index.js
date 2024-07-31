// TODO: Include packages needed for this application
const inquirer = require('inquirer')
const fs = require('fs')
const generateMarkdown = require('./utils/generateMarkdown')
// TODO: Create an array of questions for user input
const questions = [
  {
    type: 'input',
    name: 'title',
    message: "What is the title of your project?",
  },
  {
    type: 'input',
    name: 'description',
    message: "Provide a short description explaining the what, why, and how of your project.",
  },
  {
    type: 'input',
    name: 'motivation',
    message: "what was your motivation?",
  },
  {
    type: 'input',
    name: 'buildReason',
    message: "why did you build this project?",
  },
  {
    type: 'input',
    name: 'problem',
    message: "What problem does it solve?",
  },
  {
    type: 'input',
    name: 'learning',
    message: "What did you learn?",
  },
  {
    type: 'inupt',
    name: 'installation',
    message: "What are the steps required to install your project?",
  },
  {
    type: 'input',
    name: 'usage',
    message: "Provide instructions and examples for use.",
  },
  {
    type: 'input',
    name: 'screenshot',
    message: "Provide the relative filepath to a screenshot (e.g., assets/images/screenshot.png).",
  },
  { 
    type: 'confirm',
    name: 'includeCredits',
    message: "Would you like to include credits?",
    default: false,
  },
  {
    type: 'input',
    name: 'credits',
    message: "List your collaborators with links to their GitHub profiles.",
    when: (answers) => answers.includeCredits,
  },
  {
    type: 'input',
    name: 'license',
    message: "What license are you using for your project?",
  },
  {
    type: 'confirm',
    name: 'includeBadges',
    message: "Would you like to include badges?",
    default: false,
  },
  {
    type: 'input',
    name: 'badges',
    message: "Provide any badges for your project.",
    when: (answers) => answers.includeBadges,
  },
  {
    type: 'confirm',
    name: 'includeFeatures',
    message: "Would you like to include features?",
    default: false,
  },
  {
    type: 'input',
    name: 'features',
    message: "List the features of your project.",
    when: (answers) => answers.includeFeatures,
  },
  {
    type: 'confirm',
    name: 'includeContribute',
    message: "Would you like to include guidelines for contributing?",
    default: false,
  },
  {
    type: 'input',
    name: 'contribute',
    message: "Provide guidelines on how to contribute to your project.",
    when: (answers) => answers.includeContribute,
  },
  {
    type: 'confirm',
    name: 'includeTests',
    message: "Would you like to include tests?",
    default: false,
  },
  {
    type: 'input',
    name: 'tests',
    message: "Provide examples on how to run tests for your application.",
    when: (answers) => answers.includeTests,
  }
];

// TODO: Create a function to write README file
function writeToFile(fileName, data) {
  fs.writeFile(`${fileName}.md`, data, (err) =>
    err ? console.log(err) : console.log(`Successfully created ${fileName}.md!`))
}

// TODO: Create a function to initialize app
function init() {
  inquirer.prompt(questions).then((answers) => {
    const readmeContent = generateMarkdown.generateMarkdown(answers)
    const fileNameOriginal = answers.title
    const fileNamehasSpaces = fileNameOriginal.includes(" ")
    const fileNameWithoutSpaces = ''
    if (fileNamehasSpaces) {
      fileNameWithoutSpaces = fileNameOriginal.replace(/ /g, "_")
    }
    else {
      fileNameWithoutSpaces = fileNameOriginal
    }

    writeToFile(fileNameWithoutSpaces, readmeContent)

  })
}

// Function call to initialize app
init();


// a test for setup
// const questions = [{
//   type: 'input',
//   name: 'name',
//   message: "What's your name?"
// }];

// inquirer.prompt(questions).then(answers => {
//   const username = answers.name
//   const message = `Hello, ${answers.name}.`
//   fs.appendFile('example.txt', `${message}\n` ,(err) =>
//     err ? console.log(err) : console.log('Successfully created example.txt!')
//   )
// });

