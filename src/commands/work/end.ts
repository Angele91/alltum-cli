/* eslint-disable no-await-in-loop */
import {Command, ux} from '@oclif/core'
import {isEmpty} from 'lodash'
import * as fs from 'node:fs'
import * as os from 'node:os'
import * as path from 'node:path'
import {createPullRequest, getCommitMessages, getOriginOwner, getPRTemplate, getRepoName, setTaskStatus} from '../../helper'
import axios from 'axios'
import simpleGit from 'simple-git'

export default class WorkEnd extends Command {
  static description = 'describe the command here'

  static examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  static flags = {}

  static args = {}

  public async run(): Promise<void> {
    if (!fs.existsSync(path.join(os.homedir(), '.alltum-config.json'))) {
      this.error('No configuration file found. Please, run `alltum init` first.')
      return
    }

    const config = JSON.parse(
      fs.readFileSync(
        path.join(os.homedir(), '.alltum-config.json'),
        'utf-8',
      ),
    )

    if (isEmpty(config.currentTask)) {
      this.error('No current task found.')
      return
    }

    const repoName = await getRepoName()
    const owner = await getOriginOwner()

    if (!repoName) {
      this.log('No origin found.')
      return
    }

    if (!owner) {
      this.log('No origin owner found.')
      return
    }

    ux.action.start(`Getting task ${config.currentTask}`)
    const response = await axios.get(`https://api.clickup.com/api/v2/task/${config.currentTask}`, {
      headers: {
        Authorization: config.clickupToken,
      },
    })
    ux.action.stop()

    const git = simpleGit()

    this.log('Getting current branch')

    const branchResult = await git.branch()
    const {current} = branchResult
    let commitMessages = await getCommitMessages()

    this.log(`This will do the following:
    1. Will push ${commitMessages.length} commits to the "${current}" branch in origin
    2. Will create a pull request for merging the current task ("${response.data.name}") in the branches you decide (optional)
    3. Will move the task to review (optional)`)

    const shouldProceed = await ux.prompt('Would you like to continue? (y/n)')

    if (shouldProceed.toLowerCase() !== 'y') {
      return
    }

    const status = await git.status()

    if (status.files.length > 0) {
      const addToStage = await ux.prompt('There are files out of stage. Do you want to add them and commit them? (y/n)')

      if (addToStage.toLowerCase() === 'y') {
        await git.add('.')
        let commitMessage = await ux.prompt('What is the commit message?')

        while (!['UPDATE:', 'FIX:', 'ADD:'].some(m => commitMessage.startsWith(m))) {
          this.log('Invalid commit message. It must start with UPDATE, FIX or ADD')
          commitMessage = await ux.prompt('What is the commit message?')
        }

        await git.commit(commitMessage)
        commitMessages = await getCommitMessages()
      }
    }

    ux.action.start(`Pushing ${commitMessages.length} commits to the "${current}" branch in origin`)
    await git.push(['--set-upstream', 'origin', current])
    ux.action.stop()

    const shouldCreatePR = await ux.prompt('Would you like to create a pull request? (y/n)')

    if (shouldCreatePR.toLowerCase() === 'y') {
      const envs = await ux.prompt('What environment do you want to create a pull request for? (e.g. development, master, uat. Divided by commas)')

      const envsArray = envs.split(',')

      for (const env of envsArray) {
        this.log(`Creating pull request for ${env}`)
        await createPullRequest({
          title: `[#${config.currentTask}] ${response.data.name}`,
          head: {
            owner,
            repo: repoName,
            branch: current,
          },
          base: env,
          body: getPRTemplate(
            config.currentTask,
            response.data.name,
            commitMessages,
          ),
          token: config.githubToken,
        })
      }
    }

    const shouldMoveToReview = await ux.prompt('Would you like to move this task to review? (y/n)')

    if (shouldMoveToReview.toLowerCase() === 'y') {
      await setTaskStatus(config.clickupToken, config.currentTask, 'review')
    }

    ux.action.stop()
    this.log('All done!')

    fs.writeFileSync(
      path.join(os.homedir(), '.alltum-config.json'),
      JSON.stringify({
        ...config,
        currentTask: undefined,
      }),
    )
  }
}
