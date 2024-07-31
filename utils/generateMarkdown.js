// TODO: Create a function that returns a license badge based on which license is passed in
// If there is no license, return an empty string
function renderLicenseBadge(license) {
  if (!license) {
    return '';
  }
  return `![License](https://img.shields.io/badge/License-${encodeURIComponent(license)}-brightgreen)`
}

// TODO: Create a function that returns the license link
// If there is no license, return an empty string
function renderLicenseLink(license) {
  if (!license) {
    return '';
  }
  return `[License](#license)`
}

// TODO: Create a function that returns the license section of README
// If there is no license, return an empty string
function renderLicenseSection(license) {
  if (!license) {
    return '';
  }
  return `## License

  This project is licensed under the ${license} license.`
}

// TODO: Create a function to generate markdown for README
function generateMarkdown(data) {
  return `# ${data.title}
  
  ${renderLicenseBadge(data.license)}

  ## Description

  ${data.description}

  - **Motivation:** ${data.motivation}
  - **Why did you build this project?:** ${data.buildReason}
  - **What problem does it solve?:** ${data.problem}
  - **What did you learn?:** ${data.learning}

  ## Table of Contents

  - [Installation](#installation)
  - [Usage](#usage)
  ${data.includeCredits ? '- [Credits](#credits)' : ''}
  - ${renderLicenseLink(data.license)}
  ${data.includeBadges ? '- [Badges](#badges)' : ''}
  ${data.includeFeatures ? '- [Features](#features)' : ''}
  ${data.includeContribute ? '- [How to Contribute](#how-to-contribute)' : ''}
  ${data.includeTests ? '- [Tests](#tests)' : ''}

  ## Installation

  ${data.installation}

  ## Usage

  ${data.usage}

  \'\'\'
  ![Screenshot]($(data.screenshot))
  \'\'\'

  ${data.includeCredits ? `## Credits

  List your collaborators with links to their GitHub profiles: ${data.credits}` : ''}

  ${rederLicenseSection(data.license)}

  ${data.includeBadges ? `## Badges

  ${data.badges}` : ''}

  ${data.includeFeatures ? `## Features

  ${data.features}` : '' }

  ${data.includeContribute ? `## How to Constribute

  ${data.contribute}` : ''}

  ${data.includeTests ? `## Tests

  ${data.tests}` : ''}

  `;
}

module.exports = generateMarkdown;
