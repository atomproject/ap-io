'use strict';

let fs = require('q-io/fs');
let path = require('path');
let fm = require('front-matter');
let Liquid = require('liquid-node');
let marked = require('marked');
let promisify = require('promisify-node');
let glob = promisify(require('glob'));
let engine = new Liquid.Engine();
let getFullConfig = require('./config').getFullConfig;
let Q = require('q');

let resolveLayout = Q.async(function* (filePath, config, queue) {
  let file = yield fs.read(path.resolve(filePath));
  let layout;

  file = fm(file);
  queue = queue || [];
  queue.push(file);

  if (file.attributes && (layout = file.attributes.layout)) {
    filePath = `${config.layoutsDir}/${layout}.html`;
    yield resolveLayout(filePath, config, queue);
  }

  return queue;
});

let renderLayout = Q.async(function* (queue, context) {
  for (let item of queue) {
    Object.assign(context.page, item.attributes);
    let content = yield engine.parseAndRender(item.body, context);
    context.content = content;
  }

  return context.content;
});

let createElementPage = Q.async(function* (elContext, config) {
  let templatePath = `${config.templatesDir}/github.html`;
  let queue = yield resolveLayout(templatePath, config);
  let fullContext = {
    site: config,
    page: elContext
  };

  let page = yield renderLayout(queue, fullContext);
  let pagePath = elContext.pageDirName;

  yield fs.makeTree(path.join('_site', pagePath));
  pagePath = path.join('_site', pagePath ,'index.html');

  yield fs.write(pagePath, page);
});

let createPage = Q.async(function* (filePath, config) {
  let exists = yield fs.exists(filePath);

  if (!exists) {
    return;
  }

  let queue = yield resolveLayout(filePath, config);
  let pathObj = path.parse(filePath);
  let context = {site: config, page: {}};

  if (config.markdownExtensions.indexOf(pathObj.ext) !== -1) {
    queue[0].body = marked(queue[0].body || '');
  }

  let page = yield renderLayout(queue, context);
  let pagesDir = path.resolve(config.pagesDir);
  let outDir = path.resolve('_site');
  pathObj = path.parse(filePath);

  outDir = path.resolve(pathObj.dir).replace(pagesDir, outDir);

  if (pathObj.name !== 'index') {
    outDir = path.join(outDir, pathObj.name);
  }

  yield fs.makeTree(outDir);
  let pagePath = path.join(outDir, `index.html`);

  console.log(`Build: ${pagePath}`);
  yield fs.write(pagePath, page);
});

module.exports = Q.async(function* () {
  let config = yield getFullConfig();

  //setup yaml parser engine
  engine.fileSystem = new Liquid.LocalFileSystem();
  engine.fileSystem.root = config.includesDir;

  //create the out dir
  yield fs.makeTree('_site');

  //create element pages
  config.elements.forEach(elContext => {
    createElementPage(elContext, config);
  });

  //create other pages
  let files = yield glob(`${config.pagesDir}/**`);
  files.forEach(filePath => createPage(filePath, config));
});
