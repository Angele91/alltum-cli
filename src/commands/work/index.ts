/* eslint-disable no-await-in-loop */
import {Args, Command, ux} from '@oclif/core'
import {simpleGit} from 'simple-git'
import axios from 'axios'
import * as fs from 'node:fs'
import * as os from 'node:os'
import * as path from 'node:path'
import {TYPE_CUSTOM_FIELD_ID, TaskTypes} from '../../constants'
import {isEmpty} from 'lodash'
import {setMyselfAsAssignee} from '../../helper'

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
    const git = simpleGit()
    const isCurrentDirARepository = await git.checkIsRepo()

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

    const type = (selectedType?.id === TaskTypes.Bug ||
      selectedType?.id === TaskTypes.Improvement) ? 'i' : 'f'

    const branchName = `${type}_#${taskId}_${branchSuffix}`

    ux.action.start(`Creating branch ${branchName}`)
    const localBranches = await git.branchLocal()

    if (localBranches.current === branchName) {
      this.log(`You are already in the ${branchName} branch. Doing nothing.`)
    } else if (localBranches.all.includes(branchName)) {
      this.log(`Branch ${branchName} already exists. Checking out to it.`)
      await git.checkout(branchName)
    } else {
      await git.checkoutLocalBranch(`${branchName}`)
    }

    fs.writeFileSync(
      path.join(os.homedir(), '.alltum-config.json'),
      JSON.stringify({
        ...config,
        currentTask: taskId,
      }),
    )
    ux.action.stop()

    if (response.data.status !== 'in progress') {
      const putTaskInProgress = await ux.prompt('Do you want to put the task in progress? (Y/n)')

      if (putTaskInProgress.toLowerCase() === 'y') {
        ux.action.start('Putting the task in progress')
        try {
          await axios.put(
            `https://api.clickup.com/api/v2/task/${taskId}`,
            {
              status: 'in progress',
            },
            {
              headers: {
                Authorization: config.clickupToken,
              },
            },
          )
        } catch (error) {
          this.logJson(error)
          const shouldContinue = await ux.prompt('Could not put the task in progress. Do you want to continue? (y/n)')
          if (shouldContinue.toLowerCase() !== 'y') {
            return
          }
        }

        ux.action.stop()
      }
    }

    const assignToMe = await ux.prompt('Do you want to assign the task to yourself? (Y/n)')

    if (assignToMe.toLowerCase() === 'y') {
      ux.action.start('Assigning the task to yourself')
      try {
        await setMyselfAsAssignee(taskId!, config.clickupToken)
      } catch (error) {
        this.logJson(error)
        const shouldContinue = await ux.prompt('Could not assign the task to yourself. Do you want to continue? (y/n)')
        if (shouldContinue.toLowerCase() !== 'y') {
          return
        }
      }

      ux.action.stop()
    }

    this.log('Ready for work!')
  }
}
