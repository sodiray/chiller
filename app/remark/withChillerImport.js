const { addNamedImport } = require('./utils')

module.exports.withChillerImport = () => {
  return (tree) => {
    addNamedImport(tree, 'src/components/mdx', 'Chiller')
  }
}
