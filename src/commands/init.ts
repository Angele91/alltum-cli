import {Command, ux} from '@oclif/core'
import * as fs from 'node:fs'
import * as os from 'node:os'
import * as path from 'node:path'

export default class Init extends Command {
  static description = 'describe the command here'

  static examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  static flags = {}

  static args = {}

  public async run(): Promise<void> {
    this.log('Welcome to the Alltum CLI. Lets tight up some stuff!')
    const clickupToken = await ux.prompt('Your Clickup personal token')
    const githubToken = await ux.prompt('Your Github token')
    const username = await ux.prompt('Your name')

    ux.action.start('Saving configuration file...')
    fs.writeFileSync(
      path.join(os.homedir(), '.alltum-config.json'),
      JSON.stringify({
        clickupToken,
        githubToken,
        username,
      }),
    )
    ux.action.stop()
    this.log('Configuration file saved!')
  }
}
