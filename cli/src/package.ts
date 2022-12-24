import fse from 'fs-extra'
import path from 'path'

const pkg = fse.readJsonSync(path.join(__dirname, '../package.json'))

export default pkg as { version: string }
