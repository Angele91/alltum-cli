import axios from 'axios'
import simpleGit, {SimpleGit} from 'simple-git'

/**
 * Creates a pull request on the specified origin repository.
 *
 * @param {object} options - An object containing the options for creating the pull request.
 * @param {string} options.origin - The URL of the origin repository.
 * @param {string} options.title - The title of the pull request.
 * @param {object} options.head - An object containing the owner, repo, and branch of the head.
 * @param {object} options.base - An object containing the branch of the base.
 * @param {string} options.body - The body of the pull request.
 * @param {string} options.token - The personal access token for authentication.
 * @return {void} - This function does not return a value.
 */
export const createPullRequest = async (options: {
  title: string;
  head: { owner: string; repo: string; branch: string };
  base: string;
  body: string;
  token: string;
}): Promise<void> => {
  const url = `https://api.github.com/repos/${options.head.owner}/${options.head.repo}/pulls`

  console.log(`Creating in ${url}`)

  const data = {
    title: options.title,
    head: options.head.branch,
    base: options.base,
    body: options.body,
  }

  const config = {
    headers: {
      Authorization: `Bearer ${options.token}`,
    },
  }

  await axios.post(url, data, config)
}

/**
 * Retrieves the pull request template from the specified GitHub repository.
 *
 * @param {string} owner - The owner of the repository.
 * @param {string} repo - The name of the repository.
 * @param {string} token - The authorization token.
 * @return {Promise<void>} A Promise that resolves when the template is retrieved successfully.
 */
export const getPullRequestTemplate = async (owner: string, repo: string, token: string): Promise<string> => {
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/.github/PULL_REQUEST_TEMPLATE.md`
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.get(url, config)
  const content = Buffer.from(response.data.content, 'base64').toString('utf-8')

  return content
}

/**
 * Retrieves the name of the repository associated with the 'origin' remote.
 *
 * @return {Promise<string|null>} The name of the repository if found, otherwise null.
 */
export const getRepoName = async (): Promise<string | undefined | null> => {
  const git = simpleGit()
  const remotes = await git.getRemotes(true)
  const originRemote = remotes.find((remote: { name: string; }) => remote.name === 'origin')

  if (originRemote?.refs?.fetch) {
    const fetchUrl = originRemote.refs.fetch
    const repoName = fetchUrl.split('/').pop()?.replace('.git', '')
    return repoName
  }

  return null
}

export const setMyselfAsAssignee = async (taskId: string, clickupToken: string): Promise<void> => {
  const url = `https://api.clickup.com/api/v2/task/${taskId}/assignees`
  const config = {
    headers: {
      Authorization: clickupToken,
      'Content-Type': 'application/json',
    },
  }

  await axios.put(url, {assignees: ['@me']}, config)
}

export const setTaskStatus = async (accessToken: string, taskId: string, statusId: string): Promise<void> => {
  const url = `https://api.clickup.com/api/v2/task/${taskId}`
  const config = {
    headers: {
      Authorization: accessToken,
      'Content-Type': 'application/json',
    },
  }

  const data = {
    status: statusId,
  }

  await axios.put(url, data, config)
}

export const getPRTemplate = (
  taskId: string,
  taskName: string,
  listOfChanges: string[],
): string => (`## Related Task
> ClickUp card related to the changes on this pull request. If the \`Type of Change\` is \`Release\` all the related cards should be listed.

[${taskName}](${taskId})

## Preview
> GIF/image reflecting the changes to the UI, if any

## Type of Change

- [ ] **Issue fix** (non-breaking change which fixes an issue reported on STG/UAT)
- [ ] **Live issue fix** (non-breaking change which fixes an issue reported on PROD)
- [ ] **Feature** (non-breaking change which adds a new functionality)
- [ ] **Breaking change** (fix or feature that would cause existing functionality not to work as expected)
- [ ] **Release**

## List of Changes
> High level description of the changes added to the codebase. If the \`Type of Change\` is \`Release\`, this section can be removed.

${listOfChanges.map(change => `- ${change}`).join('\n')}

## Prerequisites to Merge
> Requirements that must be met before merging this pull request

- [ ] Manual tests were done
- [ ] My code follows the team's guidelines
- [ ] I've added unit tests to cover my changes

## Actions after Merge
> Requirements that must be met after merging this pull request. Use \`N/A\` if no actions are required.

- N/A
`)

export const getCommitMessages = async (): Promise<string[]>  => {
  const git: SimpleGit = simpleGit()

  const logSummary = await git.log()

  const commitMessages: string[] = logSummary.all.map(commit => `- ${commit.message}`)

  return commitMessages
}

export const getOriginOwner = async (): Promise<string | undefined> => {
  const git: SimpleGit = simpleGit()

  const remotes = await git.getRemotes(true)

  const originRemote = remotes.find(remote => remote.name === 'origin')

  if (originRemote) {
    const originUrl: string = originRemote.refs.fetch
    console.log(originUrl)
    let owner: string | undefined

    if (originUrl.startsWith('http')) {
      const httpOwnerMatch: RegExpMatchArray | null = originUrl.match(/https?:\/\/[^/]+\/([^/]+)\/[^/]+$/)
      owner = httpOwnerMatch ? httpOwnerMatch[1] : undefined
    } else if (originUrl.startsWith('git')) {
      const sshOwnerMatch: RegExpMatchArray | null = originUrl.match(/git@[^:]+:([^/]+)\/[^/]+$/)
      owner = sshOwnerMatch ? sshOwnerMatch[1] : undefined
    }

    return owner
  }

  return undefined
}
