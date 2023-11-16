import { execCommand } from './utils';
import pgk from '../package.json';

const filesToCommit = 'package.json package-lock.json CHANGELOG.md';
const commitMessage = `Bump up library version to ${pgk.version}`;
const tagName = `v${pgk.version}`;
const defaultBranch = 'main';

execCommand(
    `git add ${filesToCommit} && git commit --no-verify -m '${commitMessage}' && git push origin ${defaultBranch}`
);
execCommand(`git tag ${tagName} && git push origin ${tagName}`);
