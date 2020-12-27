# mdn-revisions-profile-scrapper (ARCHIVED)

This project has the objective to calculate the amount of unique translations a profile has done in the MDN community.

## Archiving reason

**This project has been archived because MDN changed it's content management system to Yari, then the revisions panel doesn't exists anymore, turning this project useless.**

## Installation

Run `yarn install` to install the apropriate packages, then create an `.env` file like the example available in the project, and replace the variables with the Cookies of your user in the MDN page, you must have an MDN account to have this variables and execute the project. `LOCALE` is the language your normally use as default for your profile, `GAT` is usually "1", not 100% sure about that...

The project uses `geckodriver` to make the scraping of the pages, check if it's correctly installed and in $PATH of the system so the script can use it.

## Run

Just run with `node index.js` command and wait the script to end the scraping, it may too a while depending on how much pages the profile has.
