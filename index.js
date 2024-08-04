const inquirer = require('inquirer');
const fs = require('fs');
const generateMarkdown = require('./utils/generateMarkdown');

function verifyYouTubeLink(url) {
  const regex = /^(https:\/\/www\.youtube\.com\/watch\?v=|https:\/\/youtu\.be\/)([\w-]{11})(?:&.*)?$/;
  const match = url.match(regex);

  if (!match) {
    return "Invalid YouTube URL format";
  }
  const videoId = match[2];
  const embedCode = `<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;

  return embedCode;
}

const validation = (name) => {
  return value => {
    if (name === 'title' && (value.trim().length < 5 || value.trim().length > 10)) {
      return `A proper name please, can't be too long or too short around 5 - 10 characters.`;
    }
    if (name === 'description' && value.trim().length < 99) {
      return `Type at least 99 characters to make a reasonable description!`;
    }
    else if ([
      'motivation',
      'buildReason',
      'problem',
      'learning',
      'installation',
      'usage'
      ].includes(name) && value.trim().length < 20) {
      return `Type at least 20 characters to make an expression.` 
    }
    else if (name === 'screenshot') {
      const segments = value.split('/');
      const numberOfAttributes = segments.length;
      const numberOfSlashes = value.split('/').length - 1;

      if (numberOfSlashes !== 2 || numberOfAttributes !== 3) {
        return `Type in a valid path with 1 asset folder, 1 image folder, and 1 file.`;
      } else {
        const lastSegment = segments[2];
        if (!lastSegment.includes('.')) {
          return `Type in a valid path with 1 asset folder, 1 image folder, and 1 file.`;
        }
      }
    }
    else if (name === 'youtube-link') {
      const url = value;
      const regex = /^(https:\/\/www\.youtube\.com\/watch\?v=|https:\/\/youtu\.be\/)([\w-]{11})(?:&.*)?$/;
      const match = url.match(regex);

      if (!match) {
        return "Invalid YouTube URL format";
      }
    }
    return true;
  }
}

const questions = [
  {
    type: 'input',
    name: 'title',
    message: "What is the title of your project?\n",
    validate: validation('title')
  },
  {
    type: 'editor',
    name: 'description',
    message: "Provide a detailed description explaining the what, why, and how of your project.\n",
    validate: validation('description')
  },
  {
    type: 'input',
    name: 'motivation',
    message: "What was your motivation?\n",
    validate: validation('motivation')
  },
  {
    type: 'input',
    name: 'buildReason',
    message: "Why did you build this project?\n",
    validate: validation('buildReason')
  },
  {
    type: 'input',
    name: 'problem',
    message: "What problem does it solve?\n",
    validate: validation('problem')
  },
  {
    type: 'editor',
    name: 'learning',
    message: "What did you learn?\n",
    validate: validation('learning')
  },
  {
    type: 'editor',
    name: 'installation',
    message: "What are the steps required to install your project?\n",
    validate: validation('installation')
  },
  {
    type: 'input',
    name: 'usage',
    message: "Provide instructions and examples for use.\n",
    validate: validation('usage')
  },
  {
    type: 'input',
    name: 'screenshot',
    message: "Provide the relative filepath to a screenshot (e.g., assets/images/screenshot.png).\n",
    validate: validation('screenshot')
  },
  {
    type: 'input',
    name: 'youtube-link',
    message: "Provide the YouTube link for your project demo.\n",
    validate: validation('youtube-link')
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
      const badges = input.split(',').map(badge => badge.trim());
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
    return `![${name}](https://img.shields.io/badge/${encodeURIComponent(name)}-${encodeURIComponent(version)}-${encodeURIComponent(color)})`
  }).join(' ');
}

function generateScreenshot(path) {
  const [asset, images, pic] = path.split('/').map(pa => pa.trim());
  return `![${pic.split('.')[0]}](./${asset}/${images}/${pic})`
}

function generateYouTubeLink(url) {
  const markdownString = verifyYouTubeLink(url);
  if (markdownString.startsWith("Invalid") || markdownString.startsWith("Network")) {
    console.log(markdownString);
    return "";
  }
  return markdownString;
}

// TODO: Create a function to initialize app
function init() {
  inquirer.prompt(questions).then((answers) => {
    if (answers.includeBadges) {
      answers.badges = generateBadges(answers.badges);
    }
    answers.screenshot = generateScreenshot(answers.screenshot);
    answers.youtubeLink = verifyYouTubeLink(answers['youtube-link']);
    const readmeContent = generateMarkdown(answers);

    function toTitleCase(title) {
      return title
        .toLowerCase()
        .split(/[\s-_]+/) // Regular expression to split by space, hyphen, or underscore
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }

    answers.title = toTitleCase(answers.title);

    function toCamelCase(str) {
      return str
        .toLowerCase()
        .split(/[\s-_]+/) // Regular expression to split by space, hyphen, or underscore
        .map((word, index) => index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1))
        .join('');
    }

    const fileName = toCamelCase(answers.title);
    writeToFile(fileName, readmeContent);
  });
}

// Function call to initialize app
init();

