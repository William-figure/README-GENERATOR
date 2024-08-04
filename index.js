// TODO: Include packages needed for this application
const inquirer = require('inquirer')
const fs = require('fs')
const generateMarkdown = require('./utils/generateMarkdown')
const validation = (name) => {
  return value => {
    if (name === 'title' && (value.trim().length < 5 || value.trim().length > 10)) {
      return `a proper name please, can't be too long or too short around 5 - 10 characters`
    }
    if (name === 'description' && value.trim().length < 50) {
      return `you can't be that lazy, write at least 50 characters to make a reasonable description!`} else if (['motivation', 'buildReason', 'problem', 'learning', 'installation', 'usage', 'screenshot'].includes(name) && value.trim().length < 20) {
      return `your project can't be that pointless, write at least 20 characters!`
    }     
    return true
  }
}
// TODO: Create an array of questions for user input
const questions = [
  {
    type: 'editor',
    name: 'title',
    message: "What is the title of your project?\n",
    validate: validation(`title`)
  },
  {
    type: 'editor',
    name: 'description',
    message: "Provide a short description explaining the what, why, and how of your project.\n",
    validate: validation(`description`)
  },
  {
    type: 'editor',
    name: 'motivation',
    message: "what was your motivation?\n",
    validate: validation(`motivation`)
  },
  {
    type: 'editor',
    name: 'buildReason',
    message: "why did you build this project?\n",
    validate: validation(`buildReason`)
  },
  {
    type: 'editor',
    name: 'problem',
    message: "What problem does it solve?\n",
    validate: validation(`problem`)
  },
  {
    type: 'editor',
    name: 'learning',
    message: "What did you learn?\n",
    validate: validation(`learning`)
  },
  {
    type: 'editor',
    name: 'installation',
    message: "What are the steps required to install your project?\n",
    validate: validation(`installation`)
  },
  {
    type: 'editor',
    name: 'usage',
    message: "Provide instructions and examples for use.\n",
    validate: validation(`usage`)
  },
  {
    type: 'editor',
    name: 'screenshot',
    message: "Provide the relative filepath to a screenshot (e.g., assets/images/screenshot.png).\n",
    validate: validation(`screenshot`)
  },
  { 
    type: 'confirm',
    name: 'includeCredits',
    message: "Would you like to include credits?\n",
    default: false,
  },
  {
    type: 'input',
    name: 'credits',
    message: "List your collaborators with links to their GitHub profiles.\n",
    when: (answers) => answers.includeCredits,
  },
  {
    type: 'input',
    name: 'license',
    message: "What license are you using for your project?\n",
  },
  {
    type: 'confirm',
    name: 'includeBadges',
    message: "Would you like to include badges?\n",
    default: false,
  },
  {
    type: 'input',
    name: 'badges',
    message: "Provide any badges in the format 'name:version:color' separated by commas (e.g., 'Node.js:14.17.0:green, npm:6.14.13:red').\n",
    when: (answers) => answers.includeBadges,
    validate: (input) => {
      const badges = input.split(',').map(badge => badge.trim())
      const badgeFormat = /^[a-zA-Z0-9_.+-]+:[a-zA-Z0-9_.+-]+:[a-zA-Z]+$/;

      for (const badge of badges) {
        if (!badgeFormat.test(badge)) {
          return `Invalid format: ${badge}. Please use 'name:version:color' format.`;
        }
      }
      return true;
    }
  },
  {
    type: 'confirm',
    name: 'includeFeatures',
    message: "Would you like to include features?\n",
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

function generateBadges(badges) {
  return badges.split(',').map(badge => {
    const [name, version, color] = badge.split(':').map(part => part.trim());
    return `![${name}](https://img.shields.io/badge/(${encodeURIComponent(name)}-${encodeURIComponent(version)}-${encodeURIComponent(color)}))`
  }).join(' ');
}
// TODO: Create a function to initialize app
function init() {
  inquirer.prompt(questions).then((answers) => {
    if (answers.includeBadges) {
      answers.badges = generateBadges(answers.badges);
    }
    const readmeContent = generateMarkdown(answers)
    const fileNameOriginal = answers.title
    let fileNameWithoutSpaces = fileNameOriginal.replace(/ /g, "_")

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

