var path = require('path'),
    _nodeEnv = process.env.NODE_ENV || 'dev',
    _nodeIP = process.env.NODE_IP || '127.0.0.1',
    _nodePort = process.env.NODE_PORT || 3000,
    _publicPath = path.join(__dirname, '../public'),
    _viewsPath = path.join(__dirname, '../views'),
    _oembedApiKey = '1e9d27d76b02e60bc0afdf',
    _email = {
      dev: {
        contact: 'sandro.csimas@gmail.com',
        apiKey: 'key-8k25kie96mv1wpdi01gnqu47-nos-0y1',
        domain: 'promessadepolitico.com.br'
      },
      prod: {
        contact: 'sandro.csimas@gmail.com',
        apiKey: 'key-8k25kie96mv1wpdi01gnqu47-nos-0y1',
        domain: 'promessadepolitico.com.br'
      }
    },
    _database = {
      dev: {
        dialect: 'mysql',
        host: 'localhost',
        user: 'root',
        password: 'sandroa1s2d3',
        schema: 'promessa_de_politico',
        charset: 'utf8'
      },
      prod: {
        dialect: 'mysql',
        host: 'localhost',
        user: 'root',
        password: 'roota1s2d3',
        schema: 'promessa_de_politico',
        charset: 'utf8'
      }
    },
    _facebook = {
      dev: {
        clientID: '235774129950285',
        clientSecret: '329ada86e67ca322ae5c56af8f5a167d',
        callbackURL: 'http://www.promessadepolitico.com.br:' + _nodePort + '/auth/facebook/callback',
        profileFields: ['name', 'displayName', 'gender', 'picture.type(small)', 'emails']
      },
      prod: {
        clientID: '235774129950285',
        clientSecret: '329ada86e67ca322ae5c56af8f5a167d',
        callbackURL: 'http://www.promessadepolitico.com.br/auth/facebook/callback',
        profileFields: ['name', 'displayName', 'gender', 'picture.type(small)', 'emails']
      }
    },
    _twitter = {
      dev: {
        consumerKey: 'SXAZVFlQalUVp1hZwFX2gYK0l',
        consumerSecret: '0gmtYviV8VpASXmtLG5cLB41jI8ofcAVIP7Wfy16tIGoUXAGmX',
        callbackURL: 'http://www.promessadepolitico.com.br:' + _nodePort + '/auth/twitter/callback'
      },
      prod: {
        consumerKey: 'SXAZVFlQalUVp1hZwFX2gYK0l',
        consumerSecret: '0gmtYviV8VpASXmtLG5cLB41jI8ofcAVIP7Wfy16tIGoUXAGmX',
        callbackURL: 'http://www.promessadepolitico.com.br/auth/twitter/callback'
      }
    },
    _google = {
      dev: {
        clientID: '37782263354-thqn9d44li64finmomvf5es38h0f4r73.apps.googleusercontent.com',
        clientSecret: 'x1TrI6h07SjHyWzQA_Tjpsk1',
        callbackURL: 'http://www.promessadepolitico.com.br:' + _nodePort + '/auth/google/callback'
      },
      prod: {
        clientID: '37782263354-thqn9d44li64finmomvf5es38h0f4r73.apps.googleusercontent.com',
        clientSecret: 'x1TrI6h07SjHyWzQA_Tjpsk1',
        callbackURL: 'http://www.promessadepolitico.com.br/auth/google/callback'
      }
    }

console.log('Using ' + _nodeEnv + ' environment settings');

module.exports = {
  nodeEnv: _nodeEnv,
  nodePort: _nodePort,
  nodeIP: _nodeIP,
  publicPath: _publicPath,
  viewsPath: _viewsPath,
  email: _email[_nodeEnv],
  database: _database[_nodeEnv],
  facebook: _facebook[_nodeEnv],
  twitter: _twitter[_nodeEnv],
  google: _google[_nodeEnv],
  oembedApiKey: _oembedApiKey
};