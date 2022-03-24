#!/usr/bin/env node

import inquirer from 'inquirer';
import shell from 'shelljs';
import Listr from 'listr';
import path from 'path';
import {
  addRemote,
  addToGit,
  createFirstCommit,
  createRepo,
  goodbye,
  initializeRepo,
  pushRepo,
} from './utils.js';

const userName = 'gbrachetta';
const currentFileUrl = import.meta.url;

const templatesPath = path.resolve(
  new URL(currentFileUrl).pathname,
  '../templates',
);

const goAhead = async (repoName, repoDescription, repoType) => {
  const tasks = new Listr([
    {
      title: 'Initialize Repository',
      task: () => initializeRepo(),
    },
    {
      title: 'Add .gitignore',
      task: () => shell.cp('-R', `${templatesPath}/.gitignore`, './'),
    },
    {
      title: 'Add files to stage',
      task: () => addToGit(),
    },
    {
      title: 'Create First Commit',
      task: () => createFirstCommit(),
    },
    {
      title: 'Create Repo',
      task: () => createRepo(repoName, repoDescription, repoType),
    },
    {
      title: 'Add Github Remote',
      task: () => addRemote(repoName),
    },
    {
      title: 'Push to Github',
      task: () => pushRepo(),
    },
  ]);
  await tasks.run();
  goodbye(repoName, userName);
};

const start = () =>
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'repoName',
        message: 'What is the name of the repository?',
        default: 'my-repo-name',
      },
      {
        type: 'input',
        name: 'repoDescription',
        message: 'Please enter a description',
        default: 'Repository description',
      },
      {
        type: 'list',
        name: 'repoType',
        message: 'What type of repository is this?',
        choices: ['public', 'private'],
      },
    ])
    .then(({ repoName, repoDescription, repoType }) => {
      goAhead(repoName, repoDescription, repoType);
    });

start();
