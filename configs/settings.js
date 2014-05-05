var _nodeEnv = process.env.NODE_ENV || 'dev',
    _nodeIP = process.env.NODE_IP || '127.0.0.1',
    _nodePort = process.env.NODE_PORT || 8000,
    _databaseDialect = 'mysql',
    _databaseHost = 'localhost',
    _databaseUser = 'root',
    _databasePassword = 'sandroa1s2d3',
    _databaseSchema = 'promessa_de_politico',
    _databaseCharset = 'utf8',
    _facebook = {
      dev: {
        clientID: '235774129950285',
        clientSecret: '329ada86e67ca322ae5c56af8f5a167d',
        callbackURL: 'http://www.promessadepolitico.com.br:8000/auth/facebook/callback'
      }
    }

module.exports = {
  nodeEnv: _nodeEnv,
  nodePort: _nodePort,
  nodeIP: _nodeIP,
  databaseDialect: _databaseDialect,
  databaseHost: _databaseHost,
  databaseUser: _databaseUser,
  databasePassword: _databasePassword,
  databaseSchema: _databaseSchema,
  databaseCharset: _databaseCharset,
  facebook: _facebook[_nodeEnv]
};