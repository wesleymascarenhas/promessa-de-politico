var _nodeEnv = process.env.NODE_ENV || 'dev',
    _nodeIP = process.env.NODE_IP || '127.0.0.1',
    _nodePort = process.env.NODE_PORT || 8000,
    _databaseDialect = 'mysql',
    _databaseHost = 'localhost',
    _databaseUser = 'root',
    _databasePassword = 'sandroa1s2d3',
    _databaseSchema = 'promessas',
    _databaseCharset = 'utf8',
    _facebook = {
      dev: {
        clientID: '1435485623336603',
        clientSecret: '2d188ce45df24e3a28c948b46c4c05bd',
        callbackURL: 'http://www.brasilpromessas.com.br:8000/auth/facebook/callback'
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