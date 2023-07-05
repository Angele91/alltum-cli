import {Command, ux} from '@oclif/core'
import {isEmpty} from 'lodash'
import * as fs from 'node:fs'
import * as os from 'node:os'
import * as path from 'node:path'
import {getRepoName} from '../../helper'
import axios from 'axios'

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

    if (!repoName) {
      this.log('No origin found.')
      return
    }

    ux.action.start(`Getting task ${config.currentTask}`)
    const response = await axios.get(`https://api.clickup.com/api/v2/task/${config.currentTask}`, {
      headers: {
        Authorization: config.clickupToken,
      },
    })
    ux.action.stop()

    this.logJson(response.data)
  }
}
