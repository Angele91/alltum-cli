/* eslint-disable no-await-in-loop */
import {Args, Command, ux} from '@oclif/core'
import {simpleGit} from 'simple-git'
import axios from 'axios'
import * as fs from 'node:fs'
import * as os from 'node:os'
import * as path from 'node:path'
import {TYPE_CUSTOM_FIELD_ID, TaskTypes} from '../../constants'
import {isEmpty} from 'lodash'

export default class Work extends Command {
  static description = 'start working on something'

  static examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  static flags = {}

  static args = {
    taskId: Args.string({description: 'the ID of the clickup task'}),
  }

  public async run(): Promise<void> {
    const isCurrentDirARepository = await simpleGit().checkIsRepo()

    if (!isCurrentDirARepository) {
      this.log('No git repository found. You must be in a git repository to run this command.')
      return
    }

    const {args} = await this.parse(Work)

    if (!fs.existsSync(path.join(os.homedir(), '.alltum-config.json'))) {
      this.log('No configuration file found. Please, run `alltum init` first.')
    }

    const config = JSON.parse(
      fs.readFileSync(
        path.join(os.homedir(), '.alltum-config.json'),
        'utf-8',
      ),
    )

    let taskId = args.taskId

    while (isEmpty(taskId)) {
      this.log('No specified task id.')
      taskId = await ux.prompt('Task ID')
    }

    ux.action.start(`Getting task ${taskId}`)
    const response = await axios.get(`https://api.clickup.com/api/v2/task/${taskId}`, {
      headers: {
        Authorization: config.clickupToken,
      },
    })
    ux.action.stop()

    const taskName = response.data.name.toLowerCase().replaceAll(' ', '-')
    const branchSuffix = taskName.replace(/[^\s\w-]|-(?!\w)|\s+/g, '')

    const typeCustomField = response.data.custom_fields.find(
      (field: { id: string }) => field.id === TYPE_CUSTOM_FIELD_ID,
    )

    const selectedType = typeCustomField.type_config.options.find(
      (option: { orderindex: number }) => option.orderindex === typeCustomField.value,
    )

    const type = selectedType.id === TaskTypes.Bug ||
      selectedType.id === TaskTypes.Improvement ? 'i' : 'f'

    this.log(taskName)
    this.log(branchSuffix)

    ux.action.start(`Creating branch ${type}_#${args.taskId}_${branchSuffix}`)
    await simpleGit().checkoutLocalBranch(`${type}_#${args.taskId}_${branchSuffix}`)
    fs.writeFileSync(
      path.join(os.homedir(), '.alltum-config.json'),
      JSON.stringify({
        ...config,
        currentTask: taskId,
      }),
    )
    ux.action.stop()

    this.log('Ready for work!')
  }
}
