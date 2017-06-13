const matter = require('gray-matter');
const replace = require('replace-in-file');
const moment = require('moment');
const yaml = require('yamljs');
const toTitleCase = require('titlecase');
const chalk = require('chalk');
const error = chalk.bold.red;

// If you want to use something other than lastUpdate change this var
const propertyName = 'updated';
const contentDir = 'site/content/**/*.{md,html}';
const dateFormat = 'MMMM Do, YYYY';

function updateFrontMatter(path, cb) {
  const regex = /^---[\s\S]*?---/;
  const fm = matter.read(path);
  fm.data[propertyName] = moment().format(dateFormat);
  fm.data.tags = capitalizeTags(fm.data.tags, fm.data.title);

  const output = '---\n' + yaml.stringify(fm.data) + '---';

  replace({
    files: path,
    from: regex,
    to: output
  }, (err, files) => {
    if (err) return cb(err);
    if (cb) cb();
  });
}

function capitalizeTags(tags, title) {
  if (!tags || tags === []) return console.log(error(`You must include at least one tag on ${title}`));
  return tags.map(tag => toTitleCase(tag)).sort();
}

module.exports.update = updateFrontMatter;
