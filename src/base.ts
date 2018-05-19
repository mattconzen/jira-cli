import Command from '@oclif/command'
import * as fs from 'fs-extra'
import * as os from 'os'
import * as path from 'path'

export default abstract class extends Command {
    static config = fs.readJsonSync(
        path.join(os.homedir(), '.jirarc')
    )
}
