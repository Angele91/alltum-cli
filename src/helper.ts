import axios from 'axios'
import simpleGit from 'simple-git'

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
